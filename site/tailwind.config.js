/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{ts,tsx,css,js,jsx}"],
    theme: {
        extend: {
            animation: {
                'spin-slow': 'spin 3s linear infinite',
            }
        },
        colors: {
        },
    },
    plugins: [],
}

