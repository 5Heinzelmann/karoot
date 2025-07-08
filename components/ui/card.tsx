"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { theme } from "@/lib/theme";
import { SlideUp } from "@/components/animations";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "question" | "elevated";
  animated?: boolean;
  delay?: number;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", animated = true, delay = 0, ...props }, ref) => {
    const variantStyles = {
      default: cn(
        "bg-white border border-gray-200",
        "hover:shadow-lg hover:border-orange-200"
      ),
      question: cn(
        "bg-white border-2",
        "hover:shadow-xl hover:scale-[1.02]"
      ),
      elevated: cn(
        "bg-white border border-gray-100 shadow-lg",
        "hover:shadow-xl hover:-translate-y-1"
      ),
    };

    const getVariantColors = () => {
      switch (variant) {
        case "question":
          return {
            borderColor: theme.colors.carrot.pale,
            "--hover-border": theme.colors.carrot.light,
          };
        case "elevated":
          return {
            boxShadow: `0 8px 25px -5px ${theme.colors.carrot.orange}20`,
            "--hover-shadow": `0 20px 40px -10px ${theme.colors.carrot.orange}30`,
          };
        default:
          return {};
      }
    };

    const variantColors = getVariantColors();

    if (animated) {
      return (
        <SlideUp delay={delay} className="w-full">
          <motion.div
            ref={ref}
            className={cn(
              "rounded-2xl transition-all duration-300 ease-out",
              "shadow-sm hover:shadow-md",
              variantStyles[variant],
              className
            )}
            style={variantColors as React.CSSProperties}
            whileHover={{
              y: variant === "elevated" ? -4 : -2,
              transition: { duration: 0.2 }
            }}
            onMouseEnter={(e) => {
              if (variantColors["--hover-border"]) {
                e.currentTarget.style.borderColor = variantColors["--hover-border"];
              }
              if (variantColors["--hover-shadow"]) {
                e.currentTarget.style.boxShadow = variantColors["--hover-shadow"];
              }
            }}
            onMouseLeave={(e) => {
              if (variant === "question") {
                e.currentTarget.style.borderColor = theme.colors.carrot.pale;
              }
              if (variant === "elevated") {
                e.currentTarget.style.boxShadow = variantColors.boxShadow || "";
              }
            }}
            {...props}
          />
        </SlideUp>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl transition-all duration-300 ease-out",
          "shadow-sm hover:shadow-md",
          variantStyles[variant],
          className
        )}
        style={variantColors as React.CSSProperties}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "font-heading font-semibold leading-none tracking-tight text-lg",
      className
    )}
    style={{ color: theme.colors.text.DEFAULT }}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm font-body", className)}
    style={{ color: theme.colors.text.muted }}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("p-6 pt-0 font-body", className)}
    {...props}
  />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
