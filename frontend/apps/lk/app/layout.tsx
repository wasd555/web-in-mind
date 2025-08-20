"use client";
import type { Metadata } from "next";
import "../app/globals.css";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { logoutUser } from "../src/lib/apiAuth";
import Link from "next/link";


export default function RootLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const res = await fetch("http://localhost:8055/users/me", {
                    credentials: "include",
                });
                setIsLoggedIn(res.ok);
            } catch (error) {
                setIsLoggedIn(false);
            }
        };

        checkLoginStatus();
    }, []);

    if (typeof window !== "undefined" && !isLoggedIn && window.location.pathname !== "/login" && window.location.pathname !== "/register") {
        // Можно сделать редирект или оставить как есть
    }

    function handleLogout() {
        logoutUser();
        router.push("/login");
        setIsLoggedIn(false);
    }

    return (
        <html lang="ru" className="h-full">
        <body className="bg-[url('http://localhost:8055/assets/e58e10de-dd15-4e4b-a465-ea6e8d9a1073.png')] bg-cover bg-center min-h-[100svh] md:min-h-screen flex flex-col bg-gradient-to-b from-green-100 via-blue-100 to-blue-200 text-gray-900">
        {/* Хедер */}
        <header className="fixed top-0 left-0 w-full bg-gradient-to-r from-green-400 to-blue-400 text-white shadow-lg z-50">
            <div className="max-w-5xl mx-auto flex justify-between items-center p-4">
                <div className="flex items-center">
                    <img
                        src={'http://localhost:8055/assets/3722dc90-08cb-4bbb-a082-08a45304d23e.svg'}
                        alt="Логотип"
                        className="h-10 w-auto object-contain"
                    />
                    <span className="ml-2 text-xl font-bold">
                      GAR<span className="bg-gradient-to-r from-[#fbb040] to-[#f9ed32] bg-clip-text text-transparent">MONIA</span>
                    </span>
                </div>
                <nav className="flex gap-6 text-white font-medium">
                    {isLoggedIn ? (
                        <>
                            <Link href="/dashboard" className="hover:underline hover:scale-105 transition-transform">Дашборд</Link>
                            <Link href="/videos" className="hover:underline hover:scale-105 transition-transform">Видео</Link>
                            <Link href="/profile" className="hover:underline hover:scale-105 transition-transform">Профиль</Link>
                            <button onClick={handleLogout} className="hover:underline hover:scale-105 transition-transform">Выйти</button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="hover:underline hover:scale-105 transition-transform">Войти</Link>
                            <Link href="/register" className="hover:underline hover:scale-105 transition-transform">Регистрация</Link>
                        </>
                    )}
                </nav>
            </div>
        </header>

        {/* Контент */}
        <main className="pt-24 px-4 flex-1 flex justify-center items-start">
            <div className="w-full max-w-5xl">{children}</div>
        </main>

        {/* Футер */}
        <footer className="p-4 bg-gradient-to-r from-green-400 to-blue-400 text-white text-center text-sm">
            © {new Date().getFullYear()} GARmonia. Все права защищены.
        </footer>
        </body>
        </html>
    );
}