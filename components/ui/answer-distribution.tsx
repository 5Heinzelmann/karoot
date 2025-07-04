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
  const getBarColor = (isCorrect: boolean) => {
    return isCorrect ? theme.colors.success : theme.colors.primary.DEFAULT;
  };

  const getBarWidth = (count: number) => {
    if (totalParticipants === 0) return '0%';
    return `${Math.max(5, (count / totalParticipants) * 100)}%`;
  };

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
                <span className="mr-2 text-sm font-medium">
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
              <div className="text-sm font-medium">
                {item.count} ({item.percentage}%)
              </div>
            </div>
            
            <div className="w-full bg-background-muted rounded-full h-2.5 overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{ 
                  width: getBarWidth(item.count),
                  backgroundColor: getBarColor(item.is_correct),
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}