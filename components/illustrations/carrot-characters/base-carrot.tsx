import React from 'react';
import { theme } from '@/lib/theme';

export interface BaseCarrotProps {
  size?: number;
  expression?: 'happy' | 'neutral' | 'sad' | 'excited' | 'thinking';
  pose?: 'standing' | 'jumping' | 'dancing' | 'sleeping';
  className?: string;
  color?: string;
  leafColor?: string;
}

export function BaseCarrot({
  size = 64,
  expression = 'neutral',
  pose = 'standing',
  className = '',
  color = theme.colors.carrot.orange,
  leafColor = theme.colors.leaf.green,
}: BaseCarrotProps) {
  const getEyeExpression = () => {
    switch (expression) {
      case 'happy':
        return (
          <>
            <circle cx="10" cy="12" r="1.5" fill="#333" />
            <circle cx="14" cy="12" r="1.5" fill="#333" />
            <path d="M8 15 Q12 17 16 15" stroke="#333" strokeWidth="1" fill="none" strokeLinecap="round" />
          </>
        );
      case 'sad':
        return (
          <>
            <circle cx="10" cy="12" r="1.5" fill="#333" />
            <circle cx="14" cy="12" r="1.5" fill="#333" />
            <path d="M8 17 Q12 15 16 17" stroke="#333" strokeWidth="1" fill="none" strokeLinecap="round" />
          </>
        );
      case 'excited':
        return (
          <>
            <circle cx="10" cy="12" r="2" fill="#333" />
            <circle cx="14" cy="12" r="2" fill="#333" />
            <circle cx="10" cy="11" r="0.5" fill="#fff" />
            <circle cx="14" cy="11" r="0.5" fill="#fff" />
            <ellipse cx="12" cy="16" rx="2" ry="1" fill="#FF5252" />
          </>
        );
      case 'thinking':
        return (
          <>
            <circle cx="10" cy="12" r="1.5" fill="#333" />
            <circle cx="14" cy="12" r="1.5" fill="#333" />
            <path d="M9 15 L15 15" stroke="#333" strokeWidth="1" strokeLinecap="round" />
          </>
        );
      default: // neutral
        return (
          <>
            <circle cx="10" cy="12" r="1.5" fill="#333" />
            <circle cx="14" cy="12" r="1.5" fill="#333" />
            <circle cx="12" cy="16" r="1" fill="#333" />
          </>
        );
    }
  };

  const getPoseTransform = () => {
    switch (pose) {
      case 'jumping':
        return 'translate(0, -2) scale(1, 0.9)';
      case 'dancing':
        return 'rotate(5deg)';
      case 'sleeping':
        return 'rotate(15deg) translate(2, 2)';
      default:
        return 'translate(0, 0)';
    }
  };

  const getLeafPose = () => {
    switch (pose) {
      case 'jumping':
        return 'translate(0, -2) rotate(-10deg)';
      case 'dancing':
        return 'rotate(15deg)';
      case 'sleeping':
        return 'rotate(25deg) translate(2, 2)';
      default:
        return 'translate(0, 0)';
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={`Carrot character with ${expression} expression in ${pose} pose`}
    >
      <g transform={getPoseTransform()}>
        {/* Carrot body */}
        <path
          d="M12 21C12 21 3 16 3 9C3 6.5 4.5 4.9 6.5 4C8.5 3.1 12 3 12 3C12 3 15.5 3.1 17.5 4C19.5 4.9 21 6.5 21 9C21 16 12 21 12 21Z"
          fill={color}
          stroke={theme.colors.carrot.dark}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Face expression */}
        {getEyeExpression()}
        
        {/* Body details */}
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
      </g>
      
      {/* Carrot leaves */}
      <g transform={getLeafPose()}>
        <path
          d="M12 3C12 3 12 1 14 2M16 2C16 2 14.5 3 14 3.5M10 2C10 2 11.5 3 12 3.5"
          stroke={leafColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {pose === 'dancing' && (
          <path
            d="M8 1.5C8 1.5 9 2.5 10 2M18 1.5C18 1.5 17 2.5 16 2"
            stroke={leafColor}
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.7"
          />
        )}
      </g>
      
      {/* Thinking bubble for thinking expression */}
      {expression === 'thinking' && (
        <g>
          <circle cx="18" cy="6" r="3" fill="#fff" stroke="#ccc" strokeWidth="1" />
          <circle cx="16" cy="8" r="1" fill="#fff" stroke="#ccc" strokeWidth="0.5" />
          <circle cx="15" cy="9" r="0.5" fill="#fff" stroke="#ccc" strokeWidth="0.5" />
          <text x="18" y="7" textAnchor="middle" fontSize="2" fill="#666">?</text>
        </g>
      )}
    </svg>
  );
}