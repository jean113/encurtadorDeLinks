import { theme } from "tailwindcss/defaultConfig";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./public/index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontSize: {
        xl: "2rem",
        lg: "1.5rem",
        md: "1.125rem",
        sm: "1rem",
        xs: "0.875rem",
      },
      fontFamily: {
        sans: ["Open Sans", ...theme.fontFamily.sans],
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
};
