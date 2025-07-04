'use client';

import React from 'react';
import { AnswerDistribution as AnswerDistributionType } from '@/lib/types';
import { theme } from '@/lib/theme';

interface AnswerDistributionProps {
  distribution: AnswerDistributionType[];
  totalParticipants: number;
  className?: string;
}

export function AnswerDistribution({
  distribution,
  totalParticipants,
  className = '',
}: AnswerDistributionProps) {
  const getBarColor = (isCorrect: boolean, isHighest: boolean) => {
    if (isCorrect) return theme.colors.success;
    if (isHighest) return theme.colors.primary.dark;
    return theme.colors.primary.DEFAULT;
  };

  const getBarWidth = (count: number) => {
    if (totalParticipants === 0) return '0%';
    return `${Math.max(5, (count / totalParticipants) * 100)}%`;
  };
  
  // Find the option with the highest count (most popular answer)
  const highestCount = Math.max(...distribution.map(item => item.count), 0);

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Answer Distribution</h3>
        <div className="text-sm text-text-muted">
          {distribution.reduce((sum, item) => sum + item.count, 0)} / {totalParticipants} answered
        </div>
      </div>

      <div className="space-y-4">
        {distribution.map((item) => (
          <div key={item.option_id} className="space-y-1">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className={`mr-2 text-sm font-medium ${item.count === highestCount && item.count > 0 ? 'font-bold' : ''}`}>
                  {item.option_text}
                </span>
                {item.is_correct && (
                  <span className="inline-flex items-center justify-center w-5 h-5 bg-success rounded-full">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10 3L4.5 8.5L2 6"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                )}
              </div>
              <div className={`text-sm font-medium ${item.count === highestCount && item.count > 0 ? 'font-bold' : ''}`}>
                {item.count} ({item.percentage}%)
              </div>
            </div>
            
            <div className="w-full bg-background-muted rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out ${item.count === highestCount && item.count > 0 ? 'animate-pulse' : ''}`}
                style={{
                  width: getBarWidth(item.count),
                  backgroundColor: getBarColor(item.is_correct, item.count === highestCount && item.count > 0),
                  opacity: item.count > 0 ? '1' : '0.5',
                  transition: 'width 1s ease-out, opacity 0.5s ease-in-out',
                }}
              />
            </div>
            
            {/* Add a subtle animation for the most popular answer */}
            {item.count === highestCount && item.count > 0 && !item.is_correct && (
              <div className="text-xs text-primary-dark mt-1">
                Most popular answer
              </div>
            )}
            
            {/* Add a message for the correct answer when it's not the most popular */}
            {item.is_correct && item.count !== highestCount && (
              <div className="text-xs text-success mt-1">
                Correct answer
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}