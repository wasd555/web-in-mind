"use client";

import Image from "next/image";
import { useEffect } from "react";
import ScrollEffects from "../src/components/ScrollEffects";
import SectionDots from "../src/components/SectionDots";

function useRevealOnScroll(className: string = "reveal") {
    useEffect(() => {
        const elements = Array.from(document.querySelectorAll(`.${className}`));
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("revealed");
                    }
                });
            },
            { threshold: 0.2 }
        );
        elements.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [className]);
}

export default function Home() {
    useRevealOnScroll();

    return (
        <div className="w-full relative">
            <ScrollEffects />
            <SectionDots ids={["hero","benefits","pricing","cta"]} />
            {/* Hero */}
            <section id="hero" className="relative h-screen snap-start flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-white/70 via-sky-100/70 to-emerald-100/60" />
                <div className="relative z-20 text-center px-6 reveal">
                    <div className="mx-auto max-w-4xl">
                        <Image src="/hero-dualfaces.svg" alt="Два профиля GARmonia" width={1600} height={640} priority className="w-full h-auto opacity-90" />
                    </div>
                    <h1 className="mt-6 text-[18vw] sm:text-[16vw] md:text-[10rem] leading-none font-light tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-slate-900 to-slate-700" style={{ fontFamily: 'var(--font-brand), var(--font-ui)' }}>GARmonia</h1>
                    <p className="mt-4 text-base md:text-xl text-gray-700 max-w-3xl mx-auto">
                        Платформа для прямых эфиров и видео от психологов и врачей. Найдите баланс, вдохновение и поддержку.
                    </p>
                    <div className="mt-8 flex items-center justify-center gap-4">
                        <a href="http://localhost:3001/register" className="rounded-full bg-teal-600 text-white px-5 md:px-6 py-3 text-sm md:text-base shadow hover:bg-teal-500 transition-colors">Начать путь</a>
                        <a href="#benefits" className="rounded-full bg-white/80 px-5 md:px-6 py-3 text-sm md:text-base text-gray-800 shadow hover:bg-white transition-colors">Узнать больше</a>
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section id="benefits" className="relative h-screen snap-start overflow-hidden flex items-center">
                <Image src="/bg-section-calm.svg" alt="" fill className="object-cover opacity-70 pointer-events-none select-none z-0" />
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-teal-100/60 via-sky-100/60 to-emerald-100/60" />
                <div className="relative z-20 mx-auto max-w-6xl px-6 grid md:grid-cols-2 gap-10 items-center">
                    <div className="reveal rounded-3xl bg-white/50 backdrop-blur-xl ring-1 ring-black/5 p-6 md:p-8">
                        <h2 className="text-3xl md:text-5xl font-semibold text-gray-800">Почему GARmonia</h2>
                        <p className="mt-4 text-gray-600 text-base md:text-lg" style={{ ["--d" as any]: 1 }}>
                            Мы объединяем практики психологии, медицины и движения. Прямые эфиры, курсы и библиотека видео — всё в одном месте, чтобы поддержать ваше внутреннее равновесие.
                        </p>
                        <ul className="mt-6 grid gap-4">
                            <li className="flex items-start gap-3" style={{ ["--d" as any]: 2 }}>
                                <span className="shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-full bg-teal-50">
                                    <Image src="/icon-meditation.svg" alt="Медитации" width={28} height={28} />
                                </span>
                                <div>
                                    <p className="font-medium text-gray-800">Живые эфиры и практики</p>
                                    <p className="text-gray-600 text-sm">Присоединяйтесь к трансляциям с экспертами и участвуйте в интерактивных сессиях.</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3" style={{ ["--d" as any]: 3 }}>
                                <span className="shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-full bg-sky-50">
                                    <Image src="/icon-video.svg" alt="Видео" width={28} height={28} />
                                </span>
                                <div>
                                    <p className="font-medium text-gray-800">Библиотека видео</p>
                                    <p className="text-gray-600 text-sm">Смотрите записи вебинаров и курсы в удобном темпе, с любого устройства.</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3" style={{ ["--d" as any]: 4 }}>
                                <span className="shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50">
                                    <Image src="/icon-heart.svg" alt="Поддержка" width={28} height={28} />
                                </span>
                                <div>
                                    <p className="font-medium text-gray-800">Забота о себе</p>
                                    <p className="text-gray-600 text-sm">Медитации, дыхательные практики, психообразование — всё для вашего благополучия.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="relative reveal">
                        <div data-parallax data-parallax-speed="-0.08" className="relative mx-auto w-full max-w-md aspect-square rounded-3xl bg-white/60 backdrop-blur-md shadow-lg overflow-hidden float-soft">
                            <Image src="/bg-section-calm.svg" alt="" fill className="object-cover opacity-90" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Subscription */}
            <section id="pricing" className="relative h-screen snap-start overflow-hidden flex items-center">
                <Image src="/bg-hero-waves.svg" alt="" fill className="object-cover opacity-60 pointer-events-none select-none z-0" />
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-white/70 via-sky-100/70 to-emerald-100/70" />
                <div className="relative z-20 mx-auto max-w-6xl px-6 grid md:grid-cols-2 gap-10 items-center">
                    <div className="order-2 md:order-1 reveal rounded-3xl bg-white/50 backdrop-blur-xl ring-1 ring-black/5 p-6 md:p-8">
                        <h2 className="text-3xl md:text-5xl font-semibold text-gray-800">Подписка без лишнего</h2>
                        <p className="mt-4 text-gray-600 text-base md:text-lg" style={{ ["--d" as any]: 1 }}>
                            Один план — полный доступ к прямым эфирам и библиотеке. Отмена в любой момент.
                        </p>
                        <div className="mt-6 grid gap-3 text-gray-700">
                            <div className="flex items-center gap-3" style={{ ["--d" as any]: 2 }}><span className="h-6 w-6 rounded-full bg-teal-100 text-teal-600 inline-flex items-center justify-center">✓</span> Прямые эфиры с экспертами</div>
                            <div className="flex items-center gap-3" style={{ ["--d" as any]: 3 }}><span className="h-6 w-6 rounded-full bg-sky-100 text-sky-600 inline-flex items-center justify-center">✓</span> Библиотека записей</div>
                            <div className="flex items-center gap-3" style={{ ["--d" as any]: 4 }}><span className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-600 inline-flex items-center justify-center">✓</span> Личные рекомендации</div>
                        </div>
                        <a href="http://localhost:3001/register" className="mt-8 inline-flex rounded-full bg-teal-600 text-white px-6 py-3 text-sm md:text-base shadow hover:bg-teal-500 transition-colors">Оформить подписку</a>
                    </div>
                    <div className="order-1 md:order-2 reveal">
                        <div data-parallax data-parallax-speed="0.06" className="relative mx-auto w-full max-w-md aspect-[4/3] rounded-3xl bg-white/70 backdrop-blur-md shadow-lg overflow-hidden float-soft">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Image src="/icon-live.svg" alt="Live" width={120} height={120} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section id="cta" className="relative h-screen snap-start overflow-hidden flex items-center justify-center">
                <Image src="/bg-section-calm.svg" alt="" fill className="object-cover opacity-60 pointer-events-none select-none z-0" />
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-emerald-100/70 via-sky-100/70 to-emerald-50/70" />
                <div className="relative z-20 text-center px-6 max-w-2xl reveal rounded-3xl bg-white/50 backdrop-blur-xl ring-1 ring-black/5 py-8">
                    <h2 className="text-3xl md:text-5xl font-semibold text-gray-800">Будьте в балансе каждый день</h2>
                    <p className="mt-4 text-gray-600 text-base md:text-lg" style={{ ["--d" as any]: 1 }}>Присоединяйтесь к сообществу, где ценят осознанность, движение и поддержку.</p>
                    <div className="mt-8 flex items-center justify-center gap-4">
                        <a href="http://localhost:3001/register" className="rounded-full bg-teal-600 text-white px-6 py-3 text-sm md:text-base shadow hover:bg-teal-500 transition-colors" style={{ ["--d" as any]: 2 }}>Присоединиться</a>
                        <a href="http://localhost:3001/login" className="rounded-full bg-white/80 px-6 py-3 text-sm md:text-base text-gray-800 shadow hover:bg-white transition-colors" style={{ ["--d" as any]: 3 }}>У меня есть аккаунт</a>
                    </div>
                </div>
            </section>

            {/* Animations CSS */}
            <style jsx global>{`
              .reveal { opacity: 0; transform: translateY(16px) scale(0.98); transition: opacity .8s ease, transform .8s ease; }
              .reveal.revealed { opacity: 1; transform: translateY(0) scale(1); }
              section { scroll-snap-align: start; }
              @keyframes floatSoft { 0% { transform: translateY(0) } 50% { transform: translateY(-6px) } 100% { transform: translateY(0) } }
              .float-soft { animation: floatSoft 6s ease-in-out infinite; }
              /* extra staggered reveals */
              .reveal > * { --d: 0; opacity: 0; transform: translateY(12px); transition: opacity .6s ease, transform .6s ease; transition-delay: calc(var(--d) * 60ms); }
              .reveal.revealed > * { opacity: 1; transform: translateY(0); }
            `}</style>
        </div>
    );
}