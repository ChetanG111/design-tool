import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './lib/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
            },
            colors: {
                bg: '#131313',
                surface: '#1E1E20',
                accent: '#8561EF',
                'soft-accent': '#E4DBFF',
                highlight: '#E3FF93',
                border: 'rgba(255, 255, 255, 0.05)',
                'text-secondary': '#A1A1AA',
            },
            animation: {
                shimmer: 'shimmer 2s infinite cubic-bezier(0.4, 0, 0.2, 1)',
            },
            keyframes: {
                shimmer: {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(100%)' },
                },
            },
        },
    },
    plugins: [],
};

export default config;
