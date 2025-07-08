'use client';

import React from 'react';
import { motion, HTMLMotionProps, Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

// Basic animation variants
export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' }
  },
};

export const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' }
  },
};

export const slideDownVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' }
  },
};

export const slideLeftVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.4, ease: 'easeOut' }
  },
};

export const slideRightVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.4, ease: 'easeOut' }
  },
};

export const bounceVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.5, 
      ease: 'easeOut',
      type: 'spring',
      bounce: 0.4
    }
  },
};

export const popVariants: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.3, 
      ease: 'backOut',
      type: 'spring'
    }
  },
};

export const wiggleVariants: Variants = {
  hidden: { opacity: 0, rotate: -5 },
  visible: { 
    opacity: 1, 
    rotate: 0,
    transition: { 
      duration: 0.6,
      ease: 'easeOut',
      rotate: {
        type: 'spring',
        damping: 10,
        stiffness: 100
      }
    }
  },
};

export const scaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.4, ease: 'easeOut' }
  },
};

// Stagger container variants
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

// Hover and tap variants
export const hoverScaleVariants = {
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.95, transition: { duration: 0.1 } },
};

export const hoverBounceVariants = {
  hover: {
    y: -2,
    transition: {
      duration: 0.2,
      type: 'spring' as const,
      stiffness: 400
    }
  },
  tap: { y: 0, transition: { duration: 0.1 } },
};

// Motion component interfaces
interface MotionComponentProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

// Reusable motion components
export function FadeIn({ 
  children, 
  className, 
  delay = 0, 
  ...props 
}: MotionComponentProps) {
  return (
    <motion.div
      className={cn(className)}
      variants={fadeInVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function SlideUp({ 
  children, 
  className, 
  delay = 0, 
  ...props 
}: MotionComponentProps) {
  return (
    <motion.div
      className={cn(className)}
      variants={slideUpVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function SlideDown({ 
  children, 
  className, 
  delay = 0, 
  ...props 
}: MotionComponentProps) {
  return (
    <motion.div
      className={cn(className)}
      variants={slideDownVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function SlideLeft({ 
  children, 
  className, 
  delay = 0, 
  ...props 
}: MotionComponentProps) {
  return (
    <motion.div
      className={cn(className)}
      variants={slideLeftVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function SlideRight({ 
  children, 
  className, 
  delay = 0, 
  ...props 
}: MotionComponentProps) {
  return (
    <motion.div
      className={cn(className)}
      variants={slideRightVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function Bounce({ 
  children, 
  className, 
  delay = 0, 
  ...props 
}: MotionComponentProps) {
  return (
    <motion.div
      className={cn(className)}
      variants={bounceVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function Pop({ 
  children, 
  className, 
  delay = 0, 
  ...props 
}: MotionComponentProps) {
  return (
    <motion.div
      className={cn(className)}
      variants={popVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function Wiggle({ 
  children, 
  className, 
  delay = 0, 
  ...props 
}: MotionComponentProps) {
  return (
    <motion.div
      className={cn(className)}
      variants={wiggleVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function Scale({ 
  children, 
  className, 
  delay = 0, 
  ...props 
}: MotionComponentProps) {
  return (
    <motion.div
      className={cn(className)}
      variants={scaleVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({ 
  children, 
  className, 
  ...props 
}: MotionComponentProps) {
  return (
    <motion.div
      className={cn(className)}
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ 
  children, 
  className, 
  ...props 
}: MotionComponentProps) {
  return (
    <motion.div
      className={cn(className)}
      variants={staggerItemVariants}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Interactive motion components
export function HoverScale({ 
  children, 
  className, 
  ...props 
}: MotionComponentProps) {
  return (
    <motion.div
      className={cn('cursor-pointer', className)}
      variants={hoverScaleVariants}
      whileHover="hover"
      whileTap="tap"
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function HoverBounce({ 
  children, 
  className, 
  ...props 
}: MotionComponentProps) {
  return (
    <motion.div
      className={cn('cursor-pointer', className)}
      variants={hoverBounceVariants}
      whileHover="hover"
      whileTap="tap"
      {...props}
    >
      {children}
    </motion.div>
  );
}