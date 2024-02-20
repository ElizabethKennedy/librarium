/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./*.{html,js}"],
    theme: {
      extend: {
        fontFamily: {
          EB_Garamond: ["EB_Garamond", "serif"],
          Cursive: ["Cursive"],
          PlayfairDisplay: ["PlayfairDisplay"]
        },
        maxWidth: {
          inputMax: "15rem",
        },
      },
    },
    plugins: [],
  };
