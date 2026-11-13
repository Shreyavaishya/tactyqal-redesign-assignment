import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#25222E',
        paper: '#F9F8F5',
        brand: '#6B3FE0',
        lilac: '#E7DFFB',
        note: '#F7E7A0',
        lime: '#DDEC9A',
        forest: '#2E5B4E',
        line: '#E5E2EA',
        mist: '#F0EEF5',
      },
      fontFamily: {
        display: ['"Inter Tight"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
