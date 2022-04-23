module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts,md}'],
  darkMode: 'class',
  theme: {
    extend: {},
  },

  plugins: [
    require('@tailwindcss/typography'),
  ],
}
