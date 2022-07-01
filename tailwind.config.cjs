module.exports = {
  content: ["./src/**/*.{html,js,svelte,ts,md}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: { display: ["Joan-Regular"] },
      typography: ({ theme }) => ({
        slate: {
          css: {
            "--tw-prose-headings": theme("colors.amber[600]"),
          },
        },
      }),
    },
  },

  plugins: [require("@tailwindcss/typography")],
};
