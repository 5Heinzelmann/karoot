"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { theme } from "@/lib/theme";
import { CarrotIcon } from "./carrot-icon";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  withCarrotIcon?: boolean;
  animated?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className = "",
    variant = "default",
    size = "default",
    withCarrotIcon = false,
    animated = true,
    children,
    ...props
  }, ref) => {
    const baseStyles = cn(
      "inline-flex items-center justify-center font-ui font-medium transition-all duration-200",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
      "disabled:opacity-50 disabled:pointer-events-none",
      "rounded-full shadow-sm hover:shadow-md",
      animated && "transform hover:scale-105 active:scale-95"
    );
    
    const variantStyles = {
      default: cn(
        "text-white shadow-lg",
        "hover:shadow-xl"
      ),
      secondary: cn(
        "text-white shadow-lg",
        "hover:shadow-xl"
      ),
      outline: cn(
        "bg-transparent border-2 shadow-sm",
        "hover:shadow-md hover:scale-105"
      ),
      ghost: cn(
        "bg-transparent shadow-none",
        "hover:shadow-sm"
      ),
    };
    
    const sizeStyles = {
      default: "h-10 py-2 px-6 text-sm gap-2",
      sm: "h-8 px-4 text-xs gap-1.5",
      lg: "h-12 px-8 text-base gap-3",
    };

    const getVariantColors = () => {
      switch (variant) {
        case "secondary":
          return {
            backgroundColor: theme.colors.leaf.green,
            borderColor: theme.colors.leaf.dark,
            "--tw-ring-color": theme.colors.leaf.green,
            "--hover-bg": theme.colors.leaf.bright,
          };
        case "outline":
          return {
            borderColor: theme.colors.carrot.orange,
            color: theme.colors.carrot.orange,
            "--tw-ring-color": theme.colors.carrot.orange,
            "--hover-bg": theme.colors.carrot.pale,
            "--hover-color": theme.colors.carrot.dark,
          };
        case "ghost":
          return {
            color: theme.colors.carrot.orange,
            "--tw-ring-color": theme.colors.carrot.orange,
            "--hover-bg": theme.colors.carrot.pale,
          };
        default: // primary
          return {
            backgroundColor: theme.colors.carrot.orange,
            borderColor: theme.colors.carrot.dark,
            "--tw-ring-color": theme.colors.carrot.orange,
            "--hover-bg": theme.colors.carrot.bright,
          };
      }
    };

    const variantColors = getVariantColors();
    
    const combinedClassName = cn(
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      className
    );

    const MotionButton = animated ? motion.button : "button";
    const motionProps = animated ? {
      whileHover: { scale: 1.05 },
      whileTap: { scale: 0.95 },
      transition: { duration: 0.2 }
    } : {};
    
    return (
      <MotionButton
        className={combinedClassName}
        ref={ref}
        style={{
          "--tw-ring-offset-color": theme.colors.background.primary,
          ...variantColors,
        } as React.CSSProperties}
        onMouseEnter={(e) => {
          if (variantColors["--hover-bg"]) {
            e.currentTarget.style.backgroundColor = variantColors["--hover-bg"];
          }
          if (variantColors["--hover-color"]) {
            e.currentTarget.style.color = variantColors["--hover-color"];
          }
        }}
        onMouseLeave={(e) => {
          if (variant === "outline" || variant === "ghost") {
            e.currentTarget.style.backgroundColor = variant === "ghost" ? "transparent" : "transparent";
            e.currentTarget.style.color = variantColors.color || theme.colors.carrot.orange;
          } else {
            e.currentTarget.style.backgroundColor = variantColors.backgroundColor || theme.colors.carrot.orange;
          }
        }}
        {...motionProps}
        {...props}
      >
        {withCarrotIcon && (
          <CarrotIcon
            size={size === "sm" ? 14 : size === "lg" ? 18 : 16}
            color="currentColor"
          />
        )}
        {children}
      </MotionButton>
    );
  }
);

Button.displayName = "Button";
