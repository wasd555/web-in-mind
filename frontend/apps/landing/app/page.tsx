"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import ScrollEffects from "../src/components/ScrollEffects";
import Section from "../src/components/Section";
import BentoGrid from "../src/components/BentoGrid";
import { BentoCard } from "../src/components/BentoCard";

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
                <div className="fixed top-[100px] left-1/2 -translate-x-1/2 z-40">
                    <div className="glass rounded-full px-3 py-2 shadow flex items-center gap-2 text-xs md:text-sm">
                        <span className="inline-flex items-center gap-1 text-gray-800"><span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" /> Ближайший эфир через {mm}:{ss}</span>
                        <a href="#offerings" className="rounded-full bg-teal-600 text-white px-3 py-1 hover:bg-teal-500 transition-colors">Напомнить</a>
                    </div>
                </div>
            )}
            {/* Hero */}
            <section id="hero" className="relative h-screen snap-start flex items-start justify-center overflow-visible pt-30 md:pt-50">
                {/* white border 20px + max width 2000px */}
                <div className="absolute inset-0 z-0 bg-white">
                    <div className="h-full w-full max-w-[4000px] mx-auto p-5">
                        <div className="w-full h-full rounded-[16px] overflow-hidden relative">
                            <img src="/bg-hero8.png" alt="" className="w-full h-full object-cover object-right" />
                            <div className="hero-glass-sweep absolute inset-0 pointer-events-none" />
                        </div>
                    </div>
                </div>
                <div className="pointer-events-none absolute inset-0 z-10 aurora" aria-hidden />
                <div className="relative z-20 w-full px-6 reveal">
                    <div className="mx-auto max-w-[2000px]">
                        <div className="w-full mx-auto px-2 sm:px-4 md:px-6">
                            <img src="/garmonia-logo.svg" alt="GARmonia" className="block w-full h-auto" />
                        </div>
                        <div className="mt-6 max-w-full">
                        <div className="flex flex-col items-center justify-center gap-10">
                        {/* Left: brand, lines, text, stats, ctas */}
                        <div className="text-center md:pr-0">
                            <p className="mt-20 text-base sm:text-5xl text-gray-100 max-w-7xl">
                                Платформа для прямых эфиров и видео от психологов и врачей. Найдите баланс, вдохновение и поддержку.
                            </p>
                            <div className="mt-6 grid grid-cols-3 max-w-md gap-3 text-sm mx-auto">
                                <div className="glass metric px-3 py-2 rounded-2xl">
                                    <p className="font-medium text-gray-800">Экспертов</p>
                                    <p className="text-teal-600 text-lg">50+</p>
                                </div>
                                <div className="glass metric px-3 py-2 rounded-2xl">
                                    <p className="font-medium text-gray-800">Видео</p>
                                    <p className="text-sky-600 text-lg">1 200+</p>
                                </div>
                                <div className="glass metric px-3 py-2 rounded-2xl">
                                    <p className="font-medium text-gray-800">Эфиры в месяц</p>
                                    <p className="text-emerald-600 text-lg">30+</p>
                                </div>
                            </div>
                            <div className="mt-8 flex items-center justify-center gap-4">
                                <a href="http://localhost:3001/register" className="rounded-full bg-teal-600 text-white px-5 md:px-6 py-3 text-sm md:text-base shadow hover:bg-teal-500 transition-colors">Начать путь</a>
                                <a href="#about" className="rounded-full bg-white/80 px-5 md:px-6 py-3 text-sm md:text-base text-gray-800 shadow hover:bg-white transition-colors">Узнать больше</a>
                            </div>
                        </div>
                        </div>
                        {/* Right: live preview card (hidden) */}
                        {false && (
                        <div className="block mt-6 sm:mt-0 sm:ml-auto shrink-0">
                            <div className="relative mx-auto sm:mx-0 max-w-lg w-full aspect-[4/3] rounded-3xl overflow-hidden ring-1 ring-black/5 bg-white/50 backdrop-blur-xl shadow-lg live-card max-[450px]:aspect-[16/9]">
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
                        )}
                        </div>
                    </div>
                </div>
                
            </section>

            {/* Benefits (Bento) */}
            <Section id="benefits" title="ПОЧЕМУ GARMONIA" subtitle="Мы объединяем практики психологии, медицины и движения. Эфиры, курсы и видео — всё в одном месте, чтобы поддержать ваш баланс.">
              <BentoGrid cols={{ base: 1, sm: 1, md: 2, lg: 2, xl: 4}}>
                <BentoCard
                  fullRow
                  title="Основатель: Муратова Гульмира"
                  subtitle="Практический психолог - Мира международной сертификации Австрия / Казань"
                  variant="text"
                  backgroundColorClassName="bg-white/85"
                  clampLines={5}
                  contentClassName="pt-0"
                >
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                    <div className="md:col-span-3">
                      <div className="relative w-full aspect-[3/4] overflow-hidden rounded-3xl ring-1 ring-black/5">
                        <Image src="/mira.jpg" alt="Муратова Гульмира" fill sizes="(min-width:1024px) 20vw, 60vw" className="object-cover" />
                      </div>
                    </div>
                    <div className="md:col-span-9">
                      <div className="grid gap-5">
                        <div className="grid gap-3 text-sm md:text-base lg:text-[17px] leading-relaxed text-gray-700">
                          <p className="text-gray-900 font-medium">Обо мне</p>
                          <div className="grid md:grid-cols-3 gap-3">
                            <div className="rounded-2xl p-4 bg-white/70 ring-1 ring-black/5">
                              <div className="flex items-center gap-2 text-teal-700"><span className="h-6 w-6 rounded-lg bg-teal-100 inline-flex items-center justify-center">✓</span><span className="font-medium">Сильная база</span></div>
                              <p className="mt-1 text-gray-700">Квалификация, знание и опыт работы в области образования, психотерапии, медицины и спорта.</p>
                            </div>
                            <div className="rounded-2xl p-4 bg-white/70 ring-1 ring-black/5">
                              <div className="flex items-center gap-2 text-teal-700"><span className="h-6 w-6 rounded-lg bg-teal-100 inline-flex items-center justify-center">★</span><span className="font-medium">Европейская сертификация</span></div>
                              <p className="mt-1 text-gray-700">Европейская психотерапевтическая лига, позитивная терапия (Австрия/Казань).</p>
                            </div>
                            <div className="rounded-2xl p-4 bg-white/70 ring-1 ring-black/5">
                              <div className="flex items-center gap-2 text-teal-700"><span className="h-6 w-6 rounded-lg bg-teal-100 inline-flex items-center justify-center">🏅</span><span className="font-medium">Работа с результатом</span></div>
                              <p className="mt-1 text-gray-700">Гуманистический психодинамический метод. Постнеклассический подход.</p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <p className="text-gray-900 font-medium">Образование и квалификации</p>
                          <ul className="mt-2 grid gap-2 text-sm md:text-base leading-relaxed list-disc pl-5">
                            <li>Педагогический институт, специальность — дефектолог (Караганда)</li>
                            <li>ИР ОРТ: Институт развития и образования, практический психолог (Казань)</li>
                            <li>Международный сертификат Европейской психотерапевтической лиги, позитивная терапия (Австрия/Казань)</li>
                            <li>Аспирантура при КФУ: научная работа по психологии одарённых детей и молодёжи — «Психологические особенности показателей личностных характеристик в структуре диссинхронии психического развития одарённых» (Казань)</li>
                            <li>АНО «НИИДПО»: науч.-исслед. институт доп. и проф. обучения - Подготовка спортсменов: удостоверение квалификации — тренер(Москва)</li>
                            <li>АНО «НИИДПО»: спортивная диетология и нутрициология, специальность — нутрициолог (Москва)</li>
                          </ul>
                        </div>

                        <div className="grid md:grid-cols-3 gap-3 text-sm">
                          <div className="rounded-2xl p-4 bg-white/70 ring-1 ring-black/5 flex items-center gap-3">
                            <span className="h-8 w-8 rounded-xl bg-emerald-100 text-emerald-700 inline-flex items-center justify-center">💬</span>
                            <div>
                              <p className="font-medium text-gray-900">Ясный язык</p>
                              <p className="text-gray-700">Сложное делает понятным и применимым в быту.</p>
                            </div>
                          </div>
                          <div className="rounded-2xl p-4 bg-white/70 ring-1 ring-black/5 flex items-center gap-3">
                            <span className="h-8 w-8 rounded-xl bg-sky-100 text-sky-700 inline-flex items-center justify-center">🧭</span>
                            <div>
                              <p className="font-medium text-gray-900">Этика и бережность</p>
                              <p className="text-gray-700">Без осуждения, с опорой на доказательные методы.</p>
                            </div>
                          </div>
                          <div className="rounded-2xl p-4 bg-white/70 ring-1 ring-black/5 flex items-center gap-3">
                            <span className="h-8 w-8 rounded-xl bg-amber-100 text-amber-700 inline-flex items-center justify-center">⏱</span>
                            <div>
                              <p className="font-medium text-gray-900">Практика коротких шагов</p>
                              <p className="text-gray-700">Результат через регулярность — без перегруза.</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <a href="#offerings" className="rounded-full bg-teal-600 text-white px-5 py-3 text-sm md:text-base shadow hover:bg-teal-500 transition-colors">Смотреть ближайший эфир</a>
                          <a href="http://localhost:3001/register" className="rounded-full bg-white/80 px-5 py-3 text-sm md:text-base text-gray-800 shadow hover:bg-white transition-colors">Присоединиться</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </BentoCard>
              </BentoGrid>
            </Section>

            {/* About (Bento) */}
            <Section id="about" title="О GARMONIA" subtitle="Научный подход и человеческое тепло. Эфиры, курсы, библиотека и сообщество — мягко возвращают к балансу.">
              <BentoGrid cols={{ base: 1, sm: 1, md: 2, lg: 2, xl: 4 }}>
                <BentoCard
                  title="О платформе"
                  backgroundColorClassName="bg-gray-50"
                  subtitle="Прозрачность, приватность и бережная модерация"
                  variant="text"
                  colSpan={{ base: 1, md: 2, lg: 2, xl: 4 }}
                  clampLines={4}
                >
                  <div className="grid grid-cols-2 gap-2 text-sm md:text-base lg:text-[17px] leading-relaxed">
                    <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-sky-500" /> Научная база</div>
                    <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-https://claude.ai/_next/image?url=%2Fimages%2Fhome-page-assets%2Fiphone_ui.png&w=640&q=75500" /> Бережная модерация</div>
                    <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-amber-500" /> Прозрачность</div>
                    <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-teal-500" /> Приватность</div>
                  </div>
                </BentoCard>

                <BentoCard
                  backgroundImageSrc="/bg-hero3.png"
                  backgroundImageAlt="О платформе"
                  backgroundImageSizes="(min-width:768px) 40vw, 100vw"
                  backgroundImageClassName="object-cover"
                  variant="media"
                  colSpan={{ base: 1, md: 1, lg: 1, xl: 2 }}
                />

                <BentoCard
                  title="60 секунд к личному маршруту"
                  subtitle="Короткая диагностика подскажет, с чего начать — дыхание, сон, тревога, энергия."
                  variant="text"
                  colSpan={{ base: 1, md: 1, lg: 1, xl: 2 }}
                  href="#offerings"
                  cta="Пройти диагностику"
                  clampLines={4}
                  media={(
                    <Image src="/photo1.png" alt="О платформе" fill loading="lazy" sizes="(min-width:768px) 40vw, 100vw" className="object-cover" />
                  )}
                >
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    {["Тревога","Сон","Энергия","Отношения"].map((label, i) => (
                      <div key={i} className="px-3 py-2 rounded-full bg-white/70 ring-1 ring-black/5 text-center whitespace-nowrap">{label}</div>
                    ))}
                  </div>
                </BentoCard>

                <BentoCard
                  media={(
                    <Image src="/live-mock-upload.png" alt="Диагностика" fill loading="lazy" sizes="(min-width:1280px) 33vw, (min-width:768px) 50vw, 100vw" className="object-cover opacity-30" />
                  )}
                  variant="media"
                  colSpan={{ base: 1, md: 2, lg: 2, xl: 4 }}
                />
              </BentoGrid>
            </Section>

            {/* Offerings (Bento) */}
            <Section 
                backgroundImageSrc="/bg-hero3.png"
                id="offerings" title="Возможности" subtitle="Эфиры, курсы, короткие практики и индивидуальные сессии — выбирайте свой ритм.">
              <BentoGrid cols={{ base: 1, sm: 1, md: 2, xl: 4}}>
                {["Прямые эфиры","Курсы","Практики 5–10 мин","Инд. сессии"].map((t, i) => (
                  <BentoCard key={t} title={t} subtitle={i===0?"Живое присутствие и поддержка.":i===1?"Глубокие темы по шагам.":i===2?"Мягкая регулярность.":i===3?"Лично и конфиденциально.":""} variant="text" colSpan={{ base: 4, md: 2, lg: 4 }} clampLines={3}>
                    <button onMouseEnter={() => playChime(i)} className="rounded-xl bg-white/70 ring-1 ring-black/5 px-3 py-2 text-sm whitespace-nowrap focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">Попробовать</button>
                  </BentoCard>
                ))}

                <BentoCard fullRow title="Маршруты к балансу" subtitle="Готовые подборки: «Спокойный сон», «Антитревога», «Лёгкое утро»." variant="text" colSpan={{ base: 1}} clampLines={3}>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[{title: "Спокойный сон за 7 дней", chip: "вечер"}, {title: "Антитревога", chip: "день"}, {title: "Лёгкое утро", chip: "утро"}].map((r, i) => (
                      <div key={i} className="rounded-2xl p-5 bg-white/70 ring-1 ring-black/5">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-gray-800 line-clamp-2">{r.title}</p>
                          <span className="px-2 py-0.5 text-[10px] rounded-full bg-amber-100 text-amber-700 whitespace-nowrap">{r.chip}</span>
                        </div>
                        <div className="mt-3 h-2 rounded-full bg-gray-200 overflow-hidden"><div className="h-full w-1/5 bg-teal-500" /></div>
                        <div className="mt-4 flex items-center gap-2 overflow-x-auto">
                          <a href="#" className="rounded-full bg-teal-600 text-white px-3 py-1 text-sm whitespace-nowrap">Начать</a>
                          <a href="#" className="rounded-full bg-white/80 px-3 py-1 text-sm text-gray-800 shadow whitespace-nowrap">В план</a>
                        </div>
                      </div>
                    ))}
                  </div>
                </BentoCard>

                <BentoCard fullRow title="Ваш ритм" subtitle={`Серия ${streak} дн.`} variant="text" colSpan={{ base: 4, md: 8, lg: 3, xl: 4 }} className="min-h-[300px]" clampLines={2}>
                  <p className="text-gray-600">Сегодня вы на {Math.round(dayProgress*100)}% ближе к балансу.</p>
                  <div className="mt-4 h-3 w-full rounded-full bg-gray-200 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-teal-500 to-sky-500" style={{ width: `${Math.max(0, Math.min(100, dayProgress*100))}%` }} />
                  </div>
                  <div className="mt-4 text-sm text-gray-700 flex items-center gap-3">
                    <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 whitespace-nowrap">Совет дня: 2 цикла дыхания 4–7–8</span>
                    <a href="#" className="rounded-full bg-white/80 px-3 py-1.5 text-sm text-gray-800 shadow whitespace-nowrap">Открыть дашборд</a>
                  </div>
                </BentoCard>

                {[{ title: "Дыхательная практика", expert: "д-р Муратова", when: "сегодня 19:00" },{ title: "Антитревога", expert: "психолог Исаева", when: "завтра 08:30" },{ title: "Сон и восстановление", expert: "сомнолог Петров", when: "пт 21:00" }].map((s, i) => (
                  <BentoCard key={i} title={s.title} subtitle={`${s.expert} • ${s.when}`} variant="text" colSpan={{ base: 4, md: 4, lg: 3, xl: 4 }} ariaLabel={`Эфир: ${s.title}`} clampLines={2}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 whitespace-nowrap">LIVE</span>
                      <div className="flex items-center gap-2 overflow-x-auto">
                        <a href="#" className="rounded-full bg-teal-600 text-white px-3 py-1 whitespace-nowrap">Напомнить</a>
                        <a href="#" className="rounded-full bg-white/80 px-3 py-1 text-gray-800 shadow whitespace-nowrap">В расписание</a>
                      </div>
                    </div>
                  </BentoCard>
                ))}
              </BentoGrid>
            </Section>

            {/* Trust (Эксперты + Сообщество + Этика) */}
            <section id="trust" className="relative min-h-screen snap-start overflow-hidden flex items-center py-16">
                <div className="absolute inset-0 z-0 bg-white">
                    <div className="h-full w-full max-w-[4000px] ml-auto p-5">
                        <div className="w-full h-full rounded-[16px] overflow-hidden relative">
                            <img src="/bg-hero6.png" alt="" className="w-full h-full object-cover object-right" />
                        </div>
                    </div>
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
                        <h3 className="text-2xl md:text-4xl font-semibold text-gray-800">Безопасность</h3>
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

            {/* Join (Bento) */}
            <Section id="join" title="Присоединиться" subtitle="Один план — полный доступ к эфирам и библиотеке. Отмена в 1 клик.">
              <BentoGrid cols={{ base: 1, md: 2, lg: 2, xl: 4}}>
                <BentoCard title="Подписка без лишнего" subtitle="Первый эфир — бесплатно" colSpan={{ base: 4, md: 8, lg: 6, xl: 8 }}>
                  <div className="grid gap-3 text-gray-700">
                    {[
                      'Прямые эфиры с экспертами',
                      'Библиотека записей',
                      'Личные рекомендации',
                      'Доступ к закрытому сообществу',
                    ].map((t, i) => (
                      <div key={i} className="flex items-center gap-3"><span className="h-6 w-6 rounded-full bg-teal-100 text-teal-600 inline-flex items-center justify-center">✓</span> {t}</div>
                    ))}
                  </div>
                  <div className="mt-6 flex items-center gap-3">
                    <a href="http://localhost:3001/register" className="inline-flex rounded-full bg-teal-600 text-white px-6 py-3 text-sm md:text-base shadow">Оформить подписку</a>
                    <a href="#offerings" className="inline-flex rounded-full bg-white/80 px-6 py-3 text-sm md:text-base text-gray-800 shadow">Смотреть ближайший эфир</a>
                  </div>
                  <p className="mt-3 text-xs text-gray-500">7 дней возврат, если не зайдёт. Без карты на первый эфир.</p>
                </BentoCard>

                <BentoCard media={(
                  <Image src="/photo2.png" alt="Команда экспертов" fill loading="lazy" sizes="(min-width:1280px) 33vw, (min-width:768px) 50vw, 100vw" className="object-cover" />
                )} colSpan={{ base: 4, md: 8, lg: 6, xl: 4 }} />

                <BentoCard title="FAQ" colSpan={{ base: 4, md: 8, lg: 6, xl: 8 }}>
                  <div className="grid md:grid-cols-2 gap-4 text-gray-700 text-sm" id="faq">
                    {[
                      { q: 'Как проходят эфиры?', a: 'В лайв-формате с чатом, записи сохраняются.' },
                      { q: 'Будут ли записи?', a: 'Да, в библиотеке доступны в любое время.' },
                      { q: 'Нужно ли оборудование?', a: 'Нет, достаточно телефона или ноутбука.' },
                      { q: 'Как отменить подписку?', a: 'В 1 клик в профиле, без вопросов.' },
                      { q: 'Есть ли бесплатный доступ?', a: 'Первый эфир бесплатен, без карты.' },
                      { q: 'Какой уровень подготовки нужен?', a: 'Подходит для любого уровня, темп — ваш.' },
                    ].map((f,i)=> (
                      <details key={i} className="rounded-xl bg-white/70 ring-1 ring-black/5 p-4">
                        <summary className="cursor-pointer font-medium text-gray-800">{f.q}</summary>
                        <p className="mt-2 text-gray-600">{f.a}</p>
                      </details>
                    ))}
                  </div>
                </BentoCard>

                <BentoCard title="Будьте в балансе каждый день" subtitle="Присоединяйтесь к сообществу, где ценят осознанность, движение и поддержку." colSpan={{ base: 1}}>
                  <div className="mt-4 flex items-center justify-center gap-4">
                    <a href="http://localhost:3001/register" className="rounded-full bg-teal-600 text-white px-6 py-3 text-sm md:text-base shadow">Присоединиться</a>
                    <a href="http://localhost:3001/login" className="rounded-full bg-white/80 px-6 py-3 text-sm md:text-base text-gray-800 shadow">У меня есть аккаунт</a>
                  </div>
                  <p className="mt-3 text-xs text-gray-500 text-center">Первый эфир — бесплатно. Без карты.</p>
                </BentoCard>
              </BentoGrid>
            </Section>

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