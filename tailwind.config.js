/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ['class'],
    content: [
        './pages/**/*.{js,jsx}',
        './components/**/*.{js,jsx}',
        './app/**/*.{js,jsx}',
        './src/**/*.{js,jsx}',
    ],
    prefix: '',
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '2xl': '1400px',
            },
        },
        extend: {
            screens: {
                sm: '640px',
                // => @media (min-width: 640px) { ... }
                md: '768px',
                // => @media (min-width: 768px) { ... }
                lg: '1024px',
                // => @media (min-width: 1024px) { ... }
                xl: '1280px',
                // => @media (min-width: 1280px) { ... }
                '2xl': '1560px',
                // => @media (min-width: 1536px) { ... }
                '3xl': '1600px',
            },
            colors: {
                verde: '#01E469',
                gris: '#414547',
                azul: '#2f5872',
                blanco: '#ffffff',
                grisclaro: '#FAF8F8',
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))',
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))',
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))',
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))',
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))',
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))',
                },
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))',
                },
            },
            fontSize: {
                '2.5em': '2.5em',
                '2em': '2em',
                '1.75em': '1.75em',
                '1.5em': '1.5em',
                '1.25em': '1.25em',
                '1.1em': '1.1em',
                '1em': '1em',
                '0.93em': '0.93em',
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' },
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' },
                },
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
            },
            // Define custom classes
            customForms: (theme) => ({
                '.custom-select': {
                    '@apply flex w-full items-center justify-between rounded-[10px] border-0 border-neutral-200 bg-grisclaro px-3 py-[12px] pr-10 text-sm text-[#8D8989] ring-offset-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50':
                        {},
                },
                '.custom-input': {
                    '@apply flex h-10 w-full rounded-[10px] mt-[5px] border-0 border-input bg-grisclaro px-[15px] py-2 text-sm text-[#8D8989] ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50':
                        {},
                },
                '.custom-button': {
                    '@apply h-[36px] w-[120px] rounded-[10px] border-0 bg-gris text-[12px] font-normal text-blanco hover:bg-grisclaro hover:text-gris 2xl:w-[120px]':
                        {},
                },
            }),
        },
    },
    plugins: [
        require('tailwindcss-animate'),
        require('@tailwindcss/forms'),
        function ({ addComponents }) {
            addComponents({
                '.custom-select': {
                    '@apply flex w-full font-light items-center justify-between rounded-[10px] border-0 border-neutral-200 bg-grisclaro px-3 py-[10px] pr-10 text-[14px] text-[#8D8989] ring-offset-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 file:font-normal disabled:cursor-not-allowed disabled:opacity-90 placeholder:font-light':
                        {},
                },
                '.custom-input': {
                    '@apply flex h-10 w-full rounded-[10px] mt-[5px] border-0 border-input bg-grisclaro px-[15px] py-[10px] text-[14px] text-[#8D8989] ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-normal placeholder:text-muted-foreground placeholder:uppercase placeholder:font-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-90':
                        {},
                },
                '.custom-button': {
                    '@apply h-[36px] w-[120px] mt-[20px] rounded-[10px] border-0 bg-gris text-[12px] font-normal text-blanco hover:bg-grisclaro hover:text-gris 2xl:w-[120px] disabled:opacity-50':
                        {},
                },
            });
        },
    ],
};
