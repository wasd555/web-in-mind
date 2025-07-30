import type { Config } from "tailwindcss";
// @ts-expect-error: no types for this plugin
import forms from "@tailwindcss/forms";

export default {
    content: [
        "./apps/**/*.{js,ts,jsx,tsx}",
        "./packages/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {},
    },
    plugins: [forms],
} satisfies Config;