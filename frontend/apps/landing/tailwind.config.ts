/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
        // если у тебя есть src:
        './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    sky: {
                        50: '#eff8ff',
                        100: '#dff1ff',
                        200: '#c7e7ff',
                    },
                    teal: {
                        50: '#e6fbf7',
                        100: '#c9f6ee',
                        200: '#a0efe2',
                    },
                    amber: {
                        50: '#fff7e6',
                        100: '#ffefcc',
                        200: '#ffe3a6',
                    },
                },
            },
            borderRadius: {
                DEFAULT: '1.5rem', // rounded-3xl по умолчанию для класса rounded
            },
            boxShadow: {
                soft: '0 6px 18px rgba(15,23,42,.08)',
            },
            backgroundImage: {
                'hero-pattern': "url('http://localhost:8055/assets/e58e10de-dd15-4e4b-a465-ea6e8d9a1073.png')"
            },
            container: {
                center: true,
                padding: {
                    DEFAULT: '1rem',
                    sm: '1.5rem',
                    lg: '2rem',
                },
            },
        },
    },
    plugins: [require('@tailwindcss/forms')],
};


