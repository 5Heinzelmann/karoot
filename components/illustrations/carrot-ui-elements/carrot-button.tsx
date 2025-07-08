import React from 'react';
import { theme } from '@/lib/theme';
import { cn } from '@/lib/utils';

interface CarrotButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function CarrotButton({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: CarrotButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          fill: theme.colors.leaf.green,
          stroke: theme.colors.leaf.dark,
          textColor: 'text-white',
        };
      case 'outline':
        return {
          fill: 'transparent',
          stroke: theme.colors.carrot.orange,
          textColor: 'text-orange-600',
        };
      default: // primary
        return {
          fill: theme.colors.carrot.orange,
          stroke: theme.colors.carrot.dark,
          textColor: 'text-white',
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          width: 120,
          height: 40,
          fontSize: 'text-sm',
          padding: 'px-4 py-2',
        };
      case 'lg':
        return {
          width: 200,
          height: 60,
          fontSize: 'text-lg',
          padding: 'px-8 py-4',
        };
      default: // md
        return {
          width: 160,
          height: 50,
          fontSize: 'text-base',
          padding: 'px-6 py-3',
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <button
      className={cn(
        'relative inline-flex items-center justify-center font-medium transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
        variantStyles.textColor,
        sizeStyles.fontSize,
        className
      )}
      style={{ width: sizeStyles.width, height: sizeStyles.height }}
      {...props}
    >
      {/* Carrot-shaped background */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 160 50"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <filter id="carrot-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2" />
          </filter>
        </defs>
        
        {/* Main carrot shape */}
        <path
          d="M20 25 C20 25 5 20 5 15 C5 10 10 5 20 5 L140 5 C150 5 155 10 155 15 C155 20 140 25 140 25 L140 35 C140 40 135 45 125 45 L35 45 C25 45 20 40 20 35 Z"
          fill={variantStyles.fill}
          stroke={variantStyles.stroke}
          strokeWidth="2"
          filter="url(#carrot-shadow)"
        />
        
        {/* Carrot top leaves */}
        <g opacity="0.8">
          <path
            d="M15 5 C15 5 12 2 18 3 M25 3 C25 3 22 5 20 5 M30 3 C30 3 28 5 25 5"
            stroke={theme.colors.leaf.green}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </g>
        
        {/* Subtle carrot lines */}
        <g opacity="0.3">
          <path
            d="M30 15 Q80 18 130 15"
            stroke={variantStyles.stroke}
            strokeWidth="1"
            fill="none"
          />
          <path
            d="M25 25 Q80 28 135 25"
            stroke={variantStyles.stroke}
            strokeWidth="1"
            fill="none"
          />
          <path
            d="M30 35 Q80 38 130 35"
            stroke={variantStyles.stroke}
            strokeWidth="1"
            fill="none"
          />
        </g>
      </svg>
      
      {/* Button content */}
      <span className="relative z-10 font-semibold">
        {children}
      </span>
    </button>
  );
}