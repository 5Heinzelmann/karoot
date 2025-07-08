import React from 'react';
import { theme } from '@/lib/theme';
import { cn } from '@/lib/utils';

interface CarrotLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export function CarrotLoader({
  size = 'md',
  className,
  text = 'Loading...',
}: CarrotLoaderProps) {
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { width: 32, height: 32, textSize: 'text-sm' };
      case 'lg':
        return { width: 80, height: 80, textSize: 'text-lg' };
      default: // md
        return { width: 48, height: 48, textSize: 'text-base' };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      <div className="relative">
        <svg
          width={sizeStyles.width}
          height={sizeStyles.height}
          viewBox="0 0 24 24"
          className="animate-bounce"
          role="img"
          aria-label="Loading carrot animation"
        >
          {/* Animated carrot body */}
          <path
            d="M12 21C12 21 3 16 3 9C3 6.5 4.5 4.9 6.5 4C8.5 3.1 12 3 12 3C12 3 15.5 3.1 17.5 4C19.5 4.9 21 6.5 21 9C21 16 12 21 12 21Z"
            fill={theme.colors.carrot.orange}
            stroke={theme.colors.carrot.dark}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-pulse"
          />
          
          {/* Animated carrot leaves */}
          <g className="animate-pulse" style={{ animationDelay: '0.2s' }}>
            <path
              d="M12 3C12 3 12 1 14 2M16 2C16 2 14.5 3 14 3.5M10 2C10 2 11.5 3 12 3.5"
              stroke={theme.colors.leaf.green}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
          
          {/* Happy face */}
          <circle cx="10" cy="12" r="1" fill="#333" />
          <circle cx="14" cy="12" r="1" fill="#333" />
          <path
            d="M9 15 Q12 17 15 15"
            stroke="#333"
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
          />
          
          {/* Carrot details */}
          <path
            d="M8 8 Q12 9 16 8"
            stroke={theme.colors.carrot.dark}
            strokeWidth="0.5"
            fill="none"
            opacity="0.3"
          />
          <path
            d="M7 12 Q12 13 17 12"
            stroke={theme.colors.carrot.dark}
            strokeWidth="0.5"
            fill="none"
            opacity="0.3"
          />
        </svg>
        
        {/* Spinning dots around carrot */}
        <div className="absolute inset-0 animate-spin">
          <div
            className="absolute w-2 h-2 rounded-full"
            style={{
              backgroundColor: theme.colors.carrot.light,
              top: '10%',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          />
          <div
            className="absolute w-2 h-2 rounded-full"
            style={{
              backgroundColor: theme.colors.leaf.light,
              top: '50%',
              right: '10%',
              transform: 'translateY(-50%)',
            }}
          />
          <div
            className="absolute w-2 h-2 rounded-full"
            style={{
              backgroundColor: theme.colors.carrot.light,
              bottom: '10%',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          />
          <div
            className="absolute w-2 h-2 rounded-full"
            style={{
              backgroundColor: theme.colors.leaf.light,
              top: '50%',
              left: '10%',
              transform: 'translateY(-50%)',
            }}
          />
        </div>
      </div>
      
      {text && (
        <p className={cn('font-medium text-gray-600', sizeStyles.textSize)}>
          {text}
        </p>
      )}
    </div>
  );
}

export function CarrotSpinner({ size = 'md', className }: Omit<CarrotLoaderProps, 'text'>) {
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { width: 20, height: 20 };
      case 'lg':
        return { width: 40, height: 40 };
      default: // md
        return { width: 24, height: 24 };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <div className={cn('inline-block', className)}>
      <svg
        width={sizeStyles.width}
        height={sizeStyles.height}
        viewBox="0 0 24 24"
        className="animate-spin"
        role="img"
        aria-label="Loading spinner"
      >
        <path
          d="M12 21C12 21 3 16 3 9C3 6.5 4.5 4.9 6.5 4C8.5 3.1 12 3 12 3"
          fill="none"
          stroke={theme.colors.carrot.orange}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 3C12 3 12 1 14 2"
          stroke={theme.colors.leaf.green}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}