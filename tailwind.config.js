const colors = require("tailwindcss/colors");
const headers = ["h1", "h2", "h3", "h4", "h5", "h6"];

const createStyles = (arr, style) =>
  arr.reduce((acc, name) => {
    acc[name] = style;
    return acc;
  }, {});

module.exports = {
  purge: ["./layouts/**/*.html", "./static/**/*.js", "./content/**/*.md"],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    colors: {
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
    },
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            ...createStyles(headers, {
              marginTop: "1em",
            }),
          },
        },
        light: {
          css: [
            {
              color: theme("colors.gray.400"),
              '[class~="lead"]': {
                color: theme("colors.gray.300"),
              },
              ...createStyles(
                ["ol > li::before", "figure figcaption", "thread"],
                {
                  color: theme("colors.gray.400"),
                }
              ),
              ...createStyles(["ul > li::before", "tbody tr"], {
                backgroundColor: theme("colors.gray.600"),
              }),
              hr: {
                borderColor: theme("colors.gray.200"),
              },
              blockquote: {
                color: theme("colors.gray.200"),
                borderLeftColor: theme("colors.gray.600"),
              },
              ...createStyles([...headers, "a", "strong"], {
                color: theme("colors.white"),
              }),

              pre: {
                color: theme("colors.gray.200"),
                backgroundColor: theme("colors.gray.800"),
              },
            },
          ],
        },
      }),
    },
  },
  variants: {
    extend: {
      typography: ["dark"],
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
