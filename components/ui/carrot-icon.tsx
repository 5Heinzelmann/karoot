import React from 'react';

interface CarrotIconProps {
  className?: string;
  size?: number;
  color?: string;
}

export function CarrotIcon({ 
  className = '', 
  size = 24, 
  color = '#FF7A00' 
}: CarrotIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Carrot body */}
      <path
        d="M12 21C12 21 3 16 3 9C3 6.5 4.5 4.9 6.5 4C8.5 3.1 12 3 12 3C12 3 15.5 3.1 17.5 4C19.5 4.9 21 6.5 21 9C21 16 12 21 12 21Z"
        fill={color}
        stroke="#E56C00"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Carrot leaves */}
      <path
        d="M12 3C12 3 12 1 14 2M16 2C16 2 14.5 3 14 3.5M10 2C10 2 11.5 3 12 3.5"
        stroke="#4CAF50"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}