/** @type {import('tailwindcss').Config} */
const { heroui } = require('@heroui/react')

module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './app/dashboard/**/*.{js,ts,jsx,tsx,mdx}', // Add this for extra safety
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#155E75',
        },
      },
      backgroundImage: {
        factory: "url('/images/factory.jpg')",
        aboutHero: "url('/images/interior-factory.jpg')",
        servicesHero: "url('/images/worker-image.jpg')",
        ourProcess: "url('/images/our-process.jpg')",
      },
    },
  },
  darkMode: 'class',
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: '#155E75',
            },
          },
        },
      },
    }),
  ],
}
