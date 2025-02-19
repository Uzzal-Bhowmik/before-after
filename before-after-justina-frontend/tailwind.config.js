const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      screens: {
        "2xl": "1500px",
        "3xl": "1700px",
      },

      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "accent-green": "#3bb5a5",
        "primary-gray": "#0000008f",
        "primary-blue": "#1b71a7",
        "light-primary-blue": "#E8F1F6",
        "primary-red": "#db2424",
        "primary-green": "#65b545",
        "primary-yellow": "#f5bd14",
        "light-gray": "#e8e8e8",
        // "demin-primary-50": "#E8F1F6",
        "demin-primary-50": "var(--demin-primary-50)",
        "demin-primary-200": "var(--demin-primary-200)",
        "dark-gray": "#818181",
        "secondary-1": "#334A55",
        "foundation-accent-400": "#62C3B5",
        "foundation-accent-800": "#20635A",
        "placeholder-background": "#eaeaea",

        danger: "#ca0b00",
        muted: "#727272",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        "dm-sans": ["var(--font-dm-sans)"],
        "general-sans": ["var(--font-general-sans)"],
      },
      keyframes: {
        shake: {
          "0%, 100%": {
            transform: "translateX(0)",
          },
          "20%, 60%": {
            transform: "translateX(-2px)",
          },
          "40%, 80%": {
            transform: "translateX(2px)",
          },
        },
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
      },
      animation: {
        shake: "shake 0.8s ease-in-out 1",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("tailwind-scrollbar")({ nocompatible: true }),
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".popover-content-width-same-as-its-trigger": {
          width: "var(--radix-popover-trigger-width)",
          "max-height": "var(--radix-popover-content-available-height)",
        },
      });
    }),
  ],
};
