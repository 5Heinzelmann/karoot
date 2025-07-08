import React from 'react';
import { BaseCarrot, BaseCarrotProps } from './base-carrot';
import { theme } from '@/lib/theme';

interface QuizMasterCarrotProps extends Omit<BaseCarrotProps, 'expression'> {
  withGlasses?: boolean;
  withHat?: boolean;
}

export function QuizMasterCarrot({
  size = 64,
  pose = 'standing',
  className = '',
  color = theme.colors.carrot.orange,
  leafColor = theme.colors.leaf.green,
  withGlasses = true,
  withHat = false,
}: QuizMasterCarrotProps) {
  return (
    <div className="relative inline-block">
      <BaseCarrot
        size={size}
        expression="thinking"
        pose={pose}
        className={className}
        color={color}
        leafColor={leafColor}
      />
      
      {withGlasses && (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
        >
          {/* Glasses */}
          <g>
            <circle cx="10" cy="12" r="2.5" fill="none" stroke="#333" strokeWidth="1" />
            <circle cx="14" cy="12" r="2.5" fill="none" stroke="#333" strokeWidth="1" />
            <path d="M12.5 12 L11.5 12" stroke="#333" strokeWidth="1" />
            <path d="M7.5 11 L6 10" stroke="#333" strokeWidth="1" />
            <path d="M16.5 11 L18 10" stroke="#333" strokeWidth="1" />
          </g>
        </svg>
      )}
      
      {withHat && (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
        >
          {/* Professor hat */}
          <g>
            <path
              d="M8 6 L16 6 L15 2 L9 2 Z"
              fill={theme.colors.soil.brown}
              stroke={theme.colors.soil.dark}
              strokeWidth="1"
            />
            <ellipse cx="12" cy="6" rx="4" ry="1" fill={theme.colors.soil.brown} />
          </g>
        </svg>
      )}
    </div>
  );
}