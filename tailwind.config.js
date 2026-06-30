/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', "Georgia", "serif"],
        body: ['"Inter"', "ui-sans-serif", "system-ui", "sans-serif"],
        script: ['"Pacifico"', "cursive"],
      },
      boxShadow: {
        glow: "0 0 44px rgba(244, 114, 182, 0.35)",
        velvet: "0 28px 90px rgba(72, 26, 54, 0.18)",
      },
      keyframes: {
        floatHeart: {
          "0%": { transform: "translate3d(0, 0, 0) rotate(0deg)", opacity: "0" },
          "14%": { opacity: "0.58" },
          "100%": { transform: "translate3d(var(--drift), -118vh, 0) rotate(32deg)", opacity: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0 rgba(244, 114, 182, 0)" },
          "50%": { boxShadow: "0 0 44px rgba(244, 114, 182, 0.48)" },
        },
      },
      animation: {
        floatHeart: "floatHeart linear infinite",
        shimmer: "shimmer 12s ease infinite",
        pulseGlow: "pulseGlow 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
