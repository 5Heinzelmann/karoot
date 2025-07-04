'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CarrotIcon } from '@/components/ui/carrot-icon';
import { theme } from '@/lib/theme';

export function JoinGameForm() {
  const router = useRouter();
  const [gameCode, setGameCode] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!gameCode || gameCode.length !== 4 || !/^\d{4}$/.test(gameCode)) {
      setError('Please enter a valid 4-digit game code');
      return;
    }
    
    if (!nickname || nickname.trim().length < 2) {
      setError('Please enter a nickname (minimum 2 characters)');
      return;
    }
    
    setError(null);
    setIsLoading(true);
    
    try {
      // In a real implementation, this would call an API to join the game
      // For now, we'll just simulate a successful join and redirect
      
      // Store participant info in session storage
      sessionStorage.setItem('nickname', nickname);
      sessionStorage.setItem('gameCode', gameCode);
      
      // Redirect to game page
      router.push(`/game/${gameCode}`);
    } catch (err) {
      console.error('Error joining game:', err);
      setError('Failed to join game. Please check the game code and try again.');
      setIsLoading(false);
    }
  };

  const handleGameCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
    setGameCode(value);
    if (error) setError(null);
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
    if (error) setError(null);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
      <div className="flex items-center justify-center mb-6">
        <CarrotIcon size={32} />
        <h2 className="text-2xl font-bold ml-2" style={{ color: theme.colors.primary.DEFAULT }}>
          Join a Game
        </h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="gameCode" className="block text-sm font-medium mb-1">
            Game Code
          </label>
          <Input
            id="gameCode"
            type="text"
            inputMode="numeric"
            placeholder="Enter 4-digit code"
            value={gameCode}
            onChange={handleGameCodeChange}
            className="text-center text-2xl tracking-widest"
            style={{ 
              borderColor: theme.colors.primary.light,
              letterSpacing: '0.5em'
            }}
          />
        </div>
        
        <div>
          <label htmlFor="nickname" className="block text-sm font-medium mb-1">
            Your Nickname
          </label>
          <Input
            id="nickname"
            type="text"
            placeholder="Enter your nickname"
            value={nickname}
            onChange={handleNicknameChange}
            maxLength={15}
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
            backgroundColor: theme.colors.primary.DEFAULT,
            color: 'white'
          }}
        >
          {isLoading ? 'Joining...' : 'Join Game'}
        </Button>
      </form>
    </div>
  );
}