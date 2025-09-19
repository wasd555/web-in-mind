"use client";
import React from "react";

function Blob({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={[
        "pointer-events-none absolute blur-3xl opacity-50 mix-blend-multiply",
        className || "",
      ].join(" ")}
    />
  );
}

import { useCookieConsent } from "../lib/consent/hook";

export default function Footer() {
  let openSettings: () => void = () => {};
  try {
    openSettings = useCookieConsent().openSettings;
  } catch {
    // ignore if no provider (should not happen in layout)
  }
  return (
    <footer className="relative overflow-hidden rounded-t-3xl border-t border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-md ring-1 ring-black/5 dark:ring-white/10">
      <Blob className="-top-20 -left-10 h-56 w-56 bg-gradient-to-br from-sky-200 to-emerald-200" />
      <Blob className="-bottom-24 right-0 h-72 w-72 bg-gradient-to-tr from-amber-200 to-rose-200" />

      <div className="mx-auto max-w-[120rem] px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid gap-8 sm:gap-10 lg:gap-12 grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 xl:grid-cols-12">
          {/* About */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-3 xl:col-span-3">
            <div className="flex items-center gap-3">
              <img src="/logo-sunset.svg" alt="GARmonia" className="h-6 w-6" />
              <span className="font-semibold">GARmonia</span>
            </div>
            <p className="mt-3 text-sm text-gray-600 max-w-sm">
              Платформа для живых эфиров и видео: баланс, движение, осознанность.
            </p>
          </div>

          {/* Навигация */}
          <nav className="col-span-1 sm:col-span-1 lg:col-span-2 xl:col-span-2">
            <h3 className="text-sm font-semibold text-gray-900">Навигация</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li><a className="hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2" href="#about">О нас</a></li>
              <li><a className="hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2" href="#offerings">Возможности</a></li>
              <li><a className="hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2" href="#trust">Эксперты</a></li>
              <li><a className="hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2" href="#join">Тарифы</a></li>
            </ul>
          </nav>

          {/* Ресурсы */}
          <nav className="col-span-1 sm:col-span-1 lg:col-span-2 xl:col-span-2">
            <h3 className="text-sm font-semibold text-gray-900">Ресурсы</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li><a href="#faq" className="hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">FAQ</a></li>
              <li><a href="#" className="hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">Блог</a></li>
              <li><a href="#" className="hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">Документация</a></li>
              <li><a href="#" className="hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">Политика конфиденциальности</a></li>
            </ul>
          </nav>

          {/* Соцсети */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1 xl:col-span-2">
            <h3 className="text-sm font-semibold text-gray-900">Соцсети</h3>
            <div className="mt-3 flex flex-wrap gap-2 text-sm">
              {[
                { label: "Telegram", href: "#" },
                { label: "YouTube", href: "#" },
                { label: "Instagram", href: "#" },
              ].map((s, i) => (
                <a key={i} href={s.href} className="rounded-xl bg-white/70 ring-1 ring-black/5 px-3 py-2 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 whitespace-nowrap">{s.label}</a>
              ))}
            </div>
          </div>

          {/* Контакты */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-2 xl:col-span-2">
            <h3 className="text-sm font-semibold text-gray-900">Контакты</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li><a href="mailto:hello@garmonia.example" className="hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">hello@garmonia.example</a></li>
              <li><a href="#" className="hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">Поддержка</a></li>
            </ul>
          </div>

          {/* Подписка */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-3 xl:col-span-3">
            <h3 className="text-sm font-semibold text-gray-900">Подписка</h3>
            <form className="mt-3 flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <label className="sr-only" htmlFor="footer-email">Email</label>
              <input id="footer-email" type="email" required placeholder="you@email"
                className="w-full rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-sm shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2" />
              <button className="rounded-xl px-4 py-2 text-sm bg-gray-900 text-white shadow hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 whitespace-nowrap">
                Подписаться
              </button>
            </form>
            <p className="mt-2 text-xs text-gray-500">Без спама. Отписка в 1 клик.</p>
          </div>

          {/* Мини-расписание */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-8 xl:col-span-12">
            <div className="mt-8 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 text-xs text-gray-600">
              <div className="rounded-2xl bg-white/60 ring-1 ring-black/5 px-3 py-2">Ср, 19:00 — Дыхание</div>
              <div className="rounded-2xl bg-white/60 ring-1 ring-black/5 px-3 py-2">Чт, 08:30 — Сон</div>
              <div className="rounded-2xl bg-white/60 ring-1 ring-black/5 px-3 py-2">Пт, 21:00 — Энергия</div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-black/10 bg-white/60">
        <div className="mx-auto max-w-[120rem] px-4 sm:px-6 lg:px-8 py-4 text-xs text-gray-600 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img src="/logo-sunset.svg" alt="GARmonia" className="h-4 w-4" />
            <span>© {new Date().getFullYear()} GARmonia</span>
            <a href="#" className="hover:text-gray-900">Политика</a>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-gray-900">RU</a>
            <a href="#" className="hover:text-gray-900">EN</a>
            <button onClick={openSettings} className="rounded-xl bg-white/70 ring-1 ring-black/5 px-3 py-2 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 whitespace-nowrap">Настройки cookies</button>
          </div>
        </div>
      </div>
    </footer>
  );
}


