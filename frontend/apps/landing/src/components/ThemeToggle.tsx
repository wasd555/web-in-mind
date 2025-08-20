"use client";

import { useEffect, useState } from "react";

const THEMES = [
    { key: "default", from: "from-green-50", to: "to-blue-50" },
    { key: "aqua", from: "from-teal-50", to: "to-sky-50" },
    { key: "mint", from: "from-emerald-50", to: "to-cyan-50" },
];

export default function ThemeToggle() {
    const [idx, setIdx] = useState(0);
    useEffect(() => {
        const root = document.documentElement;
        THEMES.forEach((t) => root.classList.remove(t.from, t.to));
        const next = THEMES[idx % THEMES.length];
        root.classList.add(next.from, next.to);
    }, [idx]);

    return (
        <button
            onClick={() => setIdx((v) => (v + 1) % THEMES.length)}
            className="fixed left-5 bottom-5 z-[60] rounded-full bg-white/80 backdrop-blur px-3 py-2 text-xs text-gray-700 shadow hover:bg-white transition-colors"
        >
            Переключить тему
        </button>
    );
}


