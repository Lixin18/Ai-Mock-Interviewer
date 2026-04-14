/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6', // blue-500
        dark: '#0f172a',    // slate-900
        darker: '#090e17',
        card: '#1e293b',    // slate-800
        'card-hover': '#334155', // slate-700
      }
    },
  },
  plugins: [],
}
