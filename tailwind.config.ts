import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Carrot-themed colors
        carrot: {
          orange: "var(--carrot-orange)",
          light: "var(--carrot-light)",
          dark: "var(--carrot-dark)",
          pale: "var(--carrot-pale)",
          bright: "var(--carrot-bright)",
        },
        leaf: {
          green: "var(--leaf-green)",
          light: "var(--leaf-light)",
          dark: "var(--leaf-dark)",
          bright: "var(--leaf-bright)",
          pale: "var(--leaf-pale)",
        },
        soil: {
          brown: "var(--soil-brown)",
          light: "var(--soil-light)",
          dark: "var(--soil-dark)",
          pale: "var(--soil-pale)",
        },
        feedback: {
          success: "var(--feedback-success)",
          error: "var(--feedback-error)",
          warning: "var(--feedback-warning)",
          info: "var(--feedback-info)",
        },
        // Shadcn/ui compatible colors
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      fontFamily: {
        heading: ["var(--font-fredoka)"],
        body: ["var(--font-baloo-2)"],
        ui: ["var(--font-quicksand)"],
        mono: ["var(--font-geist-sans)"],
      },
      spacing: {
        xs: "0.25rem",
        sm: "0.5rem",
        md: "1rem",
        lg: "1.5rem",
        xl: "2rem",
        "2xl": "3rem",
        "3xl": "4rem",
      },
      borderRadius: {
        xs: "0.125rem",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "1.5rem",
        "2xl": "2rem",
      },
      boxShadow: {
        xs: "0 1px 2px rgba(0, 0, 0, 0.05)",
        sm: "0 2px 4px rgba(0, 0, 0, 0.1)",
        md: "0 4px 8px rgba(0, 0, 0, 0.12)",
        lg: "0 8px 16px rgba(0, 0, 0, 0.15)",
        xl: "0 12px 24px rgba(0, 0, 0, 0.18)",
        "2xl": "0 16px 32px rgba(0, 0, 0, 0.2)",
      },
      animation: {
        bounce: "bounce 1s infinite",
        pop: "pop 0.3s ease-in-out",
        wiggle: "wiggle 1s ease-in-out",
        grow: "grow 0.3s ease-out",
        fade: "fade 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "slide-left": "slideLeft 0.3s ease-out",
        "slide-right": "slideRight 0.3s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
