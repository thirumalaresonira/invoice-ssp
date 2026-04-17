/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pastelBlue: '#a7c7e7',
        pastelPink: '#f7c5cc',
        pastelGreen: '#b8e0d2',
        pastelYellow: '#fff2b2',
        pastelPurple: '#d6c1f7',
        accent: '#4f46e5',
      },
      boxShadow: {
        soft: '0 4px 15px rgba(0,0,0,0.08)',
      }
    },
  },
  plugins: [],
}