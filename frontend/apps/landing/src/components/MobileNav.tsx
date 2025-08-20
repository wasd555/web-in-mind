"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
    links: { href: string; label: string }[];
    logoUrl?: string;
};

export default function MobileNav({ links, logoUrl }: Props) {
    const [open, setOpen] = useState(false);
    const panelRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, []);

    useEffect(() => {
        if (!open) return;
        const first = panelRef.current?.querySelector<HTMLElement>("a,button");
        first?.focus();
    }, [open]);

    useEffect(() => {
        const root = document.documentElement;
        root.classList.toggle("menu-open", open);
        return () => root.classList.remove("menu-open");
    }, [open]);

    return (
        <>
            <button
                aria-label="Открыть меню"
                className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-lg bg-white/80 backdrop-blur shadow hover:bg-white transition-colors"
                onClick={() => setOpen(true)}
            >
                <span className="sr-only">Меню</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
            </button>
            {/* Overlay */}
            <div
                aria-hidden={!open}
                onClick={() => setOpen(false)}
                className={`fixed inset-0 z-[70] bg-black/10 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
            />
            {/* Drawer */}
            <div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.96) 35%, rgba(236,253,245,0.82) 100%)" }}
                className={`fixed right-0 top-0 h-dvh w-[86%] max-w-sm z-[80] transition-transform duration-300 ease-out ${open ? "translate-x-0" : "translate-x-full"} ${open ? "shadow-2xl" : "shadow-none"} backdrop-blur-xl ring-1 ring-black/5 flex flex-col`}
            >
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200/80">
                    <div className="flex items-center gap-2">
                        {logoUrl ? (
                            <img src={logoUrl} alt="GARmonia" width={24} height={24} className="h-6 w-6" />
                        ) : null}
                        <span className="font-semibold text-gray-900">GARmonia</span>
                    </div>
                    <button aria-label="Закрыть" className="h-9 w-9 inline-flex items-center justify-center rounded-md hover:bg-gray-100" onClick={() => setOpen(false)}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6l-12 12"/></svg>
                    </button>
                </div>
                <nav className="flex-1 flex flex-col px-5 py-4 gap-2 overflow-y-auto">
                    {links.map((l) => (
                        <a key={l.href} href={l.href} className="px-3 py-3 rounded-lg text-gray-800 hover:bg-gray-100 active:bg-gray-200 transition-colors" onClick={() => setOpen(false)}>
                            {l.label}
                        </a>
                    ))}
                    <div className="mt-2 h-px bg-gray-200" />
                    <a href="http://localhost:3001/login" className="px-3 py-3 rounded-lg text-gray-800 hover:bg-gray-100 transition-colors">Войти</a>
                    <a href="http://localhost:3001/register" className="px-3 py-3 rounded-lg bg-teal-600 text-white hover:bg-teal-500 transition-colors">Регистрация</a>
                </nav>
                <div className="px-5 py-4 border-t border-gray-200/80 text-xs text-gray-500 flex items-center justify-between">
                    <span>© {new Date().getFullYear()} GARmonia</span>
                    {logoUrl ? <img src={logoUrl} alt="GARmonia" width={20} height={20} className="opacity-80" /> : null}
                </div>
            </div>
        </>
    );
}


