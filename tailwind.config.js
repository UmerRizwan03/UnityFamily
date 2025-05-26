/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        // Existing colors (can be kept or adjusted)
        primary: {
          light: '#67e8f9', // cyan-300
          DEFAULT: '#0ea5e9', // sky-500
          dark: '#0369a1', // sky-700
        },
        secondary: {
          light: '#a5f3fc', // cyan-200
          DEFAULT: '#22d3ee', // cyan-400
          dark: '#0891b2', // cyan-600
        },
        customBlue: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#64b5f6',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // New Dark Theme Palette
        neutral: {
          50:  '#F9FAFB', // Almost white
          100: '#F3F4F6', // Lightest gray
          200: '#E5E7EB', // Light gray
          300: '#D1D5DB', // Gray
          400: '#9CA3AF', // Medium gray
          500: '#6B7280', // Dark gray
          600: '#4B5563', // Darker gray
          700: '#374151', // Even darker gray
          800: '#1F2937', // Very dark gray (good for body bg)
          900: '#111827', // Near black (good for cards/sections)
          950: '#0d1117', // Deepest black (good for primary bg)
        },
        accent: {
          primary: '#8B5CF6', // Violet-500 (example)
          secondary: '#EC4899', // Pink-500 (example)
          success: '#10B981', // Emerald-500
          warning: '#F59E0B', // Amber-500
          danger: '#EF4444', // Red-500
        },
        glow: {
          primary: 'rgba(139, 92, 246, 0.5)', // Violet-500 with opacity
          secondary: 'rgba(236, 72, 153, 0.5)', // Pink-500 with opacity
        }
      },
      boxShadow: {
        'glow-primary': '0 0 15px 5px rgba(139, 92, 246, 0.3)',
        'glow-secondary': '0 0 15px 5px rgba(236, 72, 153, 0.3)',
        'inner-glow': 'inset 0 0 10px 0px rgba(255, 255, 255, 0.05)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'pulse-glow': 'pulseGlow 2s infinite ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 5px var(--glow-color)' },
          '50%': { boxShadow: '0 0 20px 10px var(--glow-color)' },
        },
      },
    },
  },
  plugins: [],
};
