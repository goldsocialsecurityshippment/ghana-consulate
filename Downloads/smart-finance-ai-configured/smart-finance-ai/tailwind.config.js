/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6C63FF',
        accent: '#00D4AA',
        danger: '#FF4D6D',
        warning: '#FFB020',
        success: '#00D4AA',
        dark: {
          bg: '#0A0A0F',
          surface: '#13131A',
          card: '#1A1A25',
          border: '#2A2A3A',
        },
      },
    },
  },
  plugins: [],
};
