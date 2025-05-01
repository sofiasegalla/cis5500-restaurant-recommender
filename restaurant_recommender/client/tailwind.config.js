/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors';

export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        fontFamily: {
            sans: ['roc-grotesk', 'sans-serif'],
        },
        colors: {
            transparent: 'transparent',
            current: 'currentColor',
            black: colors.black,
            white: colors.white,
            gray: colors.stone,
            rose: colors.rose,
            orange: {
                500: '#ef721a',
            },
            blue: {
                500: '#503fff',
                600: '#3636ce',
                700: '#2b2bbc',
            },
        },
        extend: {
            boxShadow: {
                'button-dark':
                    '0px 4px 10px -2px rgba(0, 0, 0, 0.05), 0px 2px 2px -1px rgba(0, 0, 0, 0.10), 0px -1px 10px 0px rgba(255, 255, 0, 0.30) inset',
            },
        },
    },
    plugins: [],
};
