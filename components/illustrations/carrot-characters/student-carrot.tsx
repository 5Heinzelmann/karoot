import React from 'react';
import { BaseCarrot, BaseCarrotProps } from './base-carrot';
import { theme } from '@/lib/theme';

interface StudentCarrotProps extends Omit<BaseCarrotProps, 'expression'> {
  withBackpack?: boolean;
  withBook?: boolean;
}

export function StudentCarrot({
  size = 64,
  pose = 'standing',
  className = '',
  color = theme.colors.carrot.orange,
  leafColor = theme.colors.leaf.green,
  withBackpack = true,
  withBook = false,
}: StudentCarrotProps) {
  return (
    <div className="relative inline-block">
      <BaseCarrot
        size={size}
        expression="happy"
        pose={pose}
        className={className}
        color={color}
        leafColor={leafColor}
      />
      
      {withBackpack && (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
        >
          {/* Backpack */}
          <g>
            <rect
              x="16"
              y="8"
              width="4"
              height="8"
              rx="1"
              fill={theme.colors.feedback.info}
              stroke={theme.colors.feedback.info}
              strokeWidth="1"
            />
            <rect
              x="17"
              y="9"
              width="2"
              height="2"
              fill={theme.colors.background.card}
              stroke={theme.colors.feedback.info}
              strokeWidth="0.5"
            />
            {/* Straps */}
            <path
              d="M16.5 8 Q14 10 14 12"
              stroke={theme.colors.soil.brown}
              strokeWidth="1.5"
              fill="none"
            />
            <path
              d="M19.5 8 Q17 10 17 12"
              stroke={theme.colors.soil.brown}
              strokeWidth="1.5"
              fill="none"
            />
          </g>
        </svg>
      )}
      
      {withBook && (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
        >
          {/* Book */}
          <g>
            <rect
              x="5"
              y="14"
              width="3"
              height="4"
              rx="0.5"
              fill={theme.colors.feedback.warning}
              stroke={theme.colors.soil.brown}
              strokeWidth="0.5"
            />
            <path
              d="M6.5 14 L6.5 18"
              stroke={theme.colors.soil.brown}
              strokeWidth="0.5"
            />
          </g>
        </svg>
      )}
    </div>
  );
}