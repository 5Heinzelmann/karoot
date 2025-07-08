import React from 'react';
import { theme } from '@/lib/theme';
import { cn } from '@/lib/utils';

interface CarrotProgressProps {
  value: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showPercentage?: boolean;
  animated?: boolean;
}

export function CarrotProgress({
  value,
  size = 'md',
  className,
  showPercentage = true,
  animated = true,
}: CarrotProgressProps) {
  const clampedValue = Math.max(0, Math.min(100, value));
  
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { width: 200, height: 20, strokeWidth: 3 };
      case 'lg':
        return { width: 400, height: 40, strokeWidth: 6 };
      default: // md
        return { width: 300, height: 30, strokeWidth: 4 };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="relative">
        <svg
          width={sizeStyles.width}
          height={sizeStyles.height}
          viewBox={`0 0 ${sizeStyles.width} ${sizeStyles.height}`}
          role="progressbar"
          aria-valuenow={clampedValue}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Progress: ${clampedValue}%`}
        >
          <defs>
            <linearGradient id="carrot-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={theme.colors.carrot.orange} />
              <stop offset="50%" stopColor={theme.colors.carrot.bright} />
              <stop offset="100%" stopColor={theme.colors.carrot.light} />
            </linearGradient>
            <linearGradient id="leaf-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={theme.colors.leaf.green} />
              <stop offset="100%" stopColor={theme.colors.leaf.bright} />
            </linearGradient>
          </defs>
          
          {/* Background track */}
          <rect
            x={sizeStyles.strokeWidth / 2}
            y={sizeStyles.height / 2 - sizeStyles.strokeWidth / 2}
            width={sizeStyles.width - sizeStyles.strokeWidth}
            height={sizeStyles.strokeWidth}
            rx={sizeStyles.strokeWidth / 2}
            fill={theme.colors.background.dark}
            stroke="none"
          />
          
          {/* Progress fill */}
          <rect
            x={sizeStyles.strokeWidth / 2}
            y={sizeStyles.height / 2 - sizeStyles.strokeWidth / 2}
            width={Math.max(0, (sizeStyles.width - sizeStyles.strokeWidth) * (clampedValue / 100))}
            height={sizeStyles.strokeWidth}
            rx={sizeStyles.strokeWidth / 2}
            fill="url(#carrot-gradient)"
            stroke="none"
            className={animated ? 'transition-all duration-500 ease-out' : ''}
          />
          
          {/* Carrot icon at progress end */}
          {clampedValue > 5 && (
            <g
              transform={`translate(${Math.max(12, (sizeStyles.width - sizeStyles.strokeWidth) * (clampedValue / 100) - 8)}, ${sizeStyles.height / 2})`}
              className={animated ? 'transition-transform duration-500 ease-out' : ''}
            >
              <circle
                cx="0"
                cy="0"
                r={sizeStyles.strokeWidth + 2}
                fill={theme.colors.carrot.orange}
                stroke={theme.colors.carrot.dark}
                strokeWidth="1"
              />
              <path
                d="M-3 -1 L3 -1 L2 2 L-2 2 Z"
                fill={theme.colors.carrot.bright}
              />
              <path
                d="M0 -4 C0 -4 -1 -6 1 -5 M2 -6 C2 -6 1 -4 0 -4"
                stroke={theme.colors.leaf.green}
                strokeWidth="1"
                fill="none"
                strokeLinecap="round"
              />
            </g>
          )}
          
          {/* Leaf decorations at start */}
          <g transform={`translate(${sizeStyles.strokeWidth + 5}, ${sizeStyles.height / 2})`}>
            <path
              d="M-2 -3 C-2 -3 -4 -5 -1 -4 M1 -5 C1 -5 0 -3 -1 -3"
              stroke={theme.colors.leaf.green}
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />
          </g>
        </svg>
        
        {/* Percentage text */}
        {showPercentage && (
          <div
            className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-gray-700"
            aria-hidden="true"
          >
            {Math.round(clampedValue)}%
          </div>
        )}
      </div>
      
      {/* Progress segments for visual feedback */}
      <div className="flex gap-1">
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            className={cn(
              'h-1 flex-1 rounded-full transition-colors duration-300',
              clampedValue > i * 10
                ? 'bg-gradient-to-r from-orange-400 to-orange-500'
                : 'bg-gray-200'
            )}
          />
        ))}
      </div>
    </div>
  );
}

export function CarrotProgressCircular({
  value,
  size = 'md',
  className,
  showPercentage = true,
}: Omit<CarrotProgressProps, 'animated'>) {
  const clampedValue = Math.max(0, Math.min(100, value));
  
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { size: 60, strokeWidth: 4, radius: 26 };
      case 'lg':
        return { size: 120, strokeWidth: 8, radius: 52 };
      default: // md
        return { size: 80, strokeWidth: 6, radius: 34 };
    }
  };

  const sizeStyles = getSizeStyles();
  const circumference = 2 * Math.PI * sizeStyles.radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (clampedValue / 100) * circumference;

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        width={sizeStyles.size}
        height={sizeStyles.size}
        className="transform -rotate-90"
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Circular progress: ${clampedValue}%`}
      >
        <defs>
          <linearGradient id="circular-carrot-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={theme.colors.carrot.orange} />
            <stop offset="100%" stopColor={theme.colors.carrot.bright} />
          </linearGradient>
        </defs>
        
        {/* Background circle */}
        <circle
          cx={sizeStyles.size / 2}
          cy={sizeStyles.size / 2}
          r={sizeStyles.radius}
          stroke={theme.colors.background.dark}
          strokeWidth={sizeStyles.strokeWidth}
          fill="none"
        />
        
        {/* Progress circle */}
        <circle
          cx={sizeStyles.size / 2}
          cy={sizeStyles.size / 2}
          r={sizeStyles.radius}
          stroke="url(#circular-carrot-gradient)"
          strokeWidth={sizeStyles.strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-500 ease-out"
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {showPercentage ? (
          <span className="text-sm font-semibold text-gray-700">
            {Math.round(clampedValue)}%
          </span>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path
              d="M12 21C12 21 3 16 3 9C3 6.5 4.5 4.9 6.5 4C8.5 3.1 12 3 12 3C12 3 15.5 3.1 17.5 4C19.5 4.9 21 6.5 21 9C21 16 12 21 12 21Z"
              fill={theme.colors.carrot.orange}
              stroke={theme.colors.carrot.dark}
              strokeWidth="1"
            />
            <path
              d="M12 3C12 3 12 1 14 2"
              stroke={theme.colors.leaf.green}
              strokeWidth="1"
              strokeLinecap="round"
            />
          </svg>
        )}
      </div>
    </div>
  );
}