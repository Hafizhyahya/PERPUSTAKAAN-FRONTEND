/**  @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}", // tambahkan jika ada folder components
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          dark: '#0F2854',
          medium: '#1C4D8D',
          light: '#4988C4',
          extraLight: '#BDE8F5',
        },
      },
    },
  },
  plugins: [],
}