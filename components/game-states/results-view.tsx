'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CarrotIcon } from '@/components/ui/carrot-icon';
import { theme } from '@/lib/theme';

interface ResultsViewProps {
  nickname: string;
  correctAnswers?: number;
  totalQuestions?: number;
}

export function ResultsView({
  nickname,
  correctAnswers = 0,
  totalQuestions = 0,
}: ResultsViewProps) {
  const router = useRouter();

  const handlePlayAgain = () => {
    // Clear session storage and redirect to home
    sessionStorage.removeItem('nickname');
    sessionStorage.removeItem('gameCode');
    router.push('/');
  };

  // Calculate percentage correct
  const percentage = totalQuestions > 0 
    ? Math.round((correctAnswers / totalQuestions) * 100) 
    : 0;

  // Determine message based on performance
  const getMessage = () => {
    if (percentage >= 80) return "Amazing job!";
    if (percentage >= 60) return "Well done!";
    if (percentage >= 40) return "Good effort!";
    return "Thanks for playing!";
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-primary-light rounded-full mb-4">
          <CarrotIcon size={48} />
        </div>
        <h1 className="text-3xl font-bold" style={{ color: theme.colors.primary.DEFAULT }}>
          Game Complete!
        </h1>
        <p className="text-xl mt-2">
          {getMessage()}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-8 mb-8">
        <div className="text-center">
          <div className="text-sm text-text-muted mb-1">You played as</div>
          <div className="text-xl font-bold mb-6">{nickname}</div>
          
          <div className="flex justify-center mb-6">
            <div 
              className="w-32 h-32 rounded-full flex items-center justify-center text-white text-3xl font-bold"
              style={{ backgroundColor: theme.colors.primary.DEFAULT }}
            >
              {percentage}%
            </div>
          </div>
          
          <div className="text-lg">
            You got <span className="font-bold">{correctAnswers}</span> out of <span className="font-bold">{totalQuestions}</span> questions correct
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={handlePlayAgain}
          className="px-8 py-3 text-white"
          style={{ backgroundColor: theme.colors.secondary.DEFAULT }}
        >
          Play Another Game
        </Button>
      </div>

      <div className="mt-8 text-center">
        <p className="text-text-muted text-sm">
          Thanks for playing Karoot!
        </p>
      </div>
    </div>
  );
}