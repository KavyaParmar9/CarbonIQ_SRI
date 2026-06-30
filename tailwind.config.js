export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f3fbff',
          100: '#d7f0ff',
          200: '#a8ddff',
          300: '#72c5ff',
          400: '#3a9efc',
          500: '#2172e5',
          600: '#1a5dc2',
          700: '#164a97',
          800: '#133d79',
          900: '#112f5d'
        }
      },
      boxShadow: {
        glow: '0 20px 60px rgba(33, 114, 229, 0.18)',
      }
    }
  },
  plugins: [],
};
