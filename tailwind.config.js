/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkbg: '#121212',
        navbg: '#1a1a1a',
        primary: '#4361ee',
        secondary: '#3f37c9',
        accent: '#4895ef',
        success: '#4cc9f0',
        warning: '#f72585',
        danger: '#e63946',
        info: '#7209b7',
        teacher: '#3a86ff',
        admin: '#ff006e',
        support: '#8338ec',
        assistant: '#ffbe0b',
        sidebar: '#1a1a1a',
        'sidebar-hover': '#252525',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-up': 'slideUp 0.2s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        glow: {
          '0%,100%': {
            boxShadow: '0 0 5px rgba(67,97,238,.3)',
          },
          '50%': {
            boxShadow: '0 0 15px rgba(67,97,238,.5)',
          },
        },
      },
    },
  },
  plugins: [],
}