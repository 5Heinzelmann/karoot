"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { theme } from "@/lib/theme";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  animated?: boolean;
  variant?: "default" | "game-code";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", animated = true, variant = "default", ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);

    const baseStyles = cn(
      "flex h-10 w-full px-3 py-2 text-sm font-body",
      "border-2 transition-all duration-200 ease-out",
      "file:border-0 file:bg-transparent file:text-sm file:font-medium",
      "placeholder:text-muted-foreground",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      animated && "transform focus:scale-[1.02]"
    );

    const variantStyles = {
      default: cn(
        "rounded-lg bg-white",
        "hover:shadow-sm focus:shadow-md"
      ),
      "game-code": cn(
        "rounded-xl bg-white text-center font-heading text-lg tracking-widest",
        "hover:shadow-md focus:shadow-lg"
      ),
    };

    const getVariantColors = () => {
      const baseColors = {
        borderColor: theme.colors.carrot.pale,
        backgroundColor: theme.colors.background.card,
        "--tw-ring-color": theme.colors.carrot.orange,
        "--tw-ring-offset-color": theme.colors.background.primary,
        "--focus-border": theme.colors.carrot.orange,
        "--hover-border": theme.colors.carrot.light,
      } as const;

      if (variant === "game-code") {
        return {
          ...baseColors,
          color: theme.colors.carrot.orange,
          "--focus-bg": theme.colors.carrot.pale,
        } as const;
      }

      return baseColors;
    };

    const variantColors = getVariantColors();

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      if ("--focus-border" in variantColors) {
        e.currentTarget.style.borderColor = variantColors["--focus-border"];
      }
      if ("--focus-bg" in variantColors) {
        e.currentTarget.style.backgroundColor = variantColors["--focus-bg"];
      }
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      e.currentTarget.style.borderColor = variantColors.borderColor || theme.colors.carrot.pale;
      if (variant === "game-code") {
        e.currentTarget.style.backgroundColor = variantColors.backgroundColor || theme.colors.background.card;
      }
      props.onBlur?.(e);
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLInputElement>) => {
      if (!isFocused && "--hover-border" in variantColors) {
        e.currentTarget.style.borderColor = variantColors["--hover-border"];
      }
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLInputElement>) => {
      if (!isFocused) {
        e.currentTarget.style.borderColor = variantColors.borderColor || theme.colors.carrot.pale;
      }
    };

    if (animated) {
      const {
        onDrag,
        onDragStart,
        onDragEnd,
        onAnimationStart,
        onAnimationEnd,
        onAnimationIteration,
        ...inputProps
      } = props;
      
      return (
        <motion.input
          className={cn(baseStyles, variantStyles[variant], className)}
          ref={ref}
          style={variantColors as React.CSSProperties}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          whileFocus={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
          {...inputProps}
        />
      );
    }

    return (
      <input
        className={cn(baseStyles, variantStyles[variant], className)}
        ref={ref}
        style={variantColors as React.CSSProperties}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
