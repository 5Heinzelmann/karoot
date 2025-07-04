'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { theme } from '@/lib/theme';
import { CarrotIcon } from './carrot-icon';

interface GameCodeDisplayProps {
  code: string;
  className?: string;
}

export function GameCodeDisplay({ code, className = '' }: GameCodeDisplayProps) {
  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="text-center mb-2 text-sm font-medium text-gray-500">
        Game Code
      </div>
      
      <div className="relative">
        <div 
          className="flex items-center justify-center bg-white border-2 border-primary px-8 py-4 rounded-lg shadow-md"
          style={{ borderColor: theme.colors.primary.DEFAULT }}
        >
          <div className="flex items-center space-x-2">
            <CarrotIcon size={24} />
            <div className="text-3xl font-bold tracking-widest">
              {code.split('').map((digit, index) => (
                <span 
                  key={index}
                  className="inline-block mx-1"
                  style={{ color: theme.colors.primary.DEFAULT }}
                >
                  {digit}
                </span>
              ))}
            </div>
            <CarrotIcon size={24} />
          </div>
        </div>
        
        <Button
          onClick={copyToClipboard}
          className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 px-3 py-1 text-xs"
          style={{ 
            backgroundColor: copied ? theme.colors.secondary.DEFAULT : theme.colors.primary.DEFAULT,
            transition: 'background-color 0.3s ease'
          }}
        >
          {copied ? 'Copied!' : 'Copy Code'}
        </Button>
      </div>
      
      <div className="mt-8 text-center text-sm">
        <p>Share this code with participants to join the game</p>
      </div>
    </div>
  );
}