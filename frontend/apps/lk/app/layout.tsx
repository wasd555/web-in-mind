"use client";
import "../app/globals.css";

import localFont from "next/font/local";
import { Montserrat, Manrope } from "next/font/google";
import { useState, useEffect, useRef } from "react";
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
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const res = await fetch("/api/me", { credentials: "include", cache: "no-store" });
        const ok = res.ok;
        setIsLoggedIn(ok);
        if (ok) {
          const profile = await fetch("/api/me?fields=id,first_name,last_name,email,avatar,role.name", {
            credentials: "include",
            cache: "no-store",
          });
          if (profile.ok) {
            const data = await profile.json();
            setUser(data?.data ?? data);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    checkLoginStatus();

    function onLogin() {
      checkLoginStatus();
    }
    function onLogout() {
      checkLoginStatus();
    }

    if (typeof window !== "undefined") {
      window.addEventListener("auth:login", onLogin);
      window.addEventListener("auth:logout", onLogout);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("auth:login", onLogin);
        window.removeEventListener("auth:logout", onLogout);
      }
    };
  }, []);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current) return;
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [menuOpen]);

  async function handleLogout() {
    try {
      await logoutUser();
    } finally {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("auth:logout"));
      }
      setIsLoggedIn(false);
      setUser(null);
      setMenuOpen(false);
      router.replace("/login");
    }
  }

  return (
    <html lang="ru">
      <body className={`min-h-screen overflow-hidden bg-gradient-to-b from-slate-100 to-sky-200 text-gray-900 ${geistSans.variable} ${geistMono.variable} ${montserrat.variable} ${manrope.variable}`} style={{ fontFamily: 'var(--font-ui), var(--default-font-family, ui-sans-serif, system-ui, sans-serif)' }}>
        <header className="fixed top-0 left-0 w-full z-50">
          <div className="mx-auto max-w-6xl">
            <div className="m-0 rounded-b-2xl bg-white/80 backdrop-blur-md shadow px-3 md:px-4 py-3 flex items-center ring-1 ring-black/5 transition-all duration-300">
              <Link href="http://localhost:3000/" className="flex items-center gap-2">
                <img src="/logo-sunset.svg" alt="GARmonia" className="h-6 w-6" />
                <span className="text-lg md:text-xl lg:text-xl xl:text-2xl font-semibold tracking-tight bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(180deg, #0ea5e9, #14b8a6)" }}>GARmonia</span>
              </Link>
              <div className="flex items-center gap-3 min-w-0 ml-auto justify-end">
                <nav className="flex min-w-0 items-center gap-2 lg:gap-3 xl:gap-4 text-[11px] lg:text-xs text-gray-700 overflow-visible whitespace-nowrap pr-1 relative">
                  {isLoggedIn ? (
                    <>
                      <Link href="/dashboard" className="px-2 py-1 rounded transition-colors hover:bg-gradient-to-r hover:from-sky-500 hover:to-teal-600 hover:text-white">Дашборд</Link>
                      <Link href="/videos" className="px-2 py-1 rounded transition-colors hover:bg-gradient-to-r hover:from-sky-500 hover:to-teal-600 hover:text-white">Видео</Link>
                      <div ref={menuRef} className="relative z-50">
                        <button
                          onClick={() => setMenuOpen((v) => !v)}
                          className="flex items-center gap-2 rounded-full border border-transparent hover:border-sky-300 transition p-0.5"
                          aria-haspopup="menu"
                          aria-expanded={menuOpen}
                        >
                          {user?.avatar ? (
                            <img
                              src={`http://localhost:8055/assets/${user.avatar}`}
                              alt="avatar"
                              className="h-8 w-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-sky-400 to-teal-500 text-white flex items-center justify-center text-xs font-semibold">
                              {(user?.first_name?.[0] || user?.email?.[0] || "U").toUpperCase()}
                            </div>
                          )}
                          <svg className={`h-4 w-4 text-gray-500 transition-transform ${menuOpen ? "rotate-180" : "rotate-0"}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.08z" clipRule="evenodd"/></svg>
                        </button>
                        <div
                          className={`absolute right-0 mt-2 w-40 origin-top-right rounded-xl bg-white/95 backdrop-blur-sm shadow-lg ring-1 ring-black/5 transition transform ${menuOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
                        >
                          <div className="py-1 text-[12px]">
                            <Link
                              href="/profile"
                              onClick={() => setMenuOpen(false)}
                              className="block px-3 py-2 rounded hover:bg-gradient-to-r hover:from-sky-500 hover:to-teal-600 hover:text-white"
                            >
                              Профиль
                            </Link>
                            <button
                              onClick={handleLogout}
                              className="w-full text-left block px-3 py-2 rounded hover:bg-gradient-to-r hover:from-sky-500 hover:to-teal-600 hover:text-white"
                            >
                              Выйти
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <Link href="/login" className="px-3 py-1.5 rounded-full bg-gradient-to-r from-sky-500 to-teal-600 text-white shadow-sm hover:from-sky-400 hover:to-teal-500 transition-colors">Войти</Link>
                      <Link href="/register" className="px-3 py-1.5 rounded-full bg-gradient-to-r from-sky-500 to-teal-600 text-white shadow-sm hover:from-sky-400 hover:to-teal-500 transition-colors">Регистрация</Link>
                    </>
                  )}
                </nav>
              </div>
            </div>
          </div>
        </header>
        <main id="app-scroll" className="h-screen overflow-y-auto transition-[filter] duration-300 will-change-auto relative pt-24 px-4">
          <div className="relative z-10 w-full max-w-5xl mx-auto">{children}</div>
        </main>
        <footer className="p-4 text-center text-sm text-gray-600">© {new Date().getFullYear()} GARmonia</footer>
      </body>
    </html>
  );
}