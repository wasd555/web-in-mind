import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

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
      <body className={`min-h-screen bg-gradient-to-b from-green-50 to-blue-50 text-gray-900 ${geistSans.variable} ${geistMono.variable}`}>
        <header className="fixed top-0 left-0 w-full bg-gradient-to-r from-green-400 to-blue-400 text-white shadow-lg z-50">
          <div className="max-w-5xl mx-auto flex justify-between items-center p-4">
            <h1 className="text-2xl font-bold">GARmonia</h1>
            <nav className="flex gap-6">
              <a href="/" className="hover:underline">Главная</a>
              <a href="http://localhost:3001/login" className="hover:underline">Войти</a>
              <a href="http://localhost:3001/register" className="hover:underline">Регистрация</a>
            </nav>
          </div>
        </header>
        <main className="max-w-5xl mx-auto p-6 pt-24 flex items-center justify-center">
          {children}
        </main>
        <footer className="p-4 bg-gradient-to-r from-green-400 to-blue-400 text-white text-center text-sm">
          © {new Date().getFullYear()} GARmonia. Все права защищены.
        </footer>
      </body>
    </html>
  );
}
