import type { Metadata } from "next";
import "../app/globals.css";

export const metadata: Metadata = {
    title: "GARmonia — Личный кабинет",
    description: "Видео и вебинары GARmonia.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ru" className="h-full">
        <body className="min-h-screen flex flex-col bg-gradient-to-b from-green-100 via-blue-100 to-blue-200 text-gray-900">
        {/* Хедер */}
        <header className="fixed top-0 left-0 w-full bg-gradient-to-r from-green-400 to-blue-400 text-white shadow-lg z-50">
            <div className="max-w-5xl mx-auto flex justify-between items-center p-4">
                <h1 className="text-2xl font-extrabold tracking-wide">GARmonia LK</h1>
                <nav className="flex gap-6 text-white font-medium">
                    <a href="/dashboard" className="hover:underline hover:scale-105 transition-transform">
                        Дашборд
                    </a>
                    <a href="/videos" className="hover:underline hover:scale-105 transition-transform">
                        Видео
                    </a>
                    <a href="/profile" className="hover:underline hover:scale-105 transition-transform">
                        Профиль
                    </a>
                    <a href="/login" className="hover:underline hover:scale-105 transition-transform">
                        Войти
                    </a>
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