"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
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
    // Live block state: chat rotation, reactions, timer
    const chatPool = useMemo<string[]>(() => [
        "Сегодня дыхание через 4–7–8",
        "Супер! Жду начало ✨",
        "А будет запись?",
        "Помогает при тревоге!",
        "Музыка будет?",
        "Спасибо, что делаете такое",
    ], []);
    const [chat, setChat] = useState<string[]>([chatPool[0]!, chatPool[1]!]);
    useEffect(() => {
        let idx = 2;
        const id = setInterval(() => {
            setChat((prev) => {
                const next = chatPool[idx % chatPool.length]!;
                idx += 1;
                const arr = [...prev, next];
                return arr.slice(-3);
            });
        }, 2500);
        return () => clearInterval(id);
    }, [chatPool]);

    type Reaction = { id: number; x: number; emoji: string };
    const [reactions, setReactions] = useState<Reaction[]>([]);
    useEffect(() => {
        let id = 0;
        const emojis: string[] = ["💙", "💚", "✨", "💫", "👍"]; 
        const interval = setInterval(() => {
            setReactions((r) => {
                const nx: Reaction = { id: id++, x: Math.random() * 80 + 10, emoji: emojis[Math.floor(Math.random()*emojis.length)]! };
                const trimmed = r.filter((it) => it.id > id - 20); // keep ~20 visible
                return [...trimmed, nx];
            });
        }, 700);
        return () => clearInterval(interval);
    }, []);

    const totalSeconds = 5 * 60 + 23;
    const [left, setLeft] = useState(totalSeconds);
    const startRef = useRef<number | null>(null);
    useEffect(() => {
        startRef.current = Date.now();
        const tick = setInterval(() => {
            if (!startRef.current) return;
            const elapsed = Math.floor((Date.now() - startRef.current) / 1000);
            const remain = Math.max(0, totalSeconds - elapsed);
            setLeft(remain);
        }, 1000);
        return () => clearInterval(tick);
    }, []);
    const mm = String(Math.floor(left / 60)).padStart(2, "0");
    const ss = String(left % 60).padStart(2, "0");
    const progress = 1 - left / totalSeconds;
    const [viewers, setViewers] = useState(1254);
    useEffect(() => {
        const t = setInterval(() => setViewers((v) => v + Math.floor(Math.random() * 3)), 3000);
        return () => clearInterval(t);
    }, []);

    return (
        <div className="w-full relative">
            <ScrollEffects />
            <SectionDots ids={["hero","benefits","pricing","cta"]} />
            {/* Hero */}
            <section id="hero" className="relative h-screen snap-start flex items-center justify-center overflow-visible">
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-white/70 via-sky-100/70 to-emerald-100/60" data-theme-bg />
                <div className="pointer-events-none absolute inset-0 z-10 aurora" aria-hidden />
                <div className="relative z-20 w-full px-6 reveal">
                    <div className="mx-auto max-w-7xl">
                        <h1 className="w-full text-left whitespace-nowrap leading-[0.9] font-light tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-slate-900 to-slate-700 text-[14vw] sm:text-[12vw] md:text-[10rem] lg:text-[12rem] xl:text-[14rem] 2xl:text-[15rem]" style={{ fontFamily: 'var(--font-brand), var(--font-ui)' }}>
                            <span className="brand-accent">GAR</span>monia
                        </h1>
                        <div className="mt-3 h-[2px] w-[min(90vw,960px)] overflow-hidden rounded-full spectrum" />
                        <div className="mt-6 grid md:grid-cols-2 items-start gap-10">
                        {/* Left: brand, lines, text, stats, ctas */}
                        <div className="text-left md:pr-6">
                            <p className="mt-2 text-base md:text-xl text-gray-700 max-w-xl">
                                Платформа для прямых эфиров и видео от психологов и врачей. Найдите баланс, вдохновение и поддержку.
                            </p>
                            <div className="mt-6 grid grid-cols-3 max-w-md gap-3 text-sm">
                                <div className="glass px-3 py-2 rounded-xl">
                                    <p className="font-medium text-gray-800">Экспертов</p>
                                    <p className="text-teal-600 text-lg">50+</p>
                                </div>
                                <div className="glass px-3 py-2 rounded-xl">
                                    <p className="font-medium text-gray-800">Видео</p>
                                    <p className="text-sky-600 text-lg">1 200+</p>
                                </div>
                                <div className="glass px-3 py-2 rounded-xl">
                                    <p className="font-medium text-gray-800">Эфиры в месяц</p>
                                    <p className="text-emerald-600 text-lg">30+</p>
                                </div>
                            </div>
                            <div className="mt-8 flex items-center gap-4">
                                <a href="http://localhost:3001/register" className="rounded-full bg-teal-600 text-white px-5 md:px-6 py-3 text-sm md:text-base shadow hover:bg-teal-500 transition-colors">Начать путь</a>
                                <a href="#benefits" className="rounded-full bg-white/80 px-5 md:px-6 py-3 text-sm md:text-base text-gray-800 shadow hover:bg-white transition-colors">Узнать больше</a>
                            </div>
                            <div className="mt-4 h-[3px] w-[min(70vw,520px)] md:w-[460px] neon-line" />
                        </div>
                        {/* Right: live preview card */}
                        <div className="block mt-6 md:mt-0">
                            <div className="relative mx-auto max-w-lg w-full aspect-[4/3] rounded-3xl overflow-hidden ring-1 ring-black/5 bg-white/50 backdrop-blur-xl shadow-lg live-card">
                                {/* mock background */}
                                <Image src="/live-mock-upload.png" alt="Live" fill className="object-cover z-0 opacity-20" />
                                {/* overlays */}
                                <div className="absolute left-4 top-4 z-20 px-2 py-1 rounded-full text-[10px] md:text-xs font-medium bg-rose-600 text-white shadow">LIVE</div>
                                <div className="absolute right-4 top-4 z-20 text-[10px] md:text-xs text-gray-800/90 bg-white/70 backdrop-blur px-2 py-1 rounded-md shadow">до начала {mm}:{ss}</div>
                                <div className="absolute left-4 top-4 translate-y-[28px] z-20 flex items-center gap-2 text-[10px] md:text-xs text-gray-800/90 bg-white/70 backdrop-blur px-2 py-1 rounded-md shadow">
                                    <span className="inline-block h-2 w-2 rounded-full bg-green-500" /> {viewers.toLocaleString()} зрителей
                                </div>
                                <div className="absolute left-0 right-0 top-[38px] z-20 h-[3px] bg-gradient-to-r from-emerald-400 via-sky-400 to-emerald-400/30">
                                    <div className="h-full bg-teal-600" style={{ width: `${Math.max(0, Math.min(100, progress*100))}%` }} />
                                </div>
                                {/* floating chat */}
                                <div className="absolute right-2 bottom-16 flex flex-col items-end gap-2 z-20">
                                    {chat.map((msg, i) => (
                                        <div key={i} className="chat-bubble glass px-2 py-1.5 rounded-2xl shadow text-[11px] max-w-[70%]">{msg}</div>
                                    ))}
                                </div>
                                {/* floating reactions */}
                                <div className="pointer-events-none absolute inset-0 z-20">
                                    {reactions.map((r) => (
                                        <span key={r.id} className="reaction" style={{ left: `${r.x}%` }}>{r.emoji}</span>
                                    ))}
                                </div>
                                <div className="absolute inset-0 flex flex-col justify-end p-5 gap-3 bg-gradient-to-t from-black/15 via-transparent to-transparent">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-teal-400 to-sky-400" />
                                        <div>
                                            <p className="text-gray-800 font-medium">Прямой эфир: дыхательные практики</p>
                                            <p className="text-gray-600 text-xs">с д-ром Муратовой Гульмирой</p>
                                        </div>
                                    </div>
                                    <div className="eq grid grid-cols-24 items-end gap-[3px] h-8 md:h-10">
                                        {Array.from({ length: 24 }).map((_, i) => (
                                            <span key={i} className="block w-[4px] bg-teal-500/70" style={{ animationDelay: `${i * 60}ms` }} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section id="benefits" className="relative h-screen snap-start overflow-hidden flex items-center">
                <Image src="/bg-section-calm.svg" alt="" fill className="object-cover opacity-70 pointer-events-none select-none z-0" />
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-teal-100/60 via-sky-100/60 to-emerald-100/60" data-theme-bg />
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
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-white/70 via-sky-100/70 to-emerald-100/70" data-theme-bg />
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
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-emerald-100/70 via-sky-100/70 to-emerald-50/70" data-theme-bg />
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
              /* theme-aware backgrounds */
              body[data-theme="dark"] [data-theme-bg] { filter: brightness(0.7) saturate(0.9) hue-rotate(-10deg); }
              /* Aurora */
              .aurora { 
                background: radial-gradient(1200px 400px at 20% 30%, rgba(99,102,241,.18), transparent 50%),
                            radial-gradient(900px 300px at 80% 25%, rgba(45,212,191,.16), transparent 50%),
                            radial-gradient(900px 380px at 50% 70%, rgba(56,189,248,.12), transparent 55%);
                mix-blend-mode: screen; filter: blur(8px);
                animation: auroraShift 18s ease-in-out infinite alternate;
              }
              @keyframes auroraShift { 0% { transform: translate3d(0,0,0); } 100% { transform: translate3d(0,-16px,0); } }
              /* Spectrum */
              .spectrum { background: repeating-linear-gradient(90deg, rgba(14,165,233,.5), rgba(16,185,129,.5) 6px, transparent 6px, transparent 12px); opacity:.6; animation: spec 10s linear infinite; }
              @keyframes spec { from { background-position: 0 0; } to { background-position: 600px 0; } }
              /* Glass */
              .glass { background: rgba(255,255,255,.60); backdrop-filter: blur(10px); border: 1px solid rgba(0,0,0,.05); }
              body[data-theme="dark"] .glass { background: rgba(2,6,23,.40); border-color: rgba(255,255,255,.06); }
              /* Neon line */
              .neon-line { background: linear-gradient(90deg, rgba(13,148,136,0), rgba(13,148,136,.8), rgba(56,189,248,.8), rgba(13,148,136,0)); box-shadow: 0 0 10px rgba(56,189,248,.35); }
              /* Brand accent for GAR */
              .brand-accent { background: linear-gradient(180deg, #0ea5e9, #14b8a6); -webkit-background-clip: text; background-clip: text; color: transparent; filter: drop-shadow(0 6px 16px rgba(56,189,248,.15)); }
              /* Live equalizer */
              .eq span { height: 6px; animation: eq 1.2s ease-in-out infinite; border-radius: 2px; }
              @keyframes eq { 0%,100%{ height:6px } 40%{ height: 100% } 70%{ height: 40% } }
              /* Chat bubbles */
              .chat-bubble { animation: floatChat 6s ease-in-out infinite; }
              .chat-bubble:nth-child(2){ animation-delay: 1.5s; }
              @keyframes floatChat { 0%,100% { transform: translateY(0) ; opacity: .95 } 50% { transform: translateY(-6px); opacity: 1 } }
              .reaction { position:absolute; bottom:-10px; font-size: 18px; animation: fly 3s ease-in forwards; filter: drop-shadow(0 2px 6px rgba(0,0,0,.2)); }
              @keyframes fly { 0%{ transform: translateY(0) scale(.8); opacity:.0 } 15%{ opacity:1 } 100%{ transform: translateY(-160px) scale(1.2); opacity:0 } }
            `}</style>
        </div>
    );
}