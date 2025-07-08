'use client';

import React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

// Page transition variants
const pageVariants: Variants = {
  initial: {
    opacity: 0,
    x: -20,
  },
  in: {
    opacity: 1,
    x: 0,
  },
  out: {
    opacity: 0,
    x: 20,
  },
};

const pageTransition = {
  type: 'tween' as const,
  ease: 'anticipate' as const,
  duration: 0.4,
};

// Slide transition variants
const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

const slideTransition = {
  x: { type: 'spring' as const, stiffness: 300, damping: 30 },
  opacity: { duration: 0.2 },
};

// Modal transition variants
const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      damping: 25,
      stiffness: 300,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 20,
    transition: {
      duration: 0.2,
    },
  },
};

const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

// Drawer transition variants
const drawerVariants: Variants = {
  closed: {
    x: '-100%',
    transition: {
      type: 'spring' as const,
      stiffness: 400,
      damping: 40,
    },
  },
  open: {
    x: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 400,
      damping: 40,
    },
  },
};

// Accordion transition variants
const accordionVariants: Variants = {
  closed: {
    height: 0,
    opacity: 0,
    transition: {
      height: {
        duration: 0.3,
      },
      opacity: {
        duration: 0.2,
      },
    },
  },
  open: {
    height: 'auto',
    opacity: 1,
    transition: {
      height: {
        duration: 0.3,
      },
      opacity: {
        duration: 0.2,
        delay: 0.1,
      },
    },
  },
};

// Component interfaces
interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

interface SlideTransitionProps {
  children: React.ReactNode;
  direction: number;
  className?: string;
}

interface ModalTransitionProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  backdropClassName?: string;
}

interface DrawerTransitionProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  side?: 'left' | 'right';
}

interface AccordionTransitionProps {
  children: React.ReactNode;
  isOpen: boolean;
  className?: string;
}

interface FadeTransitionProps {
  children: React.ReactNode;
  show: boolean;
  className?: string;
  duration?: number;
}

// Page transition component
export function PageTransition({ children, className }: PageTransitionProps) {
  return (
    <motion.div
      className={cn(className)}
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
}

// Slide transition component
export function SlideTransition({ 
  children, 
  direction, 
  className 
}: SlideTransitionProps) {
  return (
    <motion.div
      className={cn(className)}
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={slideTransition}
    >
      {children}
    </motion.div>
  );
}

// Modal transition component
export function ModalTransition({
  children,
  isOpen,
  onClose,
  className,
  backdropClassName,
}: ModalTransitionProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className={cn(
              'fixed inset-0 bg-black/50 z-40',
              backdropClassName
            )}
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className={cn(
                'bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-auto',
                className
              )}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              {children}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

// Drawer transition component
export function DrawerTransition({
  children,
  isOpen,
  onClose,
  className,
  side = 'left',
}: DrawerTransitionProps) {
  const drawerSideVariants: Variants = {
    closed: {
      x: side === 'left' ? '-100%' : '100%',
      transition: {
        type: 'spring' as const,
        stiffness: 400,
        damping: 40,
      },
    },
    open: {
      x: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 400,
        damping: 40,
      },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />
          
          {/* Drawer */}
          <motion.div
            className={cn(
              'fixed top-0 bottom-0 z-50 bg-white shadow-xl',
              side === 'left' ? 'left-0' : 'right-0',
              className
            )}
            variants={drawerSideVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Accordion transition component
export function AccordionTransition({
  children,
  isOpen,
  className,
}: AccordionTransitionProps) {
  return (
    <motion.div
      className={cn('overflow-hidden', className)}
      variants={accordionVariants}
      initial="closed"
      animate={isOpen ? 'open' : 'closed'}
    >
      {children}
    </motion.div>
  );
}

// Fade transition component
export function FadeTransition({
  children,
  show,
  className,
  duration = 0.3,
}: FadeTransitionProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={cn(className)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// List transition component for staggered animations
export function ListTransition({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <motion.div
      className={cn(className)}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {React.Children.map(children, (child, index) => (
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

// Route transition wrapper
export function RouteTransition({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        className={cn(className)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}