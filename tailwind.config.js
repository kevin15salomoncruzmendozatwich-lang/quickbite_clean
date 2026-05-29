/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        orange:      { DEFAULT: '#E8632A', dark: '#c9501c', soft: '#FFF3ED' },
        navy:        { DEFAULT: '#1A2A4A', light: '#2d4a7a', muted: '#4A5E7A' },
        cream:       { DEFAULT: '#FFF8F3', dark: '#F5EDE4' },
        border:      '#E8DDD4',
        sub:         '#7A6E65',
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'Georgia', 'serif'],
        dm:       ['"DM Sans"', 'sans-serif'],
      },
      boxShadow: {
        card:   '0 2px 16px rgba(26,42,74,.07)',
        modal:  '0 24px 64px rgba(26,42,74,.18)',
        orange: '0 8px 24px rgba(232,99,42,.25)',
      },
    },
  },
  plugins: [],
}
