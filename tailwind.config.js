/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // NaradX Brand Colors - derived from logo and reference screens
        navy: {
          950: '#060D1E',
          900: '#0D1B3E',
          800: '#112249',
          700: '#1a3362',
          600: '#1e3a8a',
          500: '#1d4ed8',
          400: '#3b82f6',
          300: '#60a5fa',
          200: '#93c5fd',
          100: '#dbeafe',
          50: '#eff6ff',
        },
        brand: {
          blue: '#1A56DB',
          'blue-dark': '#1e40af',
          'blue-light': '#3b82f6',
          cyan: '#06B6D4',
          'cyan-light': '#22d3ee',
          amber: '#F59E0B',
          'amber-dark': '#d97706',
          'amber-light': '#fbbf24',
        },
        civic: {
          bg: '#F3F4F6',
          'bg-dark': '#E5E7EB',
          card: '#FFFFFF',
          border: '#E5E7EB',
          'border-dark': '#D1D5DB',
          muted: '#6B7280',
          'muted-light': '#9CA3AF',
          heading: '#111827',
          body: '#374151',
        },
        status: {
          critical: '#DC2626',
          'critical-bg': '#FEF2F2',
          high: '#EA580C',
          'high-bg': '#FFF7ED',
          medium: '#CA8A04',
          'medium-bg': '#FEFCE8',
          low: '#16A34A',
          'low-bg': '#F0FDF4',
          info: '#0891B2',
          'info-bg': '#ECFEFF',
        },
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        'card-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'card-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        navy: '0 4px 14px 0 rgba(26, 86, 219, 0.15)',
        'navy-lg': '0 8px 25px 0 rgba(26, 86, 219, 0.25)',
        glow: '0 0 20px rgba(6, 182, 212, 0.15)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #0D1B3E 0%, #1a3362 50%, #1A56DB 100%)',
        'card-gradient': 'linear-gradient(135deg, #ffffff 0%, #f8faff 100%)',
        'blue-gradient': 'linear-gradient(135deg, #1A56DB 0%, #06B6D4 100%)',
        'navy-gradient': 'linear-gradient(180deg, #0D1B3E 0%, #112249 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
