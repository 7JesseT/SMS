/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FEF9F0',
          100: '#FDF3E0',
          200: '#F5DCC0',
          300: '#EEC8A0',
          400: '#E0B06F',
          500: '#D4AF37',
          600: '#CDA434',
          700: '#A67C00',
          800: '#8A5C1A',
          900: '#5A3C0A',
        },
        white: '#FFFFFF',
        beige: {
          50: '#FFFAF3',
          100: '#FAF9F6',
          200: '#F5F5F5',
          300: '#F0F0F0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'system-ui', 'sans-serif'],
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in-out',
        slideIn: 'slideIn 0.3s ease-out',
        slideUp: 'slideUp 0.4s ease-out',
        scaleIn: 'scaleIn 0.3s ease-out',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shimmer: 'shimmer 2s infinite',
        bounce: 'bounce 1s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
      boxShadow: {
        'gold-sm': '0 1px 2px 0 rgba(212, 175, 55, 0.1)',
        'gold-md': '0 4px 6px -1px rgba(212, 175, 55, 0.15)',
        'gold-lg': '0 10px 15px -3px rgba(212, 175, 55, 0.2)',
        'gold-xl': '0 20px 25px -5px rgba(212, 175, 55, 0.25)',
        'gold-glow': '0 0 20px rgba(212, 175, 55, 0.4)',
      },
      borderRadius: {
        xs: '0.25rem',
        sm: '0.375rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.5rem',
      },
      spacing: {
        gutter: '1.5rem',
        card: '2rem',
      },
    },
  },
  plugins: [],
};
