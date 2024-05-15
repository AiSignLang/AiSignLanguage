/** @type {DefaultColors} */
/** @type {import('tailwindcss').Config} */
import * as flowbite from "flowbite-react/tailwind";

const colors = require('tailwindcss/colors')

export default {
    content: [
        "./src/**/*.{ts,tsx,css,js,jsx}",
        flowbite.content(),
    ],
    theme: {
        extend: {
            screens: {
                'xs': {'max': '639px'}, // screens smaller than sm
            },
            animation: {
                'spin-slow': 'spin 3s linear infinite',
            },
            colors: {
                // you can either spread `colors` to apply all the colors
                ...colors,
                // or add them one by one and name whatever you want
                amber: colors.amber,
                emerald: colors.emerald,
            }
        },
        colors: {
            'blue': '#243c5a',
            },
    },
    plugins: [
        flowbite.plugin(),
    ],
}

