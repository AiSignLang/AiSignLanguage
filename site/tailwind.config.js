/** @type {import('tailwindcss').Config} */
import * as flowbite from "flowbite-react/tailwind";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content(),
  ],
  theme: {
    extend: {
      screens: {
        'xs': {'max': '639px'}, // screens smaller than sm
      },
    },
    plugins: [
      flowbite.plugin(),

    ],
  }
}
