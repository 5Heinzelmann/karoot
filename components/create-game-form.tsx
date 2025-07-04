'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CarrotIcon } from '@/components/ui/carrot-icon';
import { theme } from '@/lib/theme';

export function CreateGameForm() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
      // In a real implementation, this would call an API to create the game
      // For now, we'll just simulate a successful creation and redirect
      
      // Generate a random game ID (in a real app, this would come from the backend)
      const gameId = Math.random().toString(36).substring(2, 10);
      
      // Redirect to game editor page
      router.push(`/game/${gameId}/host`);
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