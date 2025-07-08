'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { theme } from '@/lib/theme';
import { CarrotIcon } from './carrot-icon';
import { cn } from '@/lib/utils';
import { Pop, Bounce } from '@/components/animations';
import { CarrotDecorations } from '@/components/illustrations';

interface GameCodeDisplayProps {
  code: string;
  className?: string;
  animated?: boolean;
}

export function GameCodeDisplay({
  code,
  className = '',
  animated = true
}: GameCodeDisplayProps) {
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

  const CodeWrapper = animated ? Pop : 'div';
  const DecorationWrapper = animated ? Bounce : 'div';

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <motion.div
        className="text-center mb-4"
        initial={animated ? { opacity: 0, y: -10 } : {}}
        animate={animated ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-lg font-heading font-bold" style={{ color: theme.colors.text.DEFAULT }}>
          Game Code
        </h3>
        <p className="text-sm font-body" style={{ color: theme.colors.text.muted }}>
          Share this code with participants
        </p>
      </motion.div>
      
      <div className="relative">
        {/* Decorative carrots around the code */}
        <div className="absolute -left-8 -top-4">
          <DecorationWrapper delay={0.5}>
            <CarrotDecorations variant="leaves" size="sm" animated={animated} />
          </DecorationWrapper>
        </div>
        <div className="absolute -right-8 -top-4">
          <DecorationWrapper delay={0.7}>
            <CarrotDecorations variant="leaves" size="sm" animated={animated} />
          </DecorationWrapper>
        </div>

        <CodeWrapper delay={0.2}>
          <div
            className="flex items-center justify-center px-8 py-6 rounded-2xl border-3 shadow-lg relative overflow-hidden"
            style={{
              backgroundColor: theme.colors.background.card,
              borderColor: theme.colors.carrot.orange,
              boxShadow: `0 8px 25px -5px ${theme.colors.carrot.orange}30`
            }}
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
              <svg width="100%" height="100%" viewBox="0 0 100 100">
                <pattern id="carrot-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M10 18 C10 18 3 14 3 8 C3 6 4 4 5 4 L15 4 C16 4 17 6 17 8 C17 14 10 18 10 18 Z" fill={theme.colors.carrot.pale} />
                </pattern>
                <rect width="100%" height="100%" fill="url(#carrot-pattern)" />
              </svg>
            </div>

            <div className="flex items-center space-x-4 relative z-10">
              <motion.div
                animate={animated ? { rotate: [0, 5, -5, 0] } : {}}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <CarrotIcon size={32} color={theme.colors.carrot.orange} />
              </motion.div>
              
              <div className="font-heading text-4xl font-bold tracking-widest">
                {code.split('').map((digit, index) => (
                  <motion.span
                    key={index}
                    className="inline-block mx-1"
                    style={{ color: theme.colors.carrot.orange }}
                    initial={animated ? { opacity: 0, y: 20, scale: 0.5 } : {}}
                    animate={animated ? { opacity: 1, y: 0, scale: 1 } : {}}
                    transition={{
                      duration: 0.3,
                      delay: 0.4 + index * 0.1,
                      type: "spring",
                      bounce: 0.4
                    }}
                    whileHover={animated ? {
                      scale: 1.2,
                      color: theme.colors.carrot.bright,
                      transition: { duration: 0.2 }
                    } : {}}
                  >
                    {digit}
                  </motion.span>
                ))}
              </div>
              
              <motion.div
                animate={animated ? { rotate: [0, -5, 5, 0] } : {}}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, delay: 1 }}
              >
                <CarrotIcon size={32} color={theme.colors.carrot.orange} />
              </motion.div>
            </div>
          </div>
        </CodeWrapper>
        
        <motion.div
          className="absolute -bottom-6 left-1/2 transform -translate-x-1/2"
          initial={animated ? { opacity: 0, y: 10 } : {}}
          animate={animated ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.3, delay: 1 }}
        >
          <Button
            onClick={copyToClipboard}
            variant={copied ? "secondary" : "default"}
            size="sm"
            withCarrotIcon={!copied}
            className="shadow-lg"
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.span
                  key="copied"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  ✅ Copied!
                </motion.span>
              ) : (
                <motion.span
                  key="copy"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  Copy Code
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>
      </div>
      
      <motion.div
        className="mt-12 text-center"
        initial={animated ? { opacity: 0 } : {}}
        animate={animated ? { opacity: 1 } : {}}
        transition={{ duration: 0.3, delay: 1.2 }}
      >
        <p className="text-sm font-body" style={{ color: theme.colors.text.muted }}>
          Players can join by entering this code at{' '}
          <span className="font-semibold" style={{ color: theme.colors.carrot.orange }}>
            karoot.com
          </span>
        </p>
      </motion.div>
    </div>
  );
}