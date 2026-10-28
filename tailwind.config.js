/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Anybody"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Anybody"', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        studio: {
          bg: '#94918c',
          dark: '#1c1b1a',
          light: '#f5f3ef',
          warm: '#c8c2b7',
        }
      }
    },
  },
  plugins: [],
}
