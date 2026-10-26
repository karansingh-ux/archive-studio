/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        display: ['"Clash Display"', '"Cabinet Grotesk"', 'Impact', 'sans-serif'],
        script: ['"Reenie Beanie"', '"Caveat"', '"Brush Script MT"', 'cursive'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
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
