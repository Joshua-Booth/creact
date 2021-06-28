const isProduction = process.env.NODE_ENV;

module.exports = {
  mode: "jit",
  purge: {
    content: isProduction ? ["./src/**/*.html", "./src/**/*.js"] : [],
    options: {
      safeList: [/^ais-/, /^notif/, /^react-autosuggest/],
    },
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: "#5f51fc",
        grey: "#888888",
        "light-grey": "#b7bbc2",
        "dark-grey": "#343333",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};
