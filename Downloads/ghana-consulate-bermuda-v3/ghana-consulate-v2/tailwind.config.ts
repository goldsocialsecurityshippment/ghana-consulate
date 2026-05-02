import type { Config } from 'tailwindcss';
const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ghana: {
          red: '#CF0A0A',
          'red-dark': '#A30808',
          gold: '#D4A017',
          'gold-light': '#F0C040',
          green: '#006B3F',
          'green-dark': '#004D2C',
          black: '#1A1A1A',
          cream: '#FDF8F0',
          muted: '#F5F5F0',
        },
      },
      fontFamily: {
        serif: ['"EB Garamond"', 'Georgia', 'Cambria', 'serif'],
        sans: ['"Source Sans 3"', 'system-ui', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 24px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.14)',
        nav: '0 2px 20px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
};
export default config;
