import React from 'react';
import { theme } from '@/lib/theme';
import { cn } from '@/lib/utils';

interface CarrotDecorationsProps {
  variant?: 'leaves' | 'border' | 'corner' | 'divider';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animated?: boolean;
}

export function CarrotDecorations({
  variant = 'leaves',
  size = 'md',
  className,
  animated = false,
}: CarrotDecorationsProps) {
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { width: 40, height: 40, strokeWidth: 1.5 };
      case 'lg':
        return { width: 80, height: 80, strokeWidth: 3 };
      default: // md
        return { width: 60, height: 60, strokeWidth: 2 };
    }
  };

  const sizeStyles = getSizeStyles();

  if (variant === 'leaves') {
    return (
      <svg
        width={sizeStyles.width}
        height={sizeStyles.height}
        viewBox="0 0 60 60"
        className={cn(animated && 'animate-pulse', className)}
        role="img"
        aria-label="Carrot leaf decoration"
      >
        <g transform="translate(30, 30)">
          <path
            d="M0 0 C0 0 -5 -15 -15 -10 C-20 -8 -15 -5 -10 -8 C-5 -10 0 0 0 0"
            fill={theme.colors.leaf.green}
            stroke={theme.colors.leaf.dark}
            strokeWidth={sizeStyles.strokeWidth}
          />
          <path
            d="M0 0 C0 0 5 -15 15 -10 C20 -8 15 -5 10 -8 C5 -10 0 0 0 0"
            fill={theme.colors.leaf.bright}
            stroke={theme.colors.leaf.dark}
            strokeWidth={sizeStyles.strokeWidth}
          />
          <path
            d="M0 0 C0 0 -2 -20 -8 -18 C-12 -17 -8 -12 -5 -15 C-2 -17 0 0 0 0"
            fill={theme.colors.leaf.light}
            stroke={theme.colors.leaf.dark}
            strokeWidth={sizeStyles.strokeWidth}
          />
        </g>
      </svg>
    );
  }

  if (variant === 'border') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        {Array.from({ length: 5 }, (_, i) => (
          <svg
            key={i}
            width={sizeStyles.width / 3}
            height={sizeStyles.height / 3}
            viewBox="0 0 20 20"
            className={cn(animated && 'animate-bounce', 'opacity-70')}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <circle
              cx="10"
              cy="10"
              r="8"
              fill={theme.colors.carrot.pale}
              stroke={theme.colors.carrot.orange}
              strokeWidth="1"
            />
            <path
              d="M10 15 C10 15 6 12 6 8 C6 6 7 5 8 5 L12 5 C13 5 14 6 14 8 C14 12 10 15 10 15 Z"
              fill={theme.colors.carrot.orange}
            />
            <path
              d="M10 5 C10 5 10 3 11 4"
              stroke={theme.colors.leaf.green}
              strokeWidth="1"
              strokeLinecap="round"
            />
          </svg>
        ))}
      </div>
    );
  }

  if (variant === 'corner') {
    return (
      <svg
        width={sizeStyles.width}
        height={sizeStyles.height}
        viewBox="0 0 60 60"
        className={cn(animated && 'animate-pulse', className)}
        role="img"
        aria-label="Carrot corner decoration"
      >
        <g>
          {/* Corner carrot */}
          <path
            d="M50 50 C50 50 40 45 40 35 C40 30 42 25 45 25 L55 25 C58 25 60 30 60 35 C60 45 50 50 50 50 Z"
            fill={theme.colors.carrot.orange}
            stroke={theme.colors.carrot.dark}
            strokeWidth={sizeStyles.strokeWidth}
          />
          <path
            d="M50 25 C50 25 50 20 52 22 M55 20 C55 20 53 22 52 22"
            stroke={theme.colors.leaf.green}
            strokeWidth={sizeStyles.strokeWidth}
            strokeLinecap="round"
          />
          
          {/* Decorative leaves */}
          <path
            d="M35 15 C35 15 30 10 25 15 C20 20 25 25 30 20 C35 15 35 15 35 15"
            fill={theme.colors.leaf.light}
            stroke={theme.colors.leaf.dark}
            strokeWidth="1"
            opacity="0.7"
          />
          <path
            d="M15 35 C15 35 10 30 5 35 C0 40 5 45 10 40 C15 35 15 35 15 35"
            fill={theme.colors.leaf.green}
            stroke={theme.colors.leaf.dark}
            strokeWidth="1"
            opacity="0.7"
          />
        </g>
      </svg>
    );
  }

  if (variant === 'divider') {
    return (
      <div className={cn('flex items-center justify-center w-full', className)}>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-orange-200" />
        <svg
          width={sizeStyles.width}
          height={sizeStyles.height / 2}
          viewBox="0 0 60 30"
          className={cn(animated && 'animate-bounce', 'mx-4')}
        >
          <path
            d="M30 25 C30 25 20 20 20 10 C20 5 22 2 25 2 L35 2 C38 2 40 5 40 10 C40 20 30 25 30 25 Z"
            fill={theme.colors.carrot.orange}
            stroke={theme.colors.carrot.dark}
            strokeWidth={sizeStyles.strokeWidth}
          />
          <path
            d="M30 2 C30 2 30 0 32 1 M35 0 C35 0 33 1 32 1"
            stroke={theme.colors.leaf.green}
            strokeWidth={sizeStyles.strokeWidth}
            strokeLinecap="round"
          />
        </svg>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-orange-200" />
      </div>
    );
  }

  return null;
}

export function CarrotPattern({
  density = 'medium',
  className,
}: {
  density?: 'low' | 'medium' | 'high';
  className?: string;
}) {
  const getPatternCount = () => {
    switch (density) {
      case 'low':
        return 3;
      case 'high':
        return 8;
      default: // medium
        return 5;
    }
  };

  const patternCount = getPatternCount();

  return (
    <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
      {Array.from({ length: patternCount }, (_, i) => (
        <div
          key={i}
          className="absolute opacity-10"
          style={{
            left: `${Math.random() * 80 + 10}%`,
            top: `${Math.random() * 80 + 10}%`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path
              d="M12 21 C12 21 3 16 3 9 C3 6.5 4.5 4.9 6.5 4 C8.5 3.1 12 3 12 3 C12 3 15.5 3.1 17.5 4 C19.5 4.9 21 6.5 21 9 C21 16 12 21 12 21 Z"
              fill={theme.colors.carrot.pale}
            />
            <path
              d="M12 3 C12 3 12 1 14 2"
              stroke={theme.colors.leaf.pale}
              strokeWidth="1"
              strokeLinecap="round"
            />
          </svg>
        </div>
      ))}
    </div>
  );
}

export function CarrotBadge({
  children,
  variant = 'orange',
  size = 'md',
  className,
}: {
  children: React.ReactNode;
  variant?: 'orange' | 'green' | 'brown';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'green':
        return {
          bg: theme.colors.leaf.green,
          border: theme.colors.leaf.dark,
          text: 'text-white',
        };
      case 'brown':
        return {
          bg: theme.colors.soil.brown,
          border: theme.colors.soil.dark,
          text: 'text-white',
        };
      default: // orange
        return {
          bg: theme.colors.carrot.orange,
          border: theme.colors.carrot.dark,
          text: 'text-white',
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { padding: 'px-2 py-1', fontSize: 'text-xs', height: 20 };
      case 'lg':
        return { padding: 'px-4 py-2', fontSize: 'text-base', height: 32 };
      default: // md
        return { padding: 'px-3 py-1.5', fontSize: 'text-sm', height: 24 };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-full',
        variantStyles.text,
        sizeStyles.fontSize,
        sizeStyles.padding,
        className
      )}
      style={{
        backgroundColor: variantStyles.bg,
        border: `1px solid ${variantStyles.border}`,
        height: sizeStyles.height,
      }}
    >
      {children}
    </span>
  );
}