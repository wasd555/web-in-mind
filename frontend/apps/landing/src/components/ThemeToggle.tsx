"use client";

import { useEffect, useState } from "react";

type Props = {
    compact?: boolean;
    inDrawer?: boolean;
    className?: string;
};

const LIGHT = { key: "light", from: "from-slate-100", to: "to-sky-200", text: "text-gray-900" };
const DARK  = { key: "dark",  from: "from-slate-900", to: "to-sky-950", text: "text-slate-100" };

export default function ThemeToggle({ compact = false, inDrawer = false, className = "" }: Props) {
    const [dark, setDark] = useState(false);

    useEffect(() => {
        const saved = typeof window !== "undefined" ? window.localStorage.getItem("theme") : null;
        if (saved === DARK.key) setDark(true);
    }, []);

    useEffect(() => {
        const body = document.body;
        [LIGHT, DARK].forEach((t) => body.classList.remove(t.from, t.to, t.text));
        const next = dark ? DARK : LIGHT;
        body.classList.add(next.from, next.to, next.text);
        body.setAttribute("data-theme", dark ? "dark" : "light");
        try { window.localStorage.setItem("theme", dark ? DARK.key : LIGHT.key); } catch {}
    }, [dark]);

    const width = compact ? 48 : 72;
    const height = compact ? 24 : 28;
    const knob = compact ? 18 : 22;
    const left = dark ? width - knob - 4 : 4;

    return (
        <div className={className}>
            <button
                aria-label="Переключить тему"
                onClick={() => setDark((v) => !v)}
                className={`${inDrawer ? "w-full" : ""} relative rounded-full bg-white/70 backdrop-blur shadow border border-white/60 hover:bg-white transition-colors`}
                style={{ width, height }}
            >
                <span className="sr-only">Theme</span>
                <span className="pointer-events-none absolute inset-0 flex items-center justify-between px-1 text-[10px] text-gray-600">
                    <span>☀️</span>
                    <span>🌙</span>
                </span>
                <span
                    className="absolute top-1 rounded-full bg-teal-500 shadow-md transition-all"
                    style={{ left, width: knob, height: knob }}
                />
            </button>
        </div>
    );
}


