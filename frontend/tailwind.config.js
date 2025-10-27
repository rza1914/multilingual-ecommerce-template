/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // iPhone 17 Orange Color Palette
      colors: {
        orange: {
          50: '#FFF5F0',
          100: '#FFE8DC',
          200: '#FFD1BA',
          300: '#FFB499',
          400: '#FF8C61',
          500: '#FF6B35', // Main iPhone 17 Orange
          600: '#FF4500',
          700: '#E63900',
          800: '#CC3200',
          900: '#B32C00',
        },
        glass: {
          light: 'rgba(255, 255, 255, 0.1)',
          dark: 'rgba(0, 0, 0, 0.2)',
        }
      },
      // Advanced Animations
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
        'shimmer': 'shimmer 2s infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'ripple': 'ripple 0.6s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'tilt': 'tilt 10s infinite linear',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 107, 53, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 107, 53, 0.8)' },
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
        tilt: {
          '0%, 50%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(1deg)' },
          '75%': { transform: 'rotate(-1deg)' },
        },
      },
      // Backdrop Blur for Glass Effect
      backdropBlur: {
        xs: '2px',
        '3xl': '64px',
      },
      // Box Shadows for Depth
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(255, 107, 53, 0.1)',
        'glass-hover': '0 8px 32px 0 rgba(255, 107, 53, 0.2)',
        'glass-orange': '0 8px 32px 0 rgba(255, 107, 53, 0.3)',
        'inner-glow': 'inset 0 0 20px rgba(255, 107, 53, 0.1)',
        'neon': '0 0 5px theme("colors.orange.400"), 0 0 20px theme("colors.orange.500")',
      },
      // Border Radius
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      // Background Images for Gradients
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-orange': 'linear-gradient(135deg, #FF6B35 0%, #FF8C61 100%)',
        'gradient-orange-dark': 'linear-gradient(135deg, #FF4500 0%, #FF6B35 100%)',
        'mesh-orange': 'radial-gradient(at 40% 20%, rgba(255, 107, 53, 0.3) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(255, 140, 97, 0.2) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(255, 69, 0, 0.2) 0px, transparent 50%)',
      },
    },
  },
  plugins: [],
}
