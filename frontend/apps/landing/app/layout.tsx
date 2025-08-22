import type { Metadata } from "next";
import localFont from "next/font/local";
import { Montserrat, Manrope } from "next/font/google";
import GlobalThree from "../src/components/HeroThree";
import "./globals.css";
import ThemeToggle from "../src/components/ThemeToggle";
import MobileNav from "../src/components/MobileNav";
import HeaderBehavior from "../src/components/HeaderBehavior";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

const montserrat = Montserrat({ subsets: ["latin", "cyrillic"], variable: "--font-brand", weight: ["100", "200", "300", "400", "600", "700", "800", "900"] });
const manrope = Manrope({ subsets: ["latin", "cyrillic"], variable: "--font-ui", weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "GARmonia — Be in Balance",
  description: "Психологические и спортивные вебинары и видеоуроки.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Highlight active nav link by intersection
  // Runs on client via inline script tag at the end of header
  return (
    <html lang="ru">
      <body className={`min-h-screen overflow-hidden bg-gradient-to-b from-slate-100 to-sky-200 text-gray-900 ${geistSans.variable} ${geistMono.variable} ${montserrat.variable} ${manrope.variable}`} style={{ fontFamily: 'var(--font-ui), var(--default-font-family, ui-sans-serif, system-ui, sans-serif)' }}>
        <header className="fixed top-0 left-0 w-full z-50">
          <div className="mx-auto max-w-6xl">
            <div data-header-card className="m-0 rounded-b-2xl bg-white/80 backdrop-blur-md shadow px-3 md:px-4 py-3 flex items-center ring-1 ring-black/5 transition-all duration-300">
              <a href="#hero" className="flex items-center gap-2">
                <img src="/logo-sunset.svg" alt="GARmonia" className="h-6 w-6" />
                <span className="text-lg md:text-xl lg:text-xl xl:text-2xl font-semibold tracking-tight bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(180deg, #0ea5e9, #14b8a6)" }}>GARmonia</span>
              </a>
              <div className="flex items-center gap-3 min-w-0 ml-auto justify-end">
                <div className="hidden lg:block flex-shrink-0">
                  <ThemeToggle compact />
                </div>
              <nav className="hidden lg:flex min-w-0 items-center gap-2 lg:gap-3 xl:gap-4 text-[11px] lg:text-xs text-gray-700 overflow-x-auto whitespace-nowrap pr-1" data-nav>
                <a href="#hero" data-id="hero" className="px-2 py-1 rounded transition-colors hover:bg-gradient-to-r hover:from-sky-500 hover:to-teal-600 hover:text-white">Главная</a>
                <a href="#benefits" data-id="benefits" className="px-2 py-1 rounded transition-colors hover:bg-gradient-to-r hover:from-sky-500 hover:to-teal-600 hover:text-white">Преимущества</a>
                <a href="#about" data-id="about" className="px-2 py-1 rounded transition-colors hover:bg-gradient-to-r hover:from-sky-500 hover:to-teal-600 hover:text-white">О нас</a>
                <a href="#offerings" data-id="offerings" className="px-2 py-1 rounded transition-colors hover:bg-gradient-to-r hover:from-sky-500 hover:to-teal-600 hover:text-white">Возможности</a>
                <a href="#trust" data-id="trust" className="px-2 py-1 rounded transition-colors hover:bg-gradient-to-r hover:from-sky-500 hover:to-teal-600 hover:text-white">Доверие</a>
                <a href="#join" data-id="join" className="px-2 py-1 rounded transition-colors hover:bg-gradient-to-r hover:from-sky-500 hover:to-teal-600 hover:text-white">Присоединиться</a>
                <span className="mx-1 h-5 w-px bg-gradient-to-b from-gray-300 to-gray-200" />
                <a href="http://localhost:3002/login" className="px-2 py-1 rounded hover:text-gray-900 hover:bg-gradient-to-b hover:from-white hover:to-white/70 transition-colors">Войти</a>
                <a href="http://localhost:3002/register" className="px-3 py-1.5 rounded-full bg-gradient-to-r from-sky-500 to-teal-600 text-white shadow-sm hover:from-sky-400 hover:to-teal-500 transition-colors">Регистрация</a>
              </nav>
              <div className="lg:hidden">
                <MobileNav logoUrl="/logo-sunset.svg" links={[{ href: "#hero", label: "Главная" }, { href: "#benefits", label: "Преимущества" }, { href: "#about", label: "О нас" }, { href: "#offerings", label: "Возможности" }, { href: "#trust", label: "Доверие" }, { href: "#join", label: "Присоединиться" }]} />
              </div>
              </div>
            </div>
          </div>
          <HeaderBehavior />
        </header>
        <main id="app-scroll" className="h-screen overflow-y-auto transition-[filter] duration-300 will-change-auto relative">
          <div className="pointer-events-none fixed inset-0 z-10">
            <GlobalThree />
          </div>
          {children}
        </main>
      </body>
    </html>
  );
}
