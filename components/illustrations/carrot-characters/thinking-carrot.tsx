import React from 'react';
import { BaseCarrot, BaseCarrotProps } from './base-carrot';
import { theme } from '@/lib/theme';

interface ThinkingCarrotProps extends Omit<BaseCarrotProps, 'expression'> {
  thoughtText?: string;
  withLightbulb?: boolean;
}

export function ThinkingCarrot({
  size = 64,
  pose = 'standing',
  className = '',
  color = theme.colors.carrot.orange,
  leafColor = theme.colors.leaf.green,
  thoughtText = '?',
  withLightbulb = false,
}: ThinkingCarrotProps) {
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
      
      {/* Enhanced thought bubble */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <g>
          {/* Main thought bubble */}
          <ellipse
            cx="18"
            cy="6"
            rx="4"
            ry="3"
            fill="#fff"
            stroke="#ccc"
            strokeWidth="1"
            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
          />
          {/* Smaller bubbles leading to carrot */}
          <circle cx="15" cy="9" r="1.5" fill="#fff" stroke="#ccc" strokeWidth="0.5" />
          <circle cx="14" cy="10" r="1" fill="#fff" stroke="#ccc" strokeWidth="0.5" />
          <circle cx="13" cy="11" r="0.5" fill="#fff" stroke="#ccc" strokeWidth="0.5" />
          
          {withLightbulb ? (
            /* Lightbulb idea */
            <g>
              <ellipse cx="18" cy="5.5" rx="1.5" ry="2" fill="#FFD740" stroke="#FFA000" strokeWidth="0.5" />
              <rect x="17.2" y="7" width="1.6" height="0.8" fill="#666" />
              <path d="M17 7.8 L19 7.8" stroke="#666" strokeWidth="0.3" />
              <path d="M17 8.2 L19 8.2" stroke="#666" strokeWidth="0.3" />
              {/* Light rays */}
              <path d="M18 3 L18 2.5" stroke="#FFD740" strokeWidth="0.5" />
              <path d="M20.5 4 L21 3.5" stroke="#FFD740" strokeWidth="0.5" />
              <path d="M20.5 7 L21 7.5" stroke="#FFD740" strokeWidth="0.5" />
              <path d="M15.5 4 L15 3.5" stroke="#FFD740" strokeWidth="0.5" />
              <path d="M15.5 7 L15 7.5" stroke="#FFD740" strokeWidth="0.5" />
            </g>
          ) : (
            /* Question mark or custom text */
            <text
              x="18"
              y="7"
              textAnchor="middle"
              fontSize="3"
              fill="#666"
              fontFamily="Arial, sans-serif"
              fontWeight="bold"
            >
              {thoughtText}
            </text>
          )}
        </g>
      </svg>
      
      {/* Thinking pose indicator - hand to chin */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <g>
          <circle
            cx="8"
            cy="14"
            r="1"
            fill={theme.colors.carrot.light}
            stroke={theme.colors.carrot.dark}
            strokeWidth="0.5"
          />
        </g>
      </svg>
    </div>
  );
}