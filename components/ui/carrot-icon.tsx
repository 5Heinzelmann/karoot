import React from 'react';

interface CarrotIconProps {
  className?: string;
  size?: number;
  alt?: string;
}

export function CarrotIcon({
  className = '',
  size = 24,
  alt = 'Carrot icon'
}: CarrotIconProps) {
  return (
    <img
      src="/images/carrot.webp"
      alt={alt}
      width={size}
      height={size}
      className={className}
      style={{ width: size, height: size }}
    />
  );
}