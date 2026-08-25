import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    teal: '#29E8A4',
                    navy: '#09263F',
                },
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
                display: ['var(--font-outfit)', 'Outfit', 'system-ui', 'sans-serif'],
                'dm-sans': ['var(--font-dm-sans)', 'DM Sans', 'sans-serif'],
            },
        },
    },
    plugins: [],
}

export default config
