import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/renderer/**/*.{ts,tsx,html}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'system-ui',
          'sans-serif'
        ]
      },
      colors: {
        tomato: {
          50: '#fff1f0',
          100: '#ffe0de',
          400: '#ff6b6b',
          500: '#ff4757',
          600: '#e8354a',
          700: '#c22437'
        },
        mint: {
          400: '#26de81',
          500: '#20bf6b',
          600: '#0ea55a'
        },
        break: {
          400: '#45aaf2',
          500: '#2d98da',
          600: '#1e87c3'
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        }
      }
    }
  },
  plugins: []
}

export default config
