import type { Metadata } from "next";
import localFont from "next/font/local";
import { Montserrat, Manrope } from "next/font/google";
import GlobalThree from "../src/components/HeroThree";
import "./globals.css";
import ThemeToggle from "../src/components/ThemeToggle";
import CookieConsent from "../src/components/CookieConsent";
import { ConsentProvider } from "../src/lib/consent/hook";
import MobileNav from "../src/components/MobileNav";
import HeaderBehavior from "../src/components/HeaderBehavior";
import Footer from "../src/components/Footer";


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
      <body className={`min-h-screen overflow-hidden bg-[#fff] text-gray-900 ${geistSans.variable} ${geistMono.variable} ${montserrat.variable} ${manrope.variable}`} style={{ fontFamily: 'var(--font-ui), var(--default-font-family, ui-sans-serif, system-ui, sans-serif)' }}>
        <header className="fixed top-0 left-0 w-full z-50">
          <div className="mx-auto max-w-7xl">
            <div data-header-card className="neoglass m-0 rounded-b-2xl px-4 py-4 flex items-center justify-between gap-3 transition-all duration-300">
              {/* Left: Logo */}
              <div className="flex items-center">
                <a href="#hero" className="neoglass-logo flex items-center gap-2 px-3 py-2 rounded-2xl">
                  <span className="text-lg md:text-xl lg:text-xl xl:text-2xl font-thin tracking-[0.2em] md:tracking-[0.24em] bg-clip-text text-transparent" style={{ color: "rgb(98, 98, 98)" }}>GARMONIA MIRA</span>
                </a>
              </div>
              {/* Center: Nav */}
              <nav className="hidden lg:flex neoglass-nav w-full flex-1 items-center justify-center gap-2 lg:gap-3 xl:gap-4 text-[16px] lg:text-[16px] text-gray-700 overflow-x-auto whitespace-nowrap px-3 py-2 rounded-2xl overflow-clip" data-nav>
                <a href="#hero" data-id="hero" className="nav-link px-2 py-1 rounded">Главная</a>
                <a href="#benefits" data-id="benefits" className="nav-link px-2 py-1 rounded">Преимущества</a>
                <a href="#about" data-id="about" className="nav-link px-2 py-1 rounded">О нас</a>
                <a href="#offerings" data-id="offerings" className="nav-link px-2 py-1 rounded">Возможности</a>
                <a href="#trust" data-id="trust" className="nav-link px-2 py-1 rounded">Доверие</a>
                <a href="#join" data-id="join" className="nav-link px-2 py-1 rounded">Присоединиться</a>
              </nav>
              {/* Right: Theme toggle + CTA / Mobile menu */}
              <div className="flex items-center justify-end gap-2">
                <div className="hidden lg:block flex-shrink-0">
                  <ThemeToggle compact />
                </div>
                <a href="#trust" className="hidden lg:inline-flex cta-dark px-5 py-2 rounded-2xl text-sm items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-gray-900">↗</span>
                  Заказать консультацию
                </a>
                <div className="lg:hidden">
                  <MobileNav logoUrl="/logo-sunset.svg" links={[{ href: "#hero", label: "Главная" }, { href: "#benefits", label: "Преимущества" }, { href: "#about", label: "О нас" }, { href: "#offerings", label: "Возможности" }, { href: "#trust", label: "Доверие" }, { href: "#join", label: "Присоединиться" }]} />
                </div>
              </div>
            </div>
          </div>
          <HeaderBehavior />
        </header>
        <ConsentProvider>
          <main id="app-scroll" className="h-screen overflow-y-auto transition-[filter] duration-300 will-change-auto relative">
            <div className="pointer-events-none fixed inset-0 z-10">
              <GlobalThree />
            </div>
            {children}
            <Footer />
            <CookieConsent />
          </main>
        </ConsentProvider>
      </body>
    </html>
  );
}
