/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.jsx",
    "./src/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['Syne', 'sans-serif'],
        'body': ['DM Sans', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      colors: {
        'slate': {
          950: '#020617',
          900: '#0f172a',
          850: '#131c31',
          800: '#1e293b',
        },
        'cyan': {
          400: '#22d3ee',
          500: '#06b6d4',
        },
        'emerald': {
          400: '#34d399',
          500: '#10b981',
        },
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(rgba(34,211,238,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.03) 1px, transparent 1px)",
        'glow-cyan': 'radial-gradient(ellipse at center, rgba(34,211,238,0.15) 0%, transparent 70%)',
        'glow-emerald': 'radial-gradient(ellipse at center, rgba(52,211,153,0.1) 0%, transparent 70%)',
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(34,211,238,0.2), 0 0 20px rgba(34,211,238,0.1)' },
          '100%': { boxShadow: '0 0 10px rgba(34,211,238,0.4), 0 0 40px rgba(34,211,238,0.2)' },
        },
      },
      boxShadow: {
        'cyan-glow': '0 0 20px rgba(34,211,238,0.15)',
        'emerald-glow': '0 0 20px rgba(52,211,153,0.15)',
        'glass': '0 8px 32px rgba(0,0,0,0.3)',
      },
    },
  },
  plugins: [],
}