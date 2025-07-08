'use client';

import { useAnimation, useInView } from 'framer-motion';
import { useEffect, useRef } from 'react';

// Hook for triggering animations when element comes into view
export function useAnimateOnView(threshold = 0.1) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    amount: threshold,
    once: true // Only animate once
  });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  return { ref, controls, isInView };
}

// Hook for staggered animations
export function useStaggerAnimation(delay = 0.1) {
  const controls = useAnimation();
  
  const startStagger = async (items: number) => {
    for (let i = 0; i < items; i++) {
      await new Promise(resolve => setTimeout(resolve, delay * 1000));
      controls.start('visible');
    }
  };

  return { controls, startStagger };
}

// Hook for sequential animations
export function useSequentialAnimation() {
  const controls = useAnimation();
  
  const sequence = async (animations: Array<{ target: any; duration?: number }>) => {
    for (const animation of animations) {
      await controls.start(animation.target);
      if (animation.duration) {
        await new Promise(resolve => setTimeout(resolve, animation.duration));
      }
    }
  };

  return { controls, sequence };
}

// Hook for hover animations with custom timing
export function useHoverAnimation(
  hoverVariant: any,
  restVariant: any,
  duration = 0.2
) {
  const controls = useAnimation();

  const handleHoverStart = () => {
    controls.start({
      ...hoverVariant,
      transition: { duration }
    });
  };

  const handleHoverEnd = () => {
    controls.start({
      ...restVariant,
      transition: { duration }
    });
  };

  return {
    controls,
    handleHoverStart,
    handleHoverEnd,
  };
}

// Hook for scroll-triggered animations
export function useScrollAnimation(offset = 100) {
  const ref = useRef<HTMLElement>(null);
  const controls = useAnimation();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight - offset;
      
      if (isVisible) {
        controls.start('visible');
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, [controls, offset]);

  return { ref, controls };
}

// Hook for entrance animations with different types
export function useEntranceAnimation(
  type: 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'bounce' | 'pop' | 'wiggle' | 'scale' = 'fadeIn',
  delay = 0
) {
  const controls = useAnimation();

  const variants = {
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.3, delay } }
    },
    slideUp: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay } }
    },
    slideDown: {
      hidden: { opacity: 0, y: -20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay } }
    },
    slideLeft: {
      hidden: { opacity: 0, x: 20 },
      visible: { opacity: 1, x: 0, transition: { duration: 0.4, delay } }
    },
    slideRight: {
      hidden: { opacity: 0, x: -20 },
      visible: { opacity: 1, x: 0, transition: { duration: 0.4, delay } }
    },
    bounce: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { 
        opacity: 1, 
        scale: 1, 
        transition: { 
          duration: 0.5, 
          delay,
          type: 'spring' as const,
          bounce: 0.4
        }
      }
    },
    pop: {
      hidden: { opacity: 0, scale: 0.5 },
      visible: { 
        opacity: 1, 
        scale: 1, 
        transition: { 
          duration: 0.3, 
          delay,
          type: 'spring' as const
        }
      }
    },
    wiggle: {
      hidden: { opacity: 0, rotate: -5 },
      visible: { 
        opacity: 1, 
        rotate: 0, 
        transition: { 
          duration: 0.6, 
          delay,
          rotate: {
            type: 'spring' as const,
            damping: 10,
            stiffness: 100
          }
        }
      }
    },
    scale: {
      hidden: { opacity: 0, scale: 0 },
      visible: { opacity: 1, scale: 1, transition: { duration: 0.4, delay } }
    }
  };

  const trigger = () => {
    controls.start('visible');
  };

  return {
    controls,
    variants: variants[type],
    trigger
  };
}

// Hook for continuous animations (like loading spinners)
export function useContinuousAnimation(
  animation: any,
  duration = 1,
  repeat = Infinity
) {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      ...animation,
      transition: {
        duration,
        repeat,
        ease: 'linear'
      }
    });
  }, [controls, animation, duration, repeat]);

  return controls;
}

// Hook for gesture-based animations
export function useGestureAnimation() {
  const controls = useAnimation();

  const handleDragEnd = (event: any, info: any) => {
    const threshold = 100;
    
    if (Math.abs(info.offset.x) > threshold) {
      // Swipe animation
      controls.start({
        x: info.offset.x > 0 ? 300 : -300,
        opacity: 0,
        transition: { duration: 0.3 }
      });
    } else {
      // Snap back
      controls.start({
        x: 0,
        opacity: 1,
        transition: { duration: 0.3, type: 'spring' as const }
      });
    }
  };

  const handleTap = () => {
    controls.start({
      scale: [1, 0.95, 1],
      transition: { duration: 0.2 }
    });
  };

  return {
    controls,
    handleDragEnd,
    handleTap
  };
}