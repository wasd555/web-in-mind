import type { Config } from "tailwindcss";
// @ts-expect-error: no types for this plugin
import forms from "@tailwindcss/forms";

export default {
    content: [
        "./apps/**/*.{js,ts,jsx,tsx}",
        "./packages/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                'hero-pattern': "url('http://localhost:8055/assets/e58e10de-dd15-4e4b-a465-ea6e8d9a1073.png')",
            }
        },
    },
    plugins: [forms],
} satisfies Config;