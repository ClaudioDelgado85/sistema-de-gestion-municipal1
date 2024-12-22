/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        lavender: {
          50: '#f8f6ff',
          100: '#f0ebff',
          200: '#e6ddff',
          300: '#d9c8ff',
          400: '#b69fff',
          500: '#9370ff',
          600: '#7c4dff',
          700: '#6c3aed',
          800: '#5a32c7',
          900: '#4a2a9e',
        },
      },
    },
  },
  plugins: [],
};
