/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FBF3F0',
        blush: {
          light: '#F6DEE3',
          DEFAULT: '#EFC3CC',
        },
        rose: {
          light: '#DE8CA1',
          DEFAULT: '#C96B82',
          deep: '#9C4A61',
        },
        ink: '#2E2422',
        muted: '#8A7873',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        script: ['"Caveat"', 'cursive'],
        body: ['"Outfit"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
