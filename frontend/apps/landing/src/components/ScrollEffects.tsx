"use client";

import { useEffect, useState } from "react";

export function useSectionObserver(sectionIds: string[]) {
    const [activeId, setActiveId] = useState<string>(sectionIds[0] ?? "");

    useEffect(() => {
        const sections = sectionIds
            .map((id) => document.getElementById(id))
            .filter((el): el is HTMLElement => !!el);

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
                if (visible[0]?.target) setActiveId(visible[0].target.id);
            },
            { threshold: [0.25, 0.5, 0.75], rootMargin: "-10% 0px -10% 0px" }
        );

        sections.forEach((section) => observer.observe(section));
        return () => observer.disconnect();
    }, [sectionIds]);

    return activeId;
}

export function useParallax() {
    useEffect(() => {
        let raf = 0;
        const update = () => {
            raf = 0;
            const elements = document.querySelectorAll<HTMLElement>("[data-parallax]");
            const viewportH = window.innerHeight;
            const scrollY = window.scrollY;
            const deviceFactor = window.innerWidth < 768 ? 0.6 : 1; // мягче на мобильных

            elements.forEach((el) => {
                const rect = el.getBoundingClientRect();
                const elementTop = rect.top + scrollY;
                const elementCenter = elementTop + rect.height / 2;
                const viewportCenter = scrollY + viewportH / 2;
                const delta = viewportCenter - elementCenter; // расстояние от центра вьюпорта

                const speed = Number(el.dataset.parallaxSpeed ?? "0.25") * deviceFactor;
                const axis = (el.dataset.parallaxAxis ?? "y").toLowerCase();
                const max = Number(el.dataset.parallaxMax ?? "80");
                const translate = Math.max(Math.min(delta * speed / 12, max), -max); // сглаженный коэффициент
                const rotate = Number(el.dataset.parallaxRotate ?? "0");
                const scale = Number(el.dataset.parallaxScale ?? "1");

                const translateX = axis === "x" ? translate : 0;
                const translateY = axis === "y" ? translate : 0;

                el.style.willChange = "transform";
                el.style.transform = `translate3d(${translateX.toFixed(2)}px, ${translateY.toFixed(2)}px, 0) rotate(${rotate}deg) scale(${scale})`;
            });
        };
        const onScroll = () => {
            if (raf) return;
            raf = window.requestAnimationFrame(update);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        update();
        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
            if (raf) cancelAnimationFrame(raf);
        };
    }, []);
}

export default function ScrollEffects() {
    useParallax();
    return null;
}


