"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import ScrollEffects from "../src/components/ScrollEffects";

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

    const [showSticky, setShowSticky] = useState(false);
    // Sticky bar + breathing scroll
    useEffect(() => {
        const scroller = document.getElementById("app-scroll");
        if (!scroller) return;
        document.body.classList.add("breathing");
        const onScroll = () => {
            setShowSticky(scroller.scrollTop > 120);
            const y = scroller.scrollTop || 0;
            const wave = Math.sin(y / 140);
            const scale = 1 + 0.06 * wave; // заметнее (до ~6%)
            const ty = (8 * wave).toFixed(2) + "px"; // вертикальный сдвиг
            document.documentElement.style.setProperty("--breath-scale", scale.toFixed(3));
            document.documentElement.style.setProperty("--breath-ty", ty);
        };
        scroller.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        return () => {
            scroller.removeEventListener("scroll", onScroll as any);
            document.body.classList.remove("breathing");
        };
    }, []);

    // Time-of-day palette
    useEffect(() => {
        const updatePhase = () => {
            const h = new Date().getHours();
            const phase = h >= 5 && h < 11 ? "morning" : h >= 11 && h < 17 ? "day" : h >= 17 && h < 22 ? "evening" : "night";
            document.body.setAttribute("data-phase", phase);
        };
        updatePhase();
        const id = setInterval(updatePhase, 60 * 1000);
        return () => clearInterval(id);
    }, []);

    // Audio hover chime (no assets, WebAudio)
    const audioCtxRef = useRef<AudioContext | null>(null);
    const playChime = (variant: number = 0) => {
        if (typeof window === "undefined") return;
        // @ts-ignore - webkit fallback
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        if (!audioCtxRef.current) {
            try { audioCtxRef.current = new Ctx(); } catch { return; }
        }
        const ctx = audioCtxRef.current!;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const base = [528, 396, 639, 741][variant % 4] || 528; // мягкие частоты
        osc.type = "sine";
        osc.frequency.value = base;
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.07, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.4);
    };

    // Mini dashboard state
    const [streak, setStreak] = useState(3);
    const [dayProgress, setDayProgress] = useState(0.35);
    useEffect(() => {
        const id = setInterval(() => {
            setDayProgress((p) => {
                const np = p + 0.01;
                return np > 1 ? 1 : np;
            });
        }, 4000);
        return () => clearInterval(id);
    }, []);

    return (
        <div className="w-full relative">
            <ScrollEffects />
            {showSticky && (
                <div className="fixed top-[76px] left-1/2 -translate-x-1/2 z-40">
                    <div className="glass rounded-full px-3 py-2 shadow flex items-center gap-2 text-xs md:text-sm">
                        <span className="inline-flex items-center gap-1 text-gray-800"><span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" /> Ближайший эфир через {mm}:{ss}</span>
                        <a href="#offerings" className="rounded-full bg-teal-600 text-white px-3 py-1 hover:bg-teal-500 transition-colors">Напомнить</a>
                    </div>
                </div>
            )}
            {/* Hero */}
            <section id="hero" className="relative h-screen snap-start flex items-center justify-center overflow-visible">
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-white/70 via-sky-100/70 to-emerald-100/60" data-theme-bg />
                <div className="pointer-events-none absolute inset-0 z-10 aurora" aria-hidden />
                <div className="relative z-20 w-full px-6 reveal">
                    <div className="mx-auto max-w-7xl">
                        <h1 className="w-full text-left whitespace-nowrap leading-[0.9] font-thin tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-slate-900 to-slate-700 text-[14vw] sm:text-[12vw] md:text-[10rem] lg:text-[12rem] xl:text-[14rem] 2xl:text-[14.5rem]" style={{ fontFamily: 'var(--font-brand), var(--font-ui)' }}>
                            <span className="brand-accent">GARM
                            <img src="/logo-sunset.svg" alt="О" className="inline-block align-baseline mx-[0.06em]" style={{ width: '0.7em', height: '0.7em' }} />
                            NIA</span>
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
                                <a href="#about" className="rounded-full bg-white/80 px-5 md:px-6 py-3 text-sm md:text-base text-gray-800 shadow hover:bg-white transition-colors">Узнать больше</a>
                            </div>
                            <div className="mt-4 h-[3px] w-[min(70vw,520px)] md:w-[460px] neon-line" />
                        </div>
                        {/* Right: live preview card */}
                        <div className="block mt-6 md:mt-0">
                            <div className="relative mx-auto max-w-lg w-full aspect-[4/3] rounded-3xl overflow-hidden ring-1 ring-black/5 bg-white/50 backdrop-blur-xl shadow-lg live-card max-[450px]:aspect-[16/9]">
                                {/* mock background */}
                                <Image src="/live-mock-upload.png" alt="Live" fill className="object-cover z-0 opacity-20" />
                                {/* overlays */}
                                <div className="absolute left-4 top-4 z-20 px-2 py-1 rounded-full text-[10px] md:text-xs font-medium bg-rose-600 text-white shadow max-[450px]:px-1.5 max-[450px]:py-[2px]">LIVE</div>
                                <div className="absolute right-4 top-4 z-20 text-[10px] md:text-xs text-gray-800/90 bg-white/70 backdrop-blur px-2 py-1 rounded-md shadow max-[450px]:px-1.5 max-[450px]:py-[2px]">до начала {mm}:{ss}</div>
                                <div className="absolute left-4 top-4 translate-y-[28px] z-20 flex items-center gap-2 text-[10px] md:text-xs text-gray-800/90 bg-white/70 backdrop-blur px-2 py-1 rounded-md shadow max-[450px]:gap-1.5 max-[450px]:px-1.5 max-[450px]:py-[2px]">
                                    <span className="inline-block h-2 w-2 rounded-full bg-green-500" /> {viewers.toLocaleString()} зрителей
                                </div>
                                <div className="absolute left-0 right-0 top-[38px] z-20 h-[3px] bg-gradient-to-r from-emerald-400 via-sky-400 to-emerald-400/30 max-[450px]:h-[2px]">
                                    <div className="h-full bg-teal-600" style={{ width: `${Math.max(0, Math.min(100, progress*100))}%` }} />
                                </div>
                                {/* floating chat */}
                                <div className="absolute right-2 bottom-16 flex flex-col items-end gap-2 z-20 max-[450px]:bottom-12">
                                    {chat.map((msg, i) => (
                                        <div key={i} className="chat-bubble glass px-2 py-1.5 rounded-2xl shadow text-[11px] max-w-[70%] max-[450px]:text-[10px] max-[450px]:px-1.5 max-[450px]:py-1">{msg}</div>
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
                {/* wave to next (color matches next section top) */}
                <div className="pointer-events-none absolute bottom-[-1px] left-0 right-0 z-10 text-teal-100/60">
                  <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="block w-full h-[70px] md:h-[100px]">
                    <path fill="currentColor" d="M0,0 C180,60 360,0 540,40 C720,80 900,0 1080,50 C1260,100 1440,40 1440,40 L1440,120 L0,120 Z" />
                  </svg>
                </div>
            </section>

            {/* Quick Diagnostic (legacy) - merged into about */}
            {false && (
            <section id="discover" className="relative min-h-screen snap-start overflow-hidden flex items-center py-16">
                <Image src="/bg-section-calm.svg" alt="" fill className="object-cover opacity-60 pointer-events-none select-none z-0" />
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-sky-100/70 via-white/70 to-emerald-100/70" data-theme-bg />
                <div className="pointer-events-none absolute top-[-1px] left-0 right-0 z-10 text-sky-100/60 rotate-180">
                  <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="block w-full h-[70px] md:h-[100px]">
                    <path fill="currentColor" d="M0,0 C180,60 360,0 540,40 C720,80 900,0 1080,50 C1260,100 1440,40 1440,40 L1440,120 L0,120 Z" />
                  </svg>
                </div>
                <div className="relative z-20 mx-auto max-w-6xl px-6 grid md:grid-cols-2 gap-10 items-center">
                    <div className="reveal rounded-3xl bg-white/60 backdrop-blur-xl ring-1 ring-black/5 p-6 md:p-8">
                        <h2 className="text-3xl md:text-5xl font-semibold text-gray-800">60 секунд к личному маршруту</h2>
                        <p className="mt-4 text-gray-600 text-base md:text-lg" style={{ ["--d" as any]: 1 }}>
                            Короткая диагностика подскажет, с чего начать — дыхание, сон, тревога, энергия. Без регистрации, бережно, с рекомендациями на ваш темп.
                        </p>
                        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                            {[
                              { label: "Тревога", color: "bg-teal-50 text-teal-700" },
                              { label: "Сон", color: "bg-sky-50 text-sky-700" },
                              { label: "Энергия", color: "bg-emerald-50 text-emerald-700" },
                              { label: "Отношения", color: "bg-amber-50 text-amber-700" },
                            ].map((chip, i) => (
                              <div key={i} className={`px-3 py-2 rounded-full text-center ${chip.color}`} style={{ ["--d" as any]: i+2 }}>{chip.label}</div>
                            ))}
                        </div>
                        <a href="#routes" className="mt-8 inline-flex rounded-full bg-teal-600 text-white px-6 py-3 text-sm md:text-base shadow hover:bg-teal-500 transition-colors">Пройти диагностику</a>
                    </div>
                    <div className="reveal order-first md:order-none">
                        <div data-parallax data-parallax-speed="0.06" className="relative mx-auto w-full max-w-md aspect-[4/3] rounded-3xl bg-white/70 backdrop-blur-md shadow-lg overflow-hidden float-soft">
                            <Image src="/live-mock-upload.png" alt="Mock" fill className="object-cover opacity-30" />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="rounded-2xl bg-white/80 px-4 py-3 text-gray-800 text-center shadow">
                                <p className="text-sm">3 вопроса</p>
                                <div className="mt-2 h-2 w-48 rounded-full bg-gray-200 overflow-hidden"><div className="h-full w-1/3 bg-teal-500" /></div>
                              </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="pointer-events-none absolute bottom-[-1px] left-0 right-0 z-10 text-teal-100/60">
                  <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="block w-full h-[70px] md:h-[100px]">
                    <path fill="currentColor" d="M0,0 C180,60 360,0 540,40 C720,80 900,0 1080,50 C1260,100 1440,40 1440,40 L1440,120 L0,120 Z" />
                  </svg>
                </div>
            </section>
            )}

            {/* Benefits */}
            <section id="benefits" className="relative h-screen snap-start overflow-hidden flex items-center">
                <Image src="/bg-section-calm.svg" alt="" fill className="object-cover opacity-70 pointer-events-none select-none z-0" />
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-teal-100/60 via-sky-100/60 to-emerald-100/60" data-theme-bg />
                {/* top wave from previous (same color as this section top) */}
                <div className="pointer-events-none absolute top-[-1px] left-0 right-0 z-10 text-teal-100/60 rotate-180">
                  <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="block w-full h-[70px] md:h-[100px]">
                    <path fill="currentColor" d="M0,0 C180,60 360,0 540,40 C720,80 900,0 1080,50 C1260,100 1440,40 1440,40 L1440,120 L0,120 Z" />
                  </svg>
                </div>
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
                        <div className="mt-6 grid grid-cols-2 gap-3 text-sm text-gray-700">
                            <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-teal-500" /> Индивидуальные рекомендации</div>
                            <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-sky-500" /> Напоминания о лайвах</div>
                            <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Доступ с любого устройства</div>
                            <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-teal-500" /> Поддержка 24/7</div>
                        </div>
                    </div>
                    <div className="relative reveal">
                        <div data-parallax data-parallax-speed="-0.08" className="relative mx-auto w-full max-w-md aspect-square rounded-3xl bg-white/60 backdrop-blur-md shadow-lg overflow-hidden float-soft">
                            <Image src="/photo1.png" alt="Пользователь на практике" fill className="object-cover" />
                        </div>
                    </div>
                </div>
                {/* wave to next (pricing top ~ white/70) */}
                <div className="pointer-events-none absolute bottom-[-1px] left-0 right-0 z-10 text-white/70">
                  <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="block w-full h-[70px] md:h-[100px]">
                    <path fill="currentColor" d="M0,0 C180,60 360,0 540,40 C720,80 900,0 1080,50 C1260,100 1440,40 1440,40 L1440,120 L0,120 Z" />
                  </svg>
                </div>
            </section>

            {/* About (merged with Discover) */}
            <section id="about" className="relative min-h-screen snap-start overflow-hidden flex items-center py-16">
                <Image src="/bg-hero-waves.svg" alt="" fill className="object-cover opacity-60 pointer-events-none select-none z-0" />
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-white/70 via-sky-100/70 to-emerald-100/70" data-theme-bg />
                <div className="pointer-events-none absolute top-[-1px] left-0 right-0 z-10 text-white/70 rotate-180">
                  <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="block w-full h-[70px] md:h-[100px]">
                    <path fill="currentColor" d="M0,0 C180,60 360,0 540,40 C720,80 900,0 1080,50 C1260,100 1440,40 1440,40 L1440,120 L0,120 Z" />
                  </svg>
                </div>
                <div className="relative z-20 mx-auto max-w-6xl px-6 flex flex-col gap-10">
                    {/* About block */}
                    <div className="grid md:grid-cols-2 gap-10 items-center">
                        <div className="order-2 md:order-1 reveal rounded-3xl bg-white/50 backdrop-blur-xl ring-1 ring-black/5 p-6 md:p-8">
                            <h2 className="text-3xl md:text-5xl font-semibold text-gray-800">О GARmonia</h2>
                            <p className="mt-4 text-gray-600 text-base md:text-lg">Мы соединяем научный подход и человеческое тепло. Эфиры, курсы, библиотека и сообщество — всё, чтобы мягко возвращать себя к балансу.</p>
                            <div className="mt-6 grid grid-cols-2 gap-3 text-sm text-gray-700">
                              <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-sky-500" /> Научная база</div>
                              <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Бережная модерация</div>
                              <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-amber-500" /> Прозрачность</div>
                              <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-teal-500" /> Приватность</div>
                            </div>
                        </div>
                        <div className="order-1 md:order-2 reveal">
                            <div data-parallax data-parallax-speed="-0.06" className="relative mx-auto w-full max-w-md aspect-square rounded-3xl bg-white/70 backdrop-blur-md shadow-lg overflow-hidden float-soft">
                                <Image src="/photo1.png" alt="О платформе" fill className="object-cover" />
                            </div>
                        </div>
                    </div>
                    {/* Discover block (merged) */}
                    <div className="grid md:grid-cols-2 gap-10 items-center">
                        <div className="reveal rounded-3xl bg-white/60 backdrop-blur-xl ring-1 ring-black/5 p-6 md:p-8">
                            <h2 className="text-3xl md:text-5xl font-semibold text-gray-800">60 секунд к личному маршруту</h2>
                            <p className="mt-4 text-gray-600 text-base md:text-lg" style={{ ["--d" as any]: 1 }}>
                                Короткая диагностика подскажет, с чего начать — дыхание, сон, тревога, энергия. Без регистрации, бережно, с рекомендациями на ваш темп.
                            </p>
                            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                {[
                                  { label: "Тревога", color: "bg-teal-50 text-teal-700" },
                                  { label: "Сон", color: "bg-sky-50 text-sky-700" },
                                  { label: "Энергия", color: "bg-emerald-50 text-emerald-700" },
                                  { label: "Отношения", color: "bg-amber-50 text-amber-700" },
                                ].map((chip, i) => (
                                  <div key={i} className={`px-3 py-2 rounded-full text-center ${chip.color}`} style={{ ["--d" as any]: i+2 }}>{chip.label}</div>
                                ))}
                            </div>
                            <a href="#offerings" className="mt-8 inline-flex rounded-full bg-teal-600 text-white px-6 py-3 text-sm md:text-base shadow hover:bg-teal-500 transition-colors">Пройти диагностику</a>
                        </div>
                        <div className="reveal order-first md:order-none">
                            <div data-parallax data-parallax-speed="0.06" className="relative mx-auto w-full max-w-md aspect-[4/3] rounded-3xl bg-white/70 backdrop-blur-md shadow-lg overflow-hidden float-soft">
                                <Image src="/live-mock-upload.png" alt="Mock" fill className="object-cover opacity-30" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="rounded-2xl bg-white/80 px-4 py-3 text-gray-800 text-center shadow">
                                    <p className="text-sm">3 вопроса</p>
                                    <div className="mt-2 h-2 w-48 rounded-full bg-gray-200 overflow-hidden"><div className="h-full w-1/3 bg-teal-500" /></div>
                                  </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="pointer-events-none absolute bottom-[-1px] left-0 right-0 z-10 text-emerald-100/70">
                  <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="block w-full h-[70px] md:h-[100px]">
                    <path fill="currentColor" d="M0,0 C180,60 360,0 540,40 C720,80 900,0 1080,50 C1260,100 1440,40 1440,40 L1440,120 L0,120 Z" />
                  </svg>
                </div>
            </section>

            {/* Offerings (Форматы + Маршруты + Эфиры) */}
            <section id="offerings" className="relative min-h-screen snap-start overflow-hidden flex items-center py-16">
                <Image src="/bg-hero-waves.svg" alt="" fill className="object-cover opacity-60 pointer-events-none select-none z-0" />
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-white/70 via-sky-100/70 to-emerald-100/70" data-theme-bg />
                {/* top wave from previous (emerald-100/70) */}
                <div className="pointer-events-none absolute top-[-1px] left-0 right-0 z-10 text-emerald-100/70 rotate-180">
                  <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="block w-full h-[70px] md:h-[100px]">
                    <path fill="currentColor" d="M0,0 C180,60 360,0 540,40 C720,80 900,0 1080,50 C1260,100 1440,40 1440,40 L1440,120 L0,120 Z" />
                  </svg>
                </div>
                <div className="relative z-20 mx-auto max-w-6xl px-6 flex flex-col gap-10">
                    {/* Formats */}
                    <div className="reveal rounded-3xl bg-white/50 backdrop-blur-xl ring-1 ring-black/5 p-6 md:p-8">
                        <h2 className="text-3xl md:text-5xl font-semibold text-gray-800">Форматы</h2>
                        <p className="mt-4 text-gray-600 text-base md:text-lg">Эфиры, курсы, короткие практики и индивидуальные сессии — выбирайте свой ритм.</p>
                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          {[
                            { title: "Прямые эфиры", desc: "Живое присутствие и поддержка.", color: "from-rose-50 to-white" },
                            { title: "Курсы", desc: "Глубокие темы по шагам.", color: "from-sky-50 to-white" },
                            { title: "Практики 5–10 мин", desc: "Когда важна мягкая регулярность.", color: "from-emerald-50 to-white" },
                            { title: "Инд. сессии", desc: "Лично и конфиденциально.", color: "from-amber-50 to-white" },
                          ].map((c, i) => (
                            <div key={i} onMouseEnter={() => playChime(i)} className={`rounded-2xl p-5 ring-1 ring-black/5 bg-gradient-to-br ${c.color} hover:shadow-md transition-shadow`}>
                              <p className="font-medium text-gray-800">{c.title}</p>
                              <p className="text-sm text-gray-600 mt-1">{c.desc}</p>
                            </div>
                          ))}
                        </div>
                    </div>
                    {/* Routes */}
                    <div className="reveal rounded-3xl bg-white/50 backdrop-blur-xl ring-1 ring-black/5 p-6 md:p-8">
                        <h3 className="text-2xl md:text-4xl font-semibold text-gray-800">Маршруты к балансу</h3>
                        <p className="mt-4 text-gray-600 text-base md:text-lg">Готовые подборки под ваши задачи: «Спокойный сон», «Антитревога», «Лёгкое утро».</p>
                        <div className="mt-6 grid md:grid-cols-3 gap-4">
                          {[
                            { title: "Спокойный сон за 7 дней", chip: "вечер" },
                            { title: "Антитревога", chip: "день" },
                            { title: "Лёгкое утро", chip: "утро" },
                          ].map((r, i) => (
                            <div key={i} onMouseEnter={() => playChime(i+1)} className="rounded-2xl p-5 bg-white/70 ring-1 ring-black/5 hover:shadow-md transition-shadow">
                              <div className="flex items-center justify-between">
                                <p className="font-medium text-gray-800">{r.title}</p>
                                <span className="px-2 py-0.5 text-[10px] rounded-full bg-amber-100 text-amber-700">{r.chip}</span>
                              </div>
                              <div className="mt-3 h-2 rounded-full bg-gray-200 overflow-hidden"><div className="h-full w-1/5 bg-teal-500" /></div>
                              <div className="mt-4 flex items-center gap-2">
                                <a href="#" className="rounded-full bg-teal-600 text-white px-3 py-1 text-sm hover:bg-teal-500 transition-colors">Начать маршрут</a>
                                <a href="#" className="rounded-full bg-white/80 px-3 py-1 text-sm text-gray-800 shadow hover:bg-white transition-colors">Добавить в план</a>
                              </div>
                            </div>
                          ))}
                        </div>
                    </div>
                    {/* Mini Dashboard: Ваш ритм */}
                    <div className="reveal rounded-3xl bg-white/60 backdrop-blur-xl ring-1 ring-black/5 p-6 md:p-8">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="text-2xl md:text-4xl font-semibold text-gray-800">Ваш ритм</h3>
                          <span className="px-3 py-1 rounded-full text-xs md:text-sm bg-sky-100 text-sky-700">серия {streak} дн.</span>
                        </div>
                        <p className="mt-3 text-gray-600 text-base md:text-lg">Мягкий прогресс без спешки. Сегодня вы на {Math.round(dayProgress*100)}% ближе к балансу.</p>
                        <div className="mt-5 h-3 w-full rounded-full bg-gray-200 overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-teal-500 to-sky-500" style={{ width: `${Math.max(0, Math.min(100, dayProgress*100))}%` }} />
                        </div>
                        <div className="mt-4 text-sm text-gray-700 flex items-center gap-3 flex-wrap">
                          <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700">Совет дня: 2 цикла дыхания 4–7–8</span>
                          <a href="#" className="rounded-full bg-teал-600 text-white px-3 py-1.5 text-sm hover:bg-teal-500 transition-colors">Добавить напоминание</a>
                          <a href="#" className="rounded-full bg-white/80 px-3 py-1.5 text-sm text-gray-800 shadow hover:bg-white transition-colors">Открыть дашборд</a>
                        </div>
                    </div>
                    {/* Schedule */}
                    <div className="reveal rounded-3xl bg-white/50 backdrop-blur-xl ring-1 ring-black/5 p-6 md:p-8">
                        <h3 className="text-2xl md:text-4xl font-semibold text-gray-800">Ближайшие эфиры</h3>
                        <p className="mt-4 text-gray-600 text-base md:text-lg">Присоединяйтесь в один клик — поставьте напоминание и успейте на начало.</p>
                        <div className="mt-6 grid md:grid-cols-3 gap-4">
                          {[
                            { title: "Дыхательная практика", expert: "д-р Муратова", when: "сегодня 19:00" },
                            { title: "Антитревога", expert: "психолог Исаева", when: "завтра 08:30" },
                            { title: "Сон и восстановление", expert: "сомнолог Петров", when: "пт 21:00" },
                          ].map((s, i) => (
                            <div key={i} className="rounded-2xl p-5 bg-white/70 ring-1 ring-black/5 hover:shadow-md transition-shadow">
                              <div className="flex items-center justify-between">
                                <p className="font-medium text-gray-800">{s.title}</p>
                                <span className="px-2 py-0.5 text-[10px] rounded-full bg-rose-100 text-rose-700">LIVE</span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{s.expert}</p>
                              <p className="text-sm text-gray-700 mt-3">{s.when}</p>
                              <div className="mt-4 flex items-center gap-2">
                                <a href="#" className="rounded-full bg-teal-600 text-white px-3 py-1 text-sm hover:bg-teal-500 transition-colors">Напомнить</a>
                                <a href="#" className="rounded-full bg-white/80 px-3 py-1 text-sm text-gray-800 shadow hover:bg-white transition-colors">В расписание</a>
                              </div>
                            </div>
                          ))}
                        </div>
                    </div>
                </div>
                {/* wave to next (trust top emerald-100/70) */}
                <div className="pointer-events-none absolute bottom-[-1px] left-0 right-0 z-10 text-emerald-100/70">
                  <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="block w-full h-[70px] md:h-[100px]">
                    <path fill="currentColor" d="M0,0 C180,60 360,0 540,40 C720,80 900,0 1080,50 C1260,100 1440,40 1440,40 L1440,120 L0,120 Z" />
                  </svg>
                </div>
            </section>

            {/* Trust (Эксперты + Сообщество + Этика) */}
            <section id="trust" className="relative min-h-screen snap-start overflow-hidden flex items-center py-16">
                <Image src="/bg-section-calm.svg" alt="" fill className="object-cover opacity-60 pointer-events-none select-none z-0" />
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-emerald-100/70 via-white/70 to-sky-100/70" data-theme-bg />
                {/* top wave from previous (emerald-100/70) */}
                <div className="pointer-events-none absolute top-[-1px] left-0 right-0 z-10 text-emerald-100/70 rotate-180">
                  <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="block w-full h-[70px] md:h-[100px]">
                    <path fill="currentColor" d="M0,0 C180,60 360,0 540,40 C720,80 900,0 1080,50 C1260,100 1440,40 1440,40 L1440,120 L0,120 Z" />
                  </svg>
                </div>
                <div className="relative z-20 mx-auto max-w-6xl px-6 flex flex-col gap-10">
                    {/* Experts */}
                    <div className="reveal rounded-3xl bg-white/50 backdrop-blur-xl ring-1 ring-black/5 p-6 md:p-8">
                        <h2 className="text-3xl md:text-5xl font-semibold text-gray-800">Эксперты</h2>
                        <p className="mt-4 text-gray-600 text-base md:text-lg">Сертифицированные специалисты с человеческим голосом.</p>
                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {[1,2,3,4,5,6].map((i) => (
                            <div key={i} className="rounded-2xl p-5 bg-white/70 ring-1 ring-black/5 hover:shadow-md transition-shadow">
                              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-teal-300 to-sky-300" />
                              <p className="mt-3 font-medium text-gray-800">Эксперт {i}</p>
                              <p className="text-sm text-gray-600">Психолог, стаж 7+ лет</p>
                              <div className="mt-3 flex items-center gap-1 text-amber-500">{"★★★★★"}</div>
                              <div className="mt-3 flex items-center gap-2">
                                <a href="#" className="rounded-full bg-white/80 px-3 py-1 text-sm text-gray-800 shadow hover:bg-white transition-colors">Профиль</a>
                                <a href="#" className="rounded-full bg-teal-600 text-white px-3 py-1 text-sm hover:bg-teal-500 transition-colors">Записаться</a>
                              </div>
                            </div>
                          ))}
                        </div>
                    </div>
                    {/* Community */}
                    <div className="reveal rounded-3xl bg-white/50 backdrop-blur-xl ring-1 ring-black/5 p-6 md:p-8">
                        <h3 className="text-2xl md:text-4xl font-semibold text-gray-800">Сообщество и отзывы</h3>
                        <p className="mt-4 text-gray-600 text-base md:text-lg">Мы разные, но в одной волне. Реальные истории — как ночи стали тише, а утро — светлее.</p>
                        <div className="mt-6 grid gap-3 text-sm text-gray-700 md:grid-cols-3">
                          <div className="rounded-2xl p-4 bg-white/70 ring-1 ring-black/5">«Сон стал глубже уже на 3-й день». — Марина</div>
                          <div className="rounded-2xl p-4 bg-white/70 ring-1 ring-black/5">«Перестал застревать в тревоге, стало легче дышать». — Олег</div>
                          <div className="rounded-2xl p-4 bg-white/70 ring-1 ring-black/5">«Полюбила утренние 7 минут — это мой свет». — Алина</div>
                        </div>
                        <div className="mt-6 flex items-center gap-3">
                          <a href="http://localhost:3001/register" className="rounded-full bg-teal-600 text-white px-6 py-3 text-sm md:text-base shadow hover:bg-teal-500 transition-colors">Присоединиться</a>
                          <a href="#" className="rounded-full bg-white/80 px-6 py-3 text-sm md:text-base text-gray-800 shadow hover:bg-white transition-colors">Оставить отзыв</a>
                        </div>
                    </div>
                    {/* Safety */}
                    <div className="reveal rounded-3xl bg-white/50 backdrop-blur-xl ring-1 ring-black/5 p-6 md:p-8">
                        <h3 className="text-2xl md:text-4xl font-semibold text-gray-800">Безопасность и этика</h3>
                        <p className="mt-4 text-gray-600 text-base md:text-lg">Проверка квалификаций, модерация, правила сообщества. Конфиденциальность и прозрачность — по умолчанию.</p>
                        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                          {[
                            { t: "Сертификация" },
                            { t: "Модерация" },
                            { t: "Приватность" },
                            { t: "Жалоба 1 клик" },
                          ].map((x, i) => (
                            <div key={i} className="rounded-2xl p-4 bg-white/70 ring-1 ring-black/5 text-sm text-gray-700">{x.t}</div>
                          ))}
                        </div>
                    </div>
                </div>
                {/* wave to next (join top emerald-100/70) */}
                <div className="pointer-events-none absolute bottom-[-1px] left-0 right-0 z-10 text-emerald-100/70">
                  <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="block w-full h-[70px] md:h-[100px]">
                    <path fill="currentColor" d="M0,0 C180,60 360,0 540,40 C720,80 900,0 1080,50 C1260,100 1440,40 1440,40 L1440,120 L0,120 Z" />
                  </svg>
                </div>
            </section>

            {/* Join (Подписка + FAQ + финальный CTA) */}
            <section id="join" className="relative min-h-screen snap-start overflow-hidden flex items-center justify-center py-16">
                <Image src="/bg-section-calm.svg" alt="" fill className="object-cover opacity-60 pointer-events-none select-none z-0" />
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-emerald-100/70 via-sky-100/70 to-emerald-50/70" data-theme-bg />
                {/* top wave from previous (emerald-100/70) */}
                <div className="pointer-events-none absolute top-[-1px] left-0 right-0 z-10 text-emerald-100/70 rotate-180">
                  <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="block w-full h-[70px] md:h-[100px]">
                    <path fill="currentColor" d="M0,0 C180,60 360,0 540,40 C720,80 900,0 1080,50 C1260,100 1440,40 1440,40 L1440,120 L0,120 Z" />
                  </svg>
                </div>
                <div className="relative z-20 mx-auto max-w-6xl px-6 flex flex-col gap-10">
                    {/* Pricing */}
                    <div className="reveal rounded-3xl bg-white/50 backdrop-blur-xl ring-1 ring-black/5 p-6 md:p-8 grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <div className="flex items-center gap-3 flex-wrap">
                              <h2 className="text-3xl md:text-5xl font-semibold text-gray-800">Подписка без лишнего</h2>
                              <span className="px-3 py-1 rounded-full text-xs md:text-sm bg-emerald-100 text-emerald-700">Первый эфир — бесплатно</span>
                            </div>
                            <p className="mt-4 text-gray-600 text-base md:text-lg">Один план — полный доступ к прямым эфирам и библиотеке. Отмена в 1 клик.</p>
                            <div className="mt-6 grid gap-3 text-gray-700">
                                <div className="flex items-center gap-3"><span className="h-6 w-6 rounded-full bg-teal-100 text-teal-600 inline-flex items-center justify-center">✓</span> Прямые эфиры с экспертами</div>
                                <div className="flex items-center gap-3"><span className="h-6 w-6 rounded-full bg-sky-100 text-sky-600 inline-flex items-center justify-center">✓</span> Библиотека записей</div>
                                <div className="flex items-center gap-3"><span className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-600 inline-flex items-center justify-center">✓</span> Личные рекомендации</div>
                                <div className="flex items-center gap-3"><span className="h-6 w-6 rounded-full bg-teal-100 text-teal-600 inline-flex items-center justify-center">✓</span> Доступ к закрытому сообществу</div>
                            </div>
                            <div className="mt-8 flex items-center gap-3">
                              <a href="http://localhost:3001/register" className="inline-flex rounded-full bg-teal-600 text-white px-6 py-3 text-sm md:text-base shadow hover:bg-teal-500 transition-colors">Оформить подписку</a>
                              <a href="#offerings" className="inline-flex rounded-full bg-white/80 px-6 py-3 text-sm md:text-base text-gray-800 shadow hover:bg-white transition-colors">Смотреть ближайший эфир</a>
                            </div>
                            <p className="mt-3 text-xs text-gray-500">7 дней возврат, если не зайдёт. Без карты на первый эфир.</p>
                        </div>
                        <div>
                            <div data-parallax data-parallax-speed="0.06" className="relative mx-auto w-full max-w-md aspect-[4/3] rounded-3xl bg-white/70 backdrop-blur-md shadow-lg overflow-hidden float-soft">
                                <Image src="/photo2.png" alt="Команда экспертов" fill className="object-cover" />
                            </div>
                        </div>
                    </div>
                    {/* FAQ */}
                    <div className="reveal rounded-3xl bg-white/50 backdrop-blur-xl ring-1 ring-black/5 p-6 md:p-8">
                        <h3 className="text-2xl md:text-4xl font-semibold text-gray-800">FAQ</h3>
                        <div className="mt-6 grid md:grid-cols-2 gap-4 text-gray-700 text-sm">
                          {[
                            { q: "Как проходят эфиры?", a: "В лайв-формате с чатом, записи сохраняются." },
                            { q: "Будут ли записи?", a: "Да, в библиотеке доступны в любое время." },
                            { q: "Нужно ли оборудование?", a: "Нет, достаточно телефона или ноутбука." },
                            { q: "Как отменить подписку?", a: "В 1 клик в профиле, без вопросов." },
                            { q: "Есть ли бесплатный доступ?", a: "Первый эфир бесплатен, без карты." },
                            { q: "Какой уровень подготовки нужен?", a: "Подходит для любого уровня, темп — ваш." },
                          ].map((f, i) => (
                            <details key={i} className="rounded-xl bg-white/70 ring-1 ring-black/5 p-4">
                              <summary className="cursor-pointer font-medium text-gray-800">{f.q}</summary>
                              <p className="mt-2 text-gray-600">{f.a}</p>
                            </details>
                          ))}
                        </div>
                    </div>
                    {/* Final CTA + Footer */}
                    <div className="relative z-20 text-center px-6 max-w-2xl mx-auto reveal rounded-3xl bg-white/50 backdrop-blur-xl ring-1 ring-black/5 py-8">
                        <h2 className="text-3xl md:text-5xl font-semibold text-gray-800">Будьте в балансе каждый день</h2>
                        <p className="mt-4 text-gray-600 text-base md:text-lg">Присоединяйтесь к сообществу, где ценят осознанность, движение и поддержку.</p>
                        <div className="mt-8 flex items-center justify-center gap-4">
                            <a href="http://localhost:3001/register" className="rounded-full bg-teal-600 text-white px-6 py-3 text-sm md:text-base shadow hover:bg-teal-500 transition-colors">Присоединиться</a>
                            <a href="http://localhost:3001/login" className="rounded-full bg-white/80 px-6 py-3 text-sm md:text-base text-gray-800 shadow hover:bg-white transition-colors">У меня есть аккаунт</a>
                        </div>
                        <p className="mt-3 text-xs text-gray-500">Первый эфир — бесплатно. Без карты.</p>
                    </div>
                    <footer className="relative z-20 border-t border-gray-200/70 bg-white/70 backdrop-blur text-gray-700 text-sm rounded-2xl">
                      <div className="mx-auto max-w-6xl px-6 py-4 md:py-6 flex flex-col items-center gap-3 text-center">
                        <div className="flex items-center gap-3 whitespace-nowrap">
                          <img src="/logo-sunset.svg" alt="GARmonia" className="h-5 w-5" />
                          <span className="font-medium">GARmonia</span>
                          <span>© {new Date().getFullYear()} GARmonia. Все права защищены.</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <a href="#about" className="hover:text-gray-900 transition-colors">О нас</a>
                          <a href="#offerings" className="hover:text-gray-900 transition-colors">Возможности</a>
                          <a href="#join" className="hover:text-gray-900 transition-colors">Присоединиться</a>
                        </div>
                      </div>
                    </footer>
                </div>
            </section>

            {/* Formats (legacy) - removed */}
            {false && (
            <section id="formats" className="relative h-screen snap-start overflow-hidden flex items-center">
                <Image src="/bg-section-calm.svg" alt="" fill className="object-cover opacity-60 pointer-events-none select-none z-0" />
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-emerald-100/70 via-white/70 to-sky-100/70" data-theme-bg />
                <div className="relative z-20 mx-auto max-w-6xl px-6">
                    <div className="reveal rounded-3xl bg-white/50 backdrop-blur-xl ring-1 ring-black/5 p-6 md:p-8">
                        <h2 className="text-3xl md:text-5xl font-semibold text-gray-800">Форматы</h2>
                        <p className="mt-4 text-gray-600 text-base md:text-lg">Эфиры, курсы, короткие практики и индивидуальные сессии — выбирайте свой ритм.</p>
                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          {[
                            { title: "Прямые эфиры", desc: "Живое присутствие и поддержка.", color: "from-rose-50 to-white" },
                            { title: "Курсы", desc: "Глубокие темы по шагам.", color: "from-sky-50 to-white" },
                            { title: "Практики 5–10 мин", desc: "Когда важна мягкая регулярность.", color: "from-emerald-50 to-white" },
                            { title: "Инд. сессии", desc: "Лично и конфиденциально.", color: "from-amber-50 to-white" },
                          ].map((c, i) => (
                            <div key={i} className={`rounded-2xl p-5 ring-1 ring-black/5 bg-gradient-to-br ${c.color} hover:shadow-md transition-shadow`} style={{ ["--d" as any]: i+1 }}>
                              <p className="font-medium text-gray-800">{c.title}</p>
                              <p className="text-sm text-gray-600 mt-1">{c.desc}</p>
                            </div>
                          ))}
                        </div>
                    </div>
                </div>
            </section>
            )}

            {/* Schedule (legacy) - removed */}
            {false && (
            <section id="schedule" className="relative h-screen snap-start overflow-hidden flex items-center">
                <Image src="/bg-hero-waves.svg" alt="" fill className="object-cover opacity-60 pointer-events-none select-none z-0" />
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-white/70 via-sky-100/70 to-emerald-100/70" data-theme-bg />
                <div className="relative z-20 mx-auto max-w-6xl px-6">
                    <div className="reveal rounded-3xl bg-white/50 backdrop-blur-xl ring-1 ring-black/5 p-6 md:p-8">
                        <h2 className="text-3xl md:text-5xl font-semibold text-gray-800">Ближайшие эфиры</h2>
                        <p className="mt-4 text-gray-600 text-base md:text-lg">Присоединяйтесь в один клик — поставьте напоминание и успейте на начало.</p>
                        <div className="mt-6 grid md:grid-cols-3 gap-4">
                          {[
                            { title: "Дыхательная практика", expert: "д-р Муратова", when: "сегодня 19:00" },
                            { title: "Антитревога", expert: "психолог Исаева", when: "завтра 08:30" },
                            { title: "Сон и восстановление", expert: "сомнолог Петров", when: "пт 21:00" },
                          ].map((s, i) => (
                            <div key={i} className="rounded-2xl p-5 bg-white/70 ring-1 ring-black/5 hover:shadow-md transition-shadow">
                              <div className="flex items-center justify-between">
                                <p className="font-medium text-gray-800">{s.title}</p>
                                <span className="px-2 py-0.5 text-[10px] rounded-full bg-rose-100 text-rose-700">LIVE</span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{s.expert}</p>
                              <p className="text-sm text-gray-700 mt-3">{s.when}</p>
                              <div className="mt-4 flex items-center gap-2">
                                <a href="#" className="rounded-full bg-teal-600 text-white px-3 py-1 text-sm hover:bg-teal-500 transition-colors">Напомнить</a>
                                <a href="#" className="rounded-full bg-white/80 px-3 py-1 text-sm text-gray-800 shadow hover:bg-white transition-colors">В расписание</a>
                              </div>
                            </div>
                          ))}
                        </div>
                    </div>
                </div>
            </section>
            )}

            {/* Experts (legacy) - removed */}
            {false && (
            <section id="experts" className="relative h-screen snap-start overflow-hidden flex items-center">
                <Image src="/bg-section-calm.svg" alt="" fill className="object-cover opacity-60 pointer-events-none select-none z-0" />
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-emerald-100/70 via-white/70 to-sky-100/70" data-theme-bg />
                <div className="relative z-20 mx-auto max-w-6xl px-6">
                    <div className="reveal rounded-3xl bg-white/50 backdrop-blur-xl ring-1 ring-black/5 p-6 md:p-8">
                        <h2 className="text-3xl md:text-5xl font-semibold text-gray-800">Эксперты</h2>
                        <p className="mt-4 text-gray-600 text-base md:text-lg">Сертифицированные специалисты с человеческим голосом.</p>
                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {[1,2,3,4,5,6].map((i) => (
                            <div key={i} className="rounded-2xl p-5 bg-white/70 ring-1 ring-black/5 hover:shadow-md transition-shadow">
                              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-teal-300 to-sky-300" />
                              <p className="mt-3 font-medium text-gray-800">Эксперт {i}</p>
                              <p className="text-sm text-gray-600">Психолог, стаж 7+ лет</p>
                              <div className="mt-3 flex items-center gap-1 text-amber-500">{"★★★★★"}</div>
                              <div className="mt-3 flex items-center gap-2">
                                <a href="#" className="rounded-full bg-white/80 px-3 py-1 text-sm text-gray-800 shadow hover:bg-white transition-colors">Профиль</a>
                                <a href="#" className="rounded-full bg-teal-600 text-white px-3 py-1 text-sm hover:bg-teal-500 transition-colors">Записаться</a>
                              </div>
                            </div>
                          ))}
                        </div>
                    </div>
                </div>
            </section>
            )}

            {/* Routes (legacy) - removed */}
            {false && (
            <section id="routes" className="relative h-screen snap-start overflow-hidden flex items-center">
                <Image src="/bg-hero-waves.svg" alt="" fill className="object-cover opacity-60 pointer-events-none select-none z-0" />
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-white/70 via-sky-100/70 to-emerald-100/70" data-theme-bg />
                <div className="relative z-20 mx-auto max-w-6xl px-6">
                    <div className="reveal rounded-3xl bg-white/50 backdrop-blur-xl ring-1 ring-black/5 p-6 md:p-8">
                        <h2 className="text-3xl md:text-5xl font-semibold text-gray-800">Маршруты к балансу</h2>
                        <p className="mt-4 text-gray-600 text-base md:text-lg">Готовые подборки под ваши задачи: «Спокойный сон», «Антитревога», «Лёгкое утро».</p>
                        <div className="mt-6 grid md:grid-cols-3 gap-4">
                          {[
                            { title: "Спокойный сон за 7 дней", chip: "вечер" },
                            { title: "Антитревога", chip: "день" },
                            { title: "Лёгкое утро", chip: "утро" },
                          ].map((r, i) => (
                            <div key={i} className="rounded-2xl p-5 bg-white/70 ring-1 ring-black/5 hover:shadow-md transition-shadow">
                              <div className="flex items-center justify-between">
                                <p className="font-medium text-gray-800">{r.title}</p>
                                <span className="px-2 py-0.5 text-[10px] rounded-full bg-amber-100 text-amber-700">{r.chip}</span>
                              </div>
                              <div className="mt-3 h-2 rounded-full bg-gray-200 overflow-hidden"><div className="h-full w-1/5 bg-teal-500" /></div>
                              <div className="mt-4 flex items-center gap-2">
                                <a href="#" className="rounded-full bg-teal-600 text-white px-3 py-1 text-sm hover:bg-teal-500 transition-colors">Начать маршрут</a>
                                <a href="#" className="rounded-full bg-white/80 px-3 py-1 text-sm text-gray-800 shadow hover:bg-white transition-colors">Добавить в план</a>
                              </div>
                            </div>
                          ))}
                        </div>
                    </div>
                </div>
            </section>
            )}

            {/* Community (legacy) - removed */}
            {false && (
            <section id="community" className="relative h-screen snap-start overflow-hidden flex items-center">
                <Image src="/bg-section-calm.svg" alt="" fill className="object-cover opacity-60 pointer-events-none select-none z-0" />
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-emerald-100/70 via-white/70 to-sky-100/70" data-theme-bg />
                <div className="relative z-20 mx-auto max-w-6xl px-6 grid md:grid-cols-2 gap-10 items-center">
                    <div className="reveal rounded-3xl bg-white/50 backdrop-blur-xl ring-1 ring-black/5 p-6 md:p-8">
                        <h2 className="text-3xl md:text-5xl font-semibold text-gray-800">Сообщество и отзывы</h2>
                        <p className="mt-4 text-gray-600 text-base md:text-lg">Мы разные, но в одной волне. Реальные истории — как ночи стали тише, а утро — светлее.</p>
                        <div className="mt-6 grid gap-3 text-sm text-gray-700">
                          <div className="rounded-2xl p-4 bg-white/70 ring-1 ring-black/5">«Сон стал глубже уже на 3-й день». — Марина</div>
                          <div className="rounded-2xl p-4 bg-white/70 ring-1 ring-black/5">«Перестал застревать в тревоге, стало легче дышать». — Олег</div>
                          <div className="rounded-2xl p-4 bg-white/70 ring-1 ring-black/5">«Полюбила утренние 7 минут — это мой свет». — Алина</div>
                        </div>
                        <div className="mt-6 flex items-center gap-3">
                          <a href="http://localhost:3001/register" className="rounded-full bg-teal-600 text-white px-6 py-3 text-sm md:text-base shadow hover:bg-teal-500 transition-colors">Присоединиться</a>
                          <a href="#" className="rounded-full bg-white/80 px-6 py-3 text-sm md:text-base text-gray-800 shadow hover:bg-white transition-colors">Оставить отзыв</a>
                        </div>
                    </div>
                    <div className="relative reveal">
                        <div data-parallax data-parallax-speed="0.08" className="relative mx-auto w-full max-w-md aspect-square rounded-3xl bg-white/60 backdrop-blur-md shadow-lg overflow-hidden float-soft" />
                    </div>
                </div>
            </section>
            )}

            {/* Subscription (legacy) - removed */}
            {false && (
            <section id="pricing" className="relative h-screen snap-start overflow-hidden flex items-center">
                <Image src="/bg-hero-waves.svg" alt="" fill className="object-cover opacity-60 pointer-events-none select-none z-0" />
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-white/70 via-sky-100/70 to-emerald-100/70" data-theme-bg />
                {/* top wave from previous (white/70) */}
                <div className="pointer-events-none absolute top-[-1px] left-0 right-0 z-10 text-white/70 rotate-180">
                  <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="block w-full h-[70px] md:h-[100px]">
                    <path fill="currentColor" d="M0,0 C180,60 360,0 540,40 C720,80 900,0 1080,50 C1260,100 1440,40 1440,40 L1440,120 L0,120 Z" />
                  </svg>
                </div>
                <div className="relative z-20 mx-auto max-w-6xl px-6 grid md:grid-cols-2 gap-10 items-center">
                    <div className="order-2 md:order-1 reveal rounded-3xl bg-white/50 backdrop-blur-xl ring-1 ring-black/5 p-6 md:p-8">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h2 className="text-3xl md:text-5xl font-semibold text-gray-800">Подписка без лишнего</h2>
                          <span className="px-3 py-1 rounded-full text-xs md:text-sm bg-emerald-100 text-emerald-700">Первый эфир — бесплатно</span>
                        </div>
                        <p className="mt-4 text-gray-600 text-base md:text-lg" style={{ ["--d" as any]: 1 }}>
                            Один план — полный доступ к прямым эфирам и библиотеке. Отмена в 1 клик.
                        </p>
                        <div className="mt-6 grid gap-3 text-gray-700">
                            <div className="flex items-center gap-3" style={{ ["--d" as any]: 2 }}><span className="h-6 w-6 rounded-full bg-teal-100 text-teal-600 inline-flex items-center justify-center">✓</span> Прямые эфиры с экспертами</div>
                            <div className="flex items-center gap-3" style={{ ["--d" as any]: 3 }}><span className="h-6 w-6 rounded-full bg-sky-100 text-sky-600 inline-flex items-center justify-center">✓</span> Библиотека записей</div>
                            <div className="flex items-center gap-3" style={{ ["--d" as any]: 4 }}><span className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-600 inline-flex items-center justify-center">✓</span> Личные рекомендации</div>
                            <div className="flex items-center gap-3" style={{ ["--d" as any]: 5 }}><span className="h-6 w-6 rounded-full bg-teal-100 text-teal-600 inline-flex items-center justify-center">✓</span> Доступ к закрытому сообществу</div>
                        </div>
                        <div className="mt-8 flex items-center gap-3">
                          <a href="http://localhost:3001/register" className="inline-flex rounded-full bg-teal-600 text-white px-6 py-3 text-sm md:text-base shadow hover:bg-teal-500 transition-colors">Оформить подписку</a>
                          <a href="#schedule" className="inline-flex rounded-full bg-white/80 px-6 py-3 text-sm md:text-base text-gray-800 shadow hover:bg-white transition-colors">Смотреть ближайший эфир</a>
                        </div>
                        <p className="mt-3 text-xs text-gray-500">7 дней возврат, если не зайдёт. Без карты на первый эфир.</p>
                    </div>
                    <div className="order-1 md:order-2 reveal">
                        <div data-parallax data-parallax-speed="0.06" className="relative mx-auto w-full max-w-md aspect-[4/3] rounded-3xl bg-white/70 backdrop-blur-md shadow-lg overflow-hidden float-soft">
                            <Image src="/photo2.png" alt="Команда экспертов" fill className="object-cover" />
                        </div>
                    </div>
                </div>
                {/* wave to next (cta top emerald-100/70) */}
                <div className="pointer-events-none absolute bottom-[-1px] left-0 right-0 z-10 text-emerald-100/70">
                  <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="block w-full h-[70px] md:h-[100px]">
                    <path fill="currentColor" d="M0,0 C180,60 360,0 540,40 C720,80 900,0 1080,50 C1260,100 1440,40 1440,40 L1440,120 L0,120 Z" />
                  </svg>
                </div>
            </section>
            )}

            {/* Safety & Ethics (legacy) - removed */}
            {false && (
            <section id="safety" className="relative h-screen snap-start overflow-hidden flex items-center">
                <Image src="/bg-section-calm.svg" alt="" fill className="object-cover opacity-60 pointer-events-none select-none z-0" />
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-emerald-100/70 via-white/70 to-sky-100/70" data-theme-bg />
                <div className="relative z-20 mx-auto max-w-6xl px-6">
                    <div className="reveal rounded-3xl bg-white/50 backdrop-blur-xl ring-1 ring-black/5 p-6 md:p-8">
                        <h2 className="text-3xl md:text-5xl font-semibold text-gray-800">Безопасность и этика</h2>
                        <p className="mt-4 text-gray-600 text-base md:text-lg">Проверка квалификаций, модерация, правила сообщества. Конфиденциальность и прозрачность — по умолчанию.</p>
                        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                          {[
                            { t: "Сертификация" },
                            { t: "Модерация" },
                            { t: "Приватность" },
                            { t: "Жалоба 1 клик" },
                          ].map((x, i) => (
                            <div key={i} className="rounded-2xl p-4 bg-white/70 ring-1 ring-black/5 text-sm text-gray-700">{x.t}</div>
                          ))}
                        </div>
                    </div>
                </div>
            </section>
            )}

            {/* FAQ (legacy) - removed */}
            {false && (
            <section id="faq" className="relative h-screen snap-start overflow-hidden flex items-center">
                <Image src="/bg-hero-waves.svg" alt="" fill className="object-cover opacity-60 pointer-events-none select-none z-0" />
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-white/70 via-sky-100/70 to-emerald-100/70" data-theme-bg />
                <div className="relative z-20 mx-auto max-w-6xl px-6">
                    <div className="reveal rounded-3xl bg-white/50 backdrop-blur-xl ring-1 ring-black/5 p-6 md:p-8">
                        <h2 className="text-3xl md:text-5xl font-semibold text-gray-800">FAQ</h2>
                        <div className="mt-6 grid md:grid-cols-2 gap-4 text-gray-700 text-sm">
                          {[
                            { q: "Как проходят эфиры?", a: "В лайв-формате с чатом, записи сохраняются." },
                            { q: "Будут ли записи?", a: "Да, в библиотеке доступны в любое время." },
                            { q: "Нужно ли оборудование?", a: "Нет, достаточно телефона или ноутбука." },
                            { q: "Как отменить подписку?", a: "В 1 клик в профиле, без вопросов." },
                            { q: "Есть ли бесплатный доступ?", a: "Первый эфир бесплатен, без карты." },
                            { q: "Какой уровень подготовки нужен?", a: "Подходит для любого уровня, темп — ваш." },
                          ].map((f, i) => (
                            <details key={i} className="rounded-xl bg-white/70 ring-1 ring-black/5 p-4">
                              <summary className="cursor-pointer font-medium text-gray-800">{f.q}</summary>
                              <p className="mt-2 text-gray-600">{f.a}</p>
                            </details>
                          ))}
                        </div>
                        <div className="mt-6">
                          <a href="#" className="rounded-full bg-white/80 px-6 py-3 text-sm md:text-base text-gray-800 shadow hover:bg-white transition-colors">Задать вопрос в чат</a>
                        </div>
                    </div>
                </div>
            </section>
            )}

            {/* CTA (legacy) - removed, use join */}
            {false && (
            <section id="cta" className="relative h-screen snap-start overflow-hidden flex items-center justify-center">
                <Image src="/bg-section-calm.svg" alt="" fill className="object-cover opacity-60 pointer-events-none select-none z-0" />
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-emerald-100/70 via-sky-100/70 to-emerald-50/70" data-theme-bg />
                {/* top wave from previous (emerald-100/70) */}
                <div className="pointer-events-none absolute top-[-1px] left-0 right-0 z-10 text-emerald-100/70 rotate-180">
                  <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="block w-full h-[70px] md:h-[100px]">
                    <path fill="currentColor" d="M0,0 C180,60 360,0 540,40 C720,80 900,0 1080,50 C1260,100 1440,40 1440,40 L1440,120 L0,120 Z" />
                  </svg>
                </div>
                <div className="relative z-20 text-center px-6 max-w-2xl reveal rounded-3xl bg-white/50 backdrop-blur-xl ring-1 ring-black/5 py-8">
                    <h2 className="text-3xl md:text-5xl font-semibold text-gray-800">Будьте в балансе каждый день</h2>
                    <p className="mt-4 text-gray-600 text-base md:text-lg" style={{ ["--d" as any]: 1 }}>Присоединяйтесь к сообществу, где ценят осознанность, движение и поддержку.</p>
                    <div className="mt-8 flex items-center justify-center gap-4">
                        <a href="http://localhost:3001/register" className="rounded-full bg-teal-600 text-white px-6 py-3 text-sm md:text-base shadow hover:bg-teal-500 transition-colors" style={{ ["--d" as any]: 2 }}>Присоединиться</a>
                        <a href="http://localhost:3001/login" className="rounded-full bg-white/80 px-6 py-3 text-sm md:text-base text-gray-800 shadow hover:bg-white transition-colors" style={{ ["--d" as any]: 3 }}>У меня есть аккаунт</a>
                    </div>
                    <p className="mt-3 text-xs text-gray-500">Первый эфир — бесплатно. Без карты.</p>
                </div>
                {/* Footer from layout moved here to be visible within last full-screen section */}
                <footer className="absolute bottom-0 left-0 right-0 z-20 border-t border-gray-200/70 bg-white/70 backdrop-blur text-gray-700 text-sm">
                  <div className="mx-auto max-w-6xl px-6 py-4 md:py-6 flex flex-col items-center gap-3 text-center">
                    <div className="flex items-center gap-3 whitespace-nowrap">
                      <img src="/logo-sunset.svg" alt="GARmonia" className="h-5 w-5" />
                      <span className="font-medium">GARmonia</span>
                      <span>© {new Date().getFullYear()} GARmonia. Все права защищены.</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <a href="#benefits" className="hover:text-gray-900 transition-colors">Преимущества</a>
                      <a href="#pricing" className="hover:text-gray-900 transition-colors">Подписка</a>
                      <a href="#cta" className="hover:text-gray-900 transition-colors">Контакты</a>
                    </div>
                  </div>
                </footer>
            </section>
            )}

            {/* Animations CSS */}
            <style jsx global>{`
              .reveal { opacity: 0; transform: translateY(16px) scale(0.98); transition: opacity .8s ease, transform .8s ease; }
              .reveal.revealed { opacity: 1; transform: translateY(0) scale(1); }
              section { scroll-snap-align: unset; }
              @keyframes floatSoft { 0% { transform: translateY(0) } 50% { transform: translateY(-6px) } 100% { transform: translateY(0) } }
              .float-soft { animation: floatSoft 6s ease-in-out infinite; }
              /* extra staggered reveals */
              .reveal > * { --d: 0; opacity: 0; transform: translateY(12px); transition: opacity .6s ease, transform .6s ease; transition-delay: calc(var(--d) * 60ms); }
              .reveal.revealed > * { opacity: 1; transform: translateY(0); }
              /* theme-aware backgrounds */
              body[data-theme="dark"] [data-theme-bg] { filter: brightness(0.7) saturate(0.9) hue-rotate(-10deg); }
              /* breathing scroll */
              .breathing [data-theme-bg] {
                transform: translate3d(0, var(--breath-ty, 0px), 0) scale(var(--breath-scale, 1));
                transform-origin: 50% 0%;
                transition: transform .35s ease-out;
                will-change: transform;
              }
              /* day-phase filters */
              body[data-phase="morning"] [data-theme-bg] { filter: hue-rotate(-6deg) saturate(1.05) brightness(1.03); }
              body[data-phase="day"] [data-theme-bg] { filter: hue-rotate(0deg) saturate(1) brightness(1); }
              body[data-phase="evening"] [data-theme-bg] { filter: hue-rotate(6deg) saturate(0.98) brightness(0.98); }
              body[data-phase="night"] [data-theme-bg] { filter: hue-rotate(12deg) saturate(0.92) brightness(0.92); }
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
              .brand-accent { background: linear-gradient(180deg, #000, #14b8a6); -webkit-background-clip: text; background-clip: text; color: transparent; filter: drop-shadow(0 6px 16px rgba(56,189,248,.15)); }
              /* Live equalizer */
              .eq span { height: 6px; animation: eq 1.2s ease-in-out infinite; border-radius: 2px; }
              @keyframes eq { 0%,100%{ height:6px } 40%{ height: 100% } 70%{ height: 40% } }
              /* Chat bubbles */
              .chat-bubble { animation: floatChat 6s ease-in-out infinite; }
              .chat-bubble:nth-child(2){ animation-delay: 1.5s; }
              @keyframes floatChat { 0%,100% { transform: translateY(0) ; opacity: .95 } 50% { transform: translateY(-6px); opacity: 1 } }
              .reaction { position:absolute; bottom:-10px; font-size: 18px; animation: fly 3s ease-in forwards; filter: drop-shadow(0 2px 6px rgba(0,0,0,.2)); }
              @keyframes fly { 0%{ transform: translateY(0) scale(.8); opacity:.0 } 15%{ opacity:1 } 100%{ transform: translateY(-160px) scale(1.2); opacity:0 } }
              /* Reduced motion */
              @media (prefers-reduced-motion: reduce) {
                .aurora, .float-soft, .chat-bubble, .reaction, .eq span, .spectrum { animation: none !important; }
                .reveal { transition: none !important; opacity: 1 !important; transform: none !important; }
                .reveal > * { transition: none !important; }
              }
            `}</style>
        </div>
    );
}