/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#60B5FF',
        secondary: '#AFDDFF',
        cream: '#FFECDB',
        accent: '#FF9149',
        success: '#00b894',
        error: '#d63031',
        dark: '#2b2d2d',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

