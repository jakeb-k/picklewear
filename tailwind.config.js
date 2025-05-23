import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.jsx",
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ["Figtree", ...defaultTheme.fontFamily.sans],
                bevan: ["Bevan", ...defaultTheme.fontFamily.sans],
                oswald: ["Oswald", ...defaultTheme.fontFamily.sans],
                roboto_mono: ["Roboto-Mono", ...defaultTheme.fontFamily.sans],
            },
            colors: {
                main: "#FFD100",
                secondary: "rgb(54, 54, 54)",
                tertiary: "#4CAF50",
            },
            boxShadow: {
                summer: "inset 5px 5px 0 2px #000000",
                main: "0 0 25px #FFD100"
            },
            animation: {
                wiggle: "wiggle 0.1s ease-in-out",
                scroll: "scroll 25s linear infinite"
            },
            keyframes: {
                wiggle: {
                    "0%, 100%": { transform: "rotate(-3deg)" },
                    "50%": { transform: "rotate(3deg)" },
                },
                scroll: {
                    from: { transform: "translateX(105%)" },
                    to: { transform: "translateX(-525%)" }, // Moves half the width for a seamless loop
                },
            },
            
        },
    },

    plugins: [forms],
};
