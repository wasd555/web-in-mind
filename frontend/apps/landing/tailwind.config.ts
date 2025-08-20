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
            backgroundImage: {
                'hero-pattern': "url('http://localhost:8055/assets/e58e10de-dd15-4e4b-a465-ea6e8d9a1073.png')" // можешь подставить прямой URL из Directus
            },
        },
    },
    plugins: [require('@tailwindcss/forms')],
};


