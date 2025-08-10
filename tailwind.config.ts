import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
        space: {
          50: "var(--space-50)",
          100: "var(--space-100)",
          200: "var(--space-200)",
          300: "var(--space-300)",
          400: "var(--space-400)",
          500: "var(--space-500)",
          600: "var(--space-600)",
          700: "var(--space-700)",
          800: "var(--space-800)",
          900: "var(--space-900)",
          950: "var(--space-950)",
        },
        cosmic: {
          50: "var(--cosmic-50)",
          100: "var(--cosmic-100)",
          200: "var(--cosmic-200)",
          300: "var(--cosmic-300)",
          400: "var(--cosmic-400)",
          500: "var(--cosmic-500)",
          600: "var(--cosmic-600)",
          700: "var(--cosmic-700)",
          800: "var(--cosmic-800)",
          900: "var(--cosmic-900)",
          950: "var(--cosmic-950)",
        },
        neon: {
          cyan: "var(--neon-cyan)",
          green: "var(--neon-green)",
          purple: "var(--neon-purple)",
          pink: "var(--neon-pink)",
        },
        // Enhanced cosmic colors
        'neon-cyan': 'var(--neon-cyan)',
        'cosmic-purple': 'var(--cosmic-purple)',
        'nebula-pink': 'var(--nebula-pink)',
        'space-blue': 'var(--space-blue)',
        'galaxy-violet': 'var(--galaxy-violet)',
        'stellar-gold': 'var(--stellar-gold)',
        'aurora-green': 'var(--aurora-green)',
        'plasma-orange': 'var(--plasma-orange)',
        'quantum-blue': 'var(--quantum-blue)',
        'astral-white': 'var(--astral-white)',
      },
      fontFamily: {
        orbitron: ["var(--font-orbitron)"],
        space: ["var(--font-space)"],
        mono: ["var(--font-mono)"],
        inter: ["var(--font-inter)"],
        sans: ["var(--font-space)"],
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        float: {
          "0%, 100%": { 
            transform: "translateY(0px)" 
          },
          "50%": { 
            transform: "translateY(-10px)" 
          },
        },
        glow: {
          from: { 
            textShadow: "0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor" 
          },
          to: { 
            textShadow: "0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor" 
          },
        },
        'pulse-neon': {
          'from': { 
            textShadow: '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor' 
          },
          'to': { 
            textShadow: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor' 
          },
        },
        'starfield': {
          'from': { transform: 'translateY(0px)' },
          'to': { transform: 'translateY(-100px)' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 3s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite alternate",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        'pulse-neon': 'pulse-neon 2s ease-in-out infinite alternate',
        'starfield': 'starfield 20s linear infinite',
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
