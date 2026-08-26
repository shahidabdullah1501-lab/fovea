/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        graphite: '#1C1916',
        panel: {
          DEFAULT: '#252119',
          2: '#2E2920',
        },
        line: '#3A342A',
        paper: {
          DEFAULT: '#F1ECDE',
          2: '#E5DEC8',
        },
        ink: '#211D16',
        text: {
          DEFAULT: '#EDE7D9',
          soft: '#A69C89',
          faint: '#6F6656',
        },
        brass: {
          DEFAULT: '#C68A3D',
          ink: '#241703',
          soft: 'rgba(198,138,61,0.16)',
        },
        signal: {
          DEFAULT: '#D4432E',
          soft: 'rgba(212,67,46,0.16)',
        },
        phosphor: {
          DEFAULT: '#4FBFC4',
          soft: 'rgba(79,191,196,0.14)',
        },
        danger: {
          DEFAULT: '#E15A47',
          soft: 'rgba(225,90,71,0.16)',
        },
      },
      fontFamily: {
        serif: ['Instrument Serif', 'Georgia', 'serif'],
        sans: ['Archivo', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'card': '0 1px 2px rgba(0,0,0,0.35), 0 10px 26px rgba(0,0,0,0.35)',
        'aperture': 'inset 0 0 0 6px #1C1916',
      },
      animation: {
        'fade-in': 'fadeIn 0.35s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'spin-slow': 'spin 0.7s linear infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(8px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
