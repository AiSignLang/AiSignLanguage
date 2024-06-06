/** @type {import('tailwindcss').Config} */
import * as flowbite from "flowbite-react/tailwind";
const colors = require('tailwindcss/colors')

export default {
    content: [
        "./index.html",
        "./src/**/*.{ts,tsx,css,js,jsx}",
        './node_modules/flowbite-react/lib/esm/**/*.js',
    ],
    theme: {
        extend: {
            textColor: {
                'gradient': 'transparent',
            },
            backgroundImage: theme => ({
                'grey-gradient': 'linear-gradient(to right, #7f7f7f, #0e0e0e)',
                'red-gradient': 'linear-gradient(to right, #ff0000, #8b0000)'
            }),
            screens: {
                'xs': {'max': '639px'}, // screens smaller than sm
                'c-sm': {'min': '640px', 'max': '767px'}, // screens greater than or equal to sm
                'c-md': {'min': '768px', 'max': '1023px'}, // screens greater than or equal to md
                'c-lg': {'min': '1024px', 'max': '1279px'}, // screens greater than or equal to lg
                'c-xl': {'min': '1280px', 'max': '1535px'}, // screens greater than or equal to xl
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
                // Custom colors for dark mode theme
                'bg-primary': '#0D141A',
                'bg-secondary': '#1C2B36',
                'primary': '#1D4ED8', // Changed to a more standard blue
                'primary-hover': '#1E40AF', // Darker blue for hover
                'primary-greyed': '#374151', // Cool gray for disabled state
                'primary-greyed-hover': '#334155', // Slightly darker gray for hover
                'text-primary': '#E5E7EB', // Light gray for primary text
                'btn-text-disable': '#9CA3AF', // Muted gray for disabled button text
                'btn-bg-disable': '#4B5563', // Darker gray for disabled button background
            }
        },
        colors: {
            'blue': '#243c5a',
            'bg-primary': '#0D141A',
            'bg-secondary': '#1C2B36',
            'primary': '#1D4ED8', // Changed to a more standard blue
            'primary-hover': '#1E40AF', // Darker blue for hover
            'primary-greyed': '#374151', // Cool gray for disabled state
            'primary-greyed-hover': '#334155', // Slightly darker gray for hover
            'text-primary': '#E5E7EB', // Light gray for primary text
            'btn-text-disable': '#9CA3AF', // Muted gray for disabled button text
            'btn-bg-disable': '#4B5563', // Darker gray for disabled button background
        },
    },
    plugins: [
        require('flowbite/plugin')
    ],
}
