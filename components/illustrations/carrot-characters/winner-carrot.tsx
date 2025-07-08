import React from 'react';
import { BaseCarrot, BaseCarrotProps } from './base-carrot';
import { theme } from '@/lib/theme';

interface WinnerCarrotProps extends Omit<BaseCarrotProps, 'expression'> {
  withTrophy?: boolean;
  withCrown?: boolean;
}

export function WinnerCarrot({
  size = 64,
  pose = 'jumping',
  className = '',
  color = theme.colors.carrot.bright,
  leafColor = theme.colors.leaf.bright,
  withTrophy = true,
  withCrown = false,
}: WinnerCarrotProps) {
  return (
    <div className="relative inline-block">
      <BaseCarrot
        size={size}
        expression="excited"
        pose={pose}
        className={className}
        color={color}
        leafColor={leafColor}
      />
      
      {withTrophy && (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
        >
          {/* Trophy */}
          <g>
            <rect
              x="4"
              y="12"
              width="4"
              height="5"
              rx="0.5"
              fill={theme.colors.feedback.warning}
              stroke="#B8860B"
              strokeWidth="1"
            />
            <ellipse
              cx="6"
              cy="12"
              rx="2"
              ry="1"
              fill={theme.colors.feedback.warning}
            />
            <rect
              x="5.5"
              y="17"
              width="1"
              height="1"
              fill="#B8860B"
            />
            <rect
              x="5"
              y="18"
              width="2"
              height="0.5"
              fill="#B8860B"
            />
            {/* Trophy handles */}
            <path
              d="M4 13 Q2 13 2 15 Q2 17 4 17"
              stroke="#B8860B"
              strokeWidth="1"
              fill="none"
            />
            <path
              d="M8 13 Q10 13 10 15 Q10 17 8 17"
              stroke="#B8860B"
              strokeWidth="1"
              fill="none"
            />
          </g>
        </svg>
      )}
      
      {withCrown && (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
        >
          {/* Crown */}
          <g>
            <path
              d="M8 4 L10 2 L12 4 L14 2 L16 4 L16 6 L8 6 Z"
              fill={theme.colors.feedback.warning}
              stroke="#B8860B"
              strokeWidth="1"
            />
            <circle cx="10" cy="3" r="0.5" fill="#FF5252" />
            <circle cx="12" cy="2" r="0.5" fill="#FF5252" />
            <circle cx="14" cy="3" r="0.5" fill="#FF5252" />
          </g>
        </svg>
      )}
      
      {/* Celebration sparkles */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <g opacity="0.7">
          <path d="M20 8 L21 9 L20 10 L19 9 Z" fill={theme.colors.feedback.warning} />
          <path d="M22 12 L23 13 L22 14 L21 13 Z" fill={theme.colors.feedback.warning} />
          <path d="M2 6 L3 7 L2 8 L1 7 Z" fill={theme.colors.feedback.warning} />
          <path d="M4 10 L5 11 L4 12 L3 11 Z" fill={theme.colors.feedback.warning} />
        </g>
      </svg>
    </div>
  );
}