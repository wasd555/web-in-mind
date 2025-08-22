"use client";
import "../app/globals.css";

import localFont from "next/font/local";
import { Montserrat, Manrope } from "next/font/google";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { logoutUser } from "../src/lib/apiAuth";
import Link from "next/link";

const geistSans = localFont({
  src: "../app/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "../app/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});
const montserrat = Montserrat({ subsets: ["latin", "cyrillic"], variable: "--font-brand", weight: ["300", "400", "600", "700", "800", "900"] });
const manrope = Manrope({ subsets: ["latin", "cyrillic"], variable: "--font-ui", weight: ["400", "500", "600", "700"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const res = await fetch("http://localhost:8055/users/me", { credentials: "include" });
        setIsLoggedIn(res.ok);
      } catch (error) {
        setIsLoggedIn(false);
      }
    };
    checkLoginStatus();
  }, []);

  function handleLogout() {
    logoutUser();
    router.push("/login");
    setIsLoggedIn(false);
  }

  return (
    <html lang="ru">
      <body className={`min-h-screen overflow-hidden bg-gradient-to-b from-slate-100 to-sky-200 text-gray-900 ${geistSans.variable} ${geistMono.variable} ${montserrat.variable} ${manrope.variable}`} style={{ fontFamily: 'var(--font-ui), var(--default-font-family, ui-sans-serif, system-ui, sans-serif)' }}>
        <header className="fixed top-0 left-0 w-full z-50">
          <div className="mx-auto max-w-6xl">
            <div className="m-0 rounded-b-2xl bg-white/80 backdrop-blur-md shadow px-3 md:px-4 py-3 flex items-center ring-1 ring-black/5 transition-all duration-300">
              <Link href="/" className="flex items-center gap-2">
                <img src="/logo-sunset.svg" alt="GARmonia" className="h-6 w-6" />
                <span className="text-lg md:text-xl lg:text-xl xl:text-2xl font-semibold tracking-tight bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(180deg, #0ea5e9, #14b8a6)" }}>GARmonia</span>
              </Link>
              <div className="flex items-center gap-3 min-w-0 ml-auto justify-end">
                <nav className="flex min-w-0 items-center gap-2 lg:gap-3 xl:gap-4 text-[11px] lg:text-xs text-gray-700 overflow-x-auto whitespace-nowrap pr-1">
                  {isLoggedIn ? (
                    <>
                      <Link href="/dashboard" className="px-2 py-1 rounded transition-colors hover:bg-gradient-to-r hover:from-sky-500 hover:to-teal-600 hover:text-white">Дашборд</Link>
                      <Link href="/videos" className="px-2 py-1 rounded transition-colors hover:bg-gradient-to-r hover:from-sky-500 hover:to-teal-600 hover:text-white">Видео</Link>
                      <Link href="/profile" className="px-2 py-1 rounded transition-colors hover:bg-gradient-to-r hover:from-sky-500 hover:to-teal-600 hover:text-white">Профиль</Link>
                      <button onClick={handleLogout} className="px-2 py-1 rounded transition-colors hover:bg-gradient-to-r hover:from-sky-500 hover:to-teal-600 hover:text-white">Выйти</button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" className="px-2 py-1 rounded hover:text-gray-900 hover:bg-gradient-to-b hover:from-white hover:to-white/70 transition-colors">Войти</Link>
                      <Link href="/register" className="px-3 py-1.5 rounded-full bg-gradient-to-r from-sky-500 to-teal-600 text-white shadow-sm hover:from-sky-400 hover:to-teal-500 transition-colors">Регистрация</Link>
                    </>
                  )}
                </nav>
              </div>
            </div>
          </div>
        </header>
        <main id="app-scroll" className="h-screen overflow-y-auto transition-[filter] duration-300 will-change-auto relative pt-24 px-4">
          <div className="pointer-events-none fixed inset-0 z-0 bg-center bg-cover" style={{ backgroundImage: "url('http://localhost:8055/assets/e58e10de-dd15-4e4b-a465-ea6e8d9a1073.png')" }} />
          <div className="relative z-10 w-full max-w-5xl mx-auto">{children}</div>
        </main>
        <footer className="p-4 text-center text-sm text-gray-600">© {new Date().getFullYear()} GARmonia</footer>
      </body>
    </html>
  );
}