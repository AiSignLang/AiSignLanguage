/** @type {DefaultColors} */

const colors = require('tailwindcss/colors')

module.exports = {
    content: ["./src/**/*.{ts,tsx,css,js,jsx}"],
    theme: {
        extend: {
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
            'bg-primary': '#0D141A',
            'bg-secondary': '#1C2B36',
            'primary': '#0084FF',
            'primary-hover': '#0072E3',
            'text-primary': '#FFFFFF',
            },
    },
    plugins: [],
}

