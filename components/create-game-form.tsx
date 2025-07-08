'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { QuizMasterCarrot } from '@/components/illustrations/carrot-characters/quiz-master-carrot';
import { useAuth } from '@/lib/auth/auth-context';
import { createClient } from '@/lib/supabase/client';
import { GameStatus } from '@/lib/types';

export function CreateGameForm() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);
  
  // Don't render the form if not authenticated
  if (authLoading) {
    return <div className="w-full max-w-md mx-auto p-6 text-center">Loading...</div>;
  }
  
  if (!user) {
    return null; // Will redirect in the useEffect
  }

  // Generate a unique 4-digit game code
  const generateUniqueGameCode = async (): Promise<string> => {
    const supabase = createClient();
    let isUnique = false;
    let code = '';
    
    while (!isUnique) {
      // Generate a random 4-digit number (1000-9999)
      code = Math.floor(1000 + Math.random() * 9000).toString();
      
      // Check if the code already exists in the database
      const { data, error } = await supabase
        .from('games')
        .select('code')
        .eq('code', code);
      
      // If no data is returned or empty array, the code is unique
      isUnique = !error && (!data || data.length === 0);
    }
    
    return code;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate input
    if (!title || title.trim().length < 3) {
      setError('Please enter a game title (minimum 3 characters)');
      return;
    }
    
    setError(null);
    setIsLoading(true);
    
    try {
      const supabase = createClient();
      
      // Generate a unique game code
      const gameCode = await generateUniqueGameCode();
      
      // Set the initial game status
      const initialStatus: GameStatus = 'draft';
      
      // Create a new game in the database
      const { data, error } = await supabase
        .from('games')
        .insert([
          {
            title,
            host_id: user?.id,
            status: initialStatus,
            code: gameCode
          }
        ])
        .select()
        .single();
      
      if (error) throw error;
      
      // Redirect to game editor page
      router.push(`/game/${data.id}/host`);
    } catch (err) {
      console.error('Error creating game:', err);
      setError('Failed to create game. Please try again.');
      setIsLoading(false);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (error) setError(null);
  };

  return (
    <Card className="border-carrot-pale shadow-carrot">
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-2">
          <QuizMasterCarrot size={40} />
        </div>
        <CardTitle className="text-2xl font-heading text-carrot">
          Create a Game
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="gameTitle" className="text-soil font-ui font-medium">
              Game Title
            </Label>
            <Input
              id="gameTitle"
              type="text"
              placeholder="Enter a title for your game"
              value={title}
              onChange={handleTitleChange}
              maxLength={50}
              className="text-center font-body border-carrot-light focus:border-carrot focus:ring-carrot/20"
            />
          </div>
          
          {error && (
            <div className="p-3 rounded-lg bg-feedback-error/10 border border-feedback-error/20 text-feedback-error text-sm font-ui">
              {error}
            </div>
          )}
          
          <Button
            type="submit"
            className="w-full py-3 bg-leaf hover:bg-leaf-dark text-white font-ui font-semibold rounded-lg shadow-leaf transition-all duration-200 hover:shadow-lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating...
              </span>
            ) : (
              'Create Game'
            )}
          </Button>
        </form>
        
        <div className="mt-4 text-center text-sm text-soil-light font-ui">
          <p>You&apos;ll be able to add questions after creating the game</p>
        </div>
      </CardContent>
    </Card>
  );
}