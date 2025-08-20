import type { Metadata } from "next";
import localFont from "next/font/local";
import { Montserrat, Manrope } from "next/font/google";
import GlobalThree from "../src/components/HeroThree";
import "./globals.css";
import ThemeToggle from "../src/components/ThemeToggle";
import MobileNav from "../src/components/MobileNav";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

const montserrat = Montserrat({ subsets: ["latin", "cyrillic"], variable: "--font-brand", weight: ["300", "400", "600", "700", "800", "900"] });
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
  return (
    <html lang="ru">
      <body className={`min-h-screen overflow-hidden bg-gradient-to-b from-slate-100 to-sky-200 text-gray-900 ${geistSans.variable} ${geistMono.variable} ${montserrat.variable} ${manrope.variable}`} style={{ fontFamily: 'var(--font-ui), var(--default-font-family, ui-sans-serif, system-ui, sans-serif)' }}>
        <header className="fixed top-0 left-0 w-full z-50">
          <div className="mx-auto max-w-6xl">
            <div className="m-4 rounded-2xl bg-white/80 backdrop-blur-md shadow px-3 md:px-4 py-3 flex items-center justify-between">
              <a href="#hero" className="flex items-center gap-2">
                <img src="http://localhost:8055/assets/3722dc90-08cb-4bbb-a082-08a45304d23e.svg" alt="GARmonia" className="h-6 w-6" />
                <span className="text-xl md:text-2xl font-semibold tracking-tight text-gray-900">GARmonia</span>
              </a>
              <div className="flex items-center gap-3">
                <div className="hidden lg:block">
                  <ThemeToggle compact />
                </div>
              <nav className="hidden md:flex items-center gap-5 text-sm md:text-base text-gray-700">
                <a href="#hero" className="px-2 py-1 rounded hover:bg-white hover:text-gray-900 transition-colors">Главная</a>
                <a href="#benefits" className="px-2 py-1 rounded hover:bg-white hover:text-gray-900 transition-colors">Преимущества</a>
                <a href="#pricing" className="px-2 py-1 rounded hover:bg-white hover:text-gray-900 transition-colors">Подписка</a>
                <a href="#cta" className="px-2 py-1 rounded hover:bg-white hover:text-gray-900 transition-colors">Присоединиться</a>
                <span className="mx-1 h-5 w-px bg-gray-300" />
                <a href="http://localhost:3001/login" className="px-2 py-1 rounded hover:bg-white hover:text-gray-900 transition-colors">Войти</a>
                <a href="http://localhost:3001/register" className="px-3 py-1.5 rounded-full bg-teal-600 text-white hover:bg-teal-500 transition-colors">Регистрация</a>
              </nav>
              <div className="md:hidden">
                <MobileNav logoUrl="http://localhost:8055/assets/3722dc90-08cb-4bbb-a082-08a45304d23e.svg" links={[{ href: "#hero", label: "Главная" }, { href: "#benefits", label: "Преимущества" }, { href: "#pricing", label: "Подписка" }, { href: "#cta", label: "Присоединиться" }]} />
              </div>
              </div>
            </div>
          </div>
        </header>
        <main id="app-scroll" className="h-screen overflow-y-scroll snap-y snap-mandatory transition-[filter] duration-300 will-change-auto relative">
          <div className="pointer-events-none fixed inset-0 z-10">
            <GlobalThree />
          </div>
          {children}
        </main>
        <footer className="relative z-10 border-t border-gray-200/70 bg-white/70 backdrop-blur text-gray-600 text-sm">
          <div className="mx-auto max-w-6xl px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <img src="http://localhost:8055/assets/3722dc90-08cb-4bbb-a082-08a45304d23e.svg" alt="GARmonia" className="h-5 w-5" />
              <span>© {new Date().getFullYear()} GARmonia. Все права защищены.</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="#benefits" className="hover:text-gray-800 transition-colors">Преимущества</a>
              <a href="#pricing" className="hover:text-gray-800 transition-colors">Подписка</a>
              <a href="#cta" className="hover:text-gray-800 transition-colors">Контакты</a>
            </div>
          </div>
        </footer>
        <ThemeToggle />
      </body>
    </html>
  );
}
