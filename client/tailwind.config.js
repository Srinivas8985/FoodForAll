/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#e0f7fa',
                    100: '#b2ebf2',
                    200: '#80deea',
                    300: '#4dd0e1',
                    400: '#26c6da',
                    500: '#09abc4', // User's Choice: Vibrant Cyan/Teal
                    600: '#0097a7', // Darker Cyan
                    700: '#00838f',
                    800: '#006064',
                    900: '#004d40',
                },
                secondary: {
                    50: '#fff8e1',
                    100: '#ffecb3',
                    200: '#ffe082',
                    300: '#ffd54f',
                    400: '#ffca28',
                    500: '#ffc107', // Amber/Gold for excellent contrast with Cyan
                    600: '#ffb300',
                    700: '#ffa000',
                    800: '#ff8f00',
                    900: '#ff6f00',
                },
                accent: {
                    500: '#ff4081', // Pink Accent for CTAs
                    600: '#f50057',
                },
                dark: {
                    800: '#1e1b4b',
                    900: '#0f172a',
                },
                background: {
                    DEFAULT: '#f0fdfa', // Very light teal tint for main background
                    paper: '#ffffff',
                    subtle: '#e6fffa',
                }
            },
            fontFamily: {
                sans: ['"Inter"', 'sans-serif'],
                heading: ['"Outfit"', 'sans-serif'],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'hero-pattern': "url('https://www.transparenttextures.com/patterns/cubes.png')",
                'premium-gradient': 'linear-gradient(135deg, #09abc4 0%, #0097a7 100%)',
                'mesh': 'radial-gradient(at 40% 20%, hsla(190,100%,74%,1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,56%,1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(340,100%,76%,1) 0px, transparent 50%)',
            }
        },
    },
    plugins: [],
}
