module.exports = {
  content: ["./src/**/*.{html,js,ts,md,astro,mdx,tsx,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: { display: ["Joan-Regular"] },
      typography: ({ theme }) => ({
        slate: {
          css: {
            "--tw-prose-headings": theme("colors.amber[600]"),
            "--tw-prose-links": theme("colors.orange[600]"),
            "--tw-prose-invert-links": theme("colors.orange[400]"),
          },
        },
      }),
    },
  },

  plugins: [require("@tailwindcss/typography")],
};
