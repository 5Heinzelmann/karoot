'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CarrotIcon } from '@/components/ui/carrot-icon';
import { theme } from '@/lib/theme';
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
        .eq('code', code)
        .single();
      
      // If no data is returned, the code is unique
      isUnique = !data && !error;
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
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
      <div className="flex items-center justify-center mb-6">
        <CarrotIcon size={32} />
        <h2 className="text-2xl font-bold ml-2" style={{ color: theme.colors.primary.DEFAULT }}>
          Create a Game
        </h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="gameTitle" className="block text-sm font-medium mb-1">
            Game Title
          </label>
          <Input
            id="gameTitle"
            type="text"
            placeholder="Enter a title for your game"
            value={title}
            onChange={handleTitleChange}
            maxLength={50}
            className="text-center"
            style={{ borderColor: theme.colors.primary.light }}
          />
        </div>
        
        {error && (
          <div className="p-3 rounded-md bg-red-50 text-red-500 text-sm">
            {error}
          </div>
        )}
        
        <Button
          type="submit"
          className="w-full py-2"
          disabled={isLoading}
          style={{ 
            backgroundColor: theme.colors.secondary.DEFAULT,
            color: 'white'
          }}
        >
          {isLoading ? 'Creating...' : 'Create Game'}
        </Button>
      </form>
      
      <div className="mt-4 text-center text-sm text-text-muted">
        <p>You'll be able to add questions after creating the game</p>
      </div>
    </div>
  );
}