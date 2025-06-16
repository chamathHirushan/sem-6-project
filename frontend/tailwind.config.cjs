/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        transparent: "transparent",
        current: "currentColor",
        white: { DEFAULT: "#ffffff" },
        // Replacing custom color palette with the provided colors
        primary: "#205781", // Dark blue color
        secondary: "#4F959D", // Teal color
        accent: "#98D2C0", // Light teal color
        background: "#FBFCEB", // Light yellowish-green color
        black: { DEFAULT: "#000000" },
        gray: {
          light: "#F3EBE2",
          DEFAULT: "#4F4F4F",
          50: "#E6E6E6",
          300: "#828282",
          400: "#4F4F4F",
        },
        green: {
          50: "#E3F8EE",
        },
        purple: {
          150: "#DED1FF",
        },
        red: { DEFAULT: "#FD0054" },
        yellow: "#FDFFD0",
        blue: "#ACC7E8",
      },
      keyframes: {
        slideAndBounce: {
          "0%": { transform: "translateX(200%)" },
          "70%": { transform: "translateX(15%)" },
          "85%": { transform: "translateX(20%)" },
          "100%": { transform: "translateX(25%)" },
        },
        zoomIn: {
          "0%": {
            transform: "scale(0.1,0.1)",
            opacity: "0",
          },
          "95%": {
            transform: "scale(1.05,1.05)",
            opacity: "1",
          },
          "100%": { transform: "scale(1,1)" },
        },
        skeletonLoading: {
          "0%": {
            backgroundColor: "#FDF4EA",
          },
          "100%": {
            backgroundColor: "#F3EBE2",
          },
        },
        pulse: {
          "0%, 100%": {
            boxShadow: "none",
          },
          "50%": {
            boxShadow: "0px 0px 15px 0px rgba(253,0,84,1)",
            opacity: 1,
          },
        },
        rippler: {
          "0%": {
            width: 0,
            height: 0,
            opacity: 0,
          },
          "50%": {
            width: "15px",
            height: "15px",
            border: "15px solid #f18093",
            opacity: 0.8,
          },
          "80%": {
            opacity: 0.8,
          },
          "100%": {
            border: "15px solid #f18093",
            width: "70px",
            height: "70px",
            opacity: 0,
          },
        },
      },
      animation: {
        zoomIn: "zoomIn 0.5s",
        skeletonLoading: "skeletonLoading 1s linear infinite alternate",
        pulse: "pulse 1.5s ease-in-out infinite",
        ripple: "rippler 2.5s ease-in-out infinite",
        slideAndBounce:
          "slideAndBounce 1s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      },
      fontSize: {
        xxs: "0.60rem",
        lg: "17px",
      },
      aspectRatio: {
        auto: "auto",
        square: "1 / 1",
        video: "16 / 9",
      },
      backgroundImage: {
        linen_gradient:
          "radial-gradient(50% 50% at 10% 20%, #f3e6d8 0%, #e9f2f821 100%),radial-gradient(50% 50% at 50% 70%, #efd2a763 0%, #e9f2f821 100%),radial-gradient(50% 50% at 70% 10%, #fff8f2 0%, #e9f2f821 100%)",
        "custom-gradient":
          "radial-gradient(clamp(1000px, 50vw, 1200px) at clamp(150px, 10vw, 150px) clamp(150px, 10vh, 150px), rgba(255, 191, 94, 0.3), transparent 20%), radial-gradient(clamp(900px, 90vw, 1500px) at clamp(100px, 95vw, 1800px) clamp(650px, 90vh, 650px), rgba(253, 0, 84, 0.3), transparent 20%)",
      },
      fontFamily: {
        dm_sans: ["DM Sans", "sans-serif"],
        lexend: ["Lexend", "sans-serif"],
        playfair: ["Playfair"],
      },
    },
  },
  variants: {
    fill: ["hover", "focus"], // this line does the trick in Svg component [path>]
  },
  plugins: [
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/line-clamp"),
  ],
};
