"use client";

import * as React from "react";
import { theme } from "@/lib/theme";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    
    const variantStyles = {
      default: `bg-primary text-white hover:bg-primary-dark`,
      outline: `border border-input bg-transparent hover:bg-accent hover:text-accent-foreground`,
      ghost: `hover:bg-accent hover:text-accent-foreground`,
    };
    
    const sizeStyles = {
      default: "h-10 py-2 px-4",
      sm: "h-9 px-3",
      lg: "h-11 px-8",
    };
    
    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;
    
    return (
      <button
        className={combinedClassName}
        ref={ref}
        style={{
          "--tw-ring-color": theme.colors.primary.DEFAULT,
          "--tw-ring-offset-color": theme.colors.background,
          ...(variant === "default" && {
            backgroundColor: props.style?.backgroundColor || theme.colors.primary.DEFAULT,
          }),
        } as React.CSSProperties}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
