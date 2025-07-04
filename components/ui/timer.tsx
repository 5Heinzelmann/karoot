'use client';

import React, { useState, useEffect } from 'react';
import { theme } from '@/lib/theme';

interface TimerProps {
  duration: number; // Duration in seconds
  onComplete?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Timer({ 
  duration, 
  onComplete, 
  className = '',
  size = 'md'
}: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(true);
  
  // Calculate sizes based on the size prop
  const dimensions = {
    sm: { size: 60, strokeWidth: 4, fontSize: '1rem' },
    md: { size: 80, strokeWidth: 6, fontSize: '1.5rem' },
    lg: { size: 120, strokeWidth: 8, fontSize: '2rem' },
  }[size];
  
  const radius = dimensions.size / 2 - dimensions.strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - timeLeft / duration);
  
  // Color changes as time decreases
  const getColor = () => {
    if (timeLeft > duration * 0.6) return theme.colors.secondary.DEFAULT;
    if (timeLeft > duration * 0.3) return theme.colors.warning;
    return theme.colors.error;
  };

  useEffect(() => {
    if (!isRunning) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsRunning(false);
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isRunning, onComplete]);

  return (
    <div className={`relative ${className}`}>
      <svg
        width={dimensions.size}
        height={dimensions.size}
        viewBox={`0 0 ${dimensions.size} ${dimensions.size}`}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={dimensions.size / 2}
          cy={dimensions.size / 2}
          r={radius}
          fill="none"
          stroke={theme.colors.background.muted}
          strokeWidth={dimensions.strokeWidth}
        />
        
        {/* Timer progress */}
        <circle
          cx={dimensions.size / 2}
          cy={dimensions.size / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth={dimensions.strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s ease' }}
        />
      </svg>
      
      {/* Timer text */}
      <div 
        className="absolute inset-0 flex items-center justify-center font-bold"
        style={{ fontSize: dimensions.fontSize }}
      >
        {timeLeft}
      </div>
    </div>
  );
}