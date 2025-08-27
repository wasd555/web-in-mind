"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";

type Span = { base?: number; md?: number; lg?: number; xl?: number };

type Variant = "text" | "media" | "stat";

type BackgroundProps = {
  backgroundColorClassName?: string;
  backgroundImageSrc?: string;
  backgroundImageAlt?: string;
  backgroundImageSizes?: string;
  backgroundImagePriority?: boolean;
  backgroundImageClassName?: string;
  backgroundImageOpacity?: number;
};

function joinClasses(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function BentoCard({
  title,
  subtitle,
  eyebrow,
  icon,
  media,
  href,
  cta = "Подробнее",
  variant = "text",
  colSpan,
  rowSpan,
  className,
  contentClassName,
  ariaLabel,
  clampLines,
  // layout options
  fullRow,
  // animations
  disableAnimations,
  enableBorderGlow,
  enableTilt,
  enableMagnetism,
  clickEffect,
  enableParticles,
  particleCount,
  glowColor: glowColorProp,
  glowRadius,
  // background options
  backgroundColorClassName,
  backgroundImageSrc,
  backgroundImageAlt,
  backgroundImageSizes,
  backgroundImagePriority,
  backgroundImageClassName,
  backgroundImageOpacity,
  children,
}: {
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  icon?: React.ReactNode;
  media?: React.ReactNode;
  href?: string;
  cta?: string;
  variant?: Variant;
  colSpan?: Span;
  rowSpan?: Span;
  className?: string;
  contentClassName?: string;
  ariaLabel?: string;
  clampLines?: number;
  fullRow?: boolean;
  children?: React.ReactNode;
  // animations
  disableAnimations?: boolean;
  enableBorderGlow?: boolean;
  enableTilt?: boolean;
  enableMagnetism?: boolean;
  clickEffect?: boolean;
  enableParticles?: boolean;
  particleCount?: number;
  glowColor?: string; // e.g. "132, 0, 255"
  glowRadius?: number;
} & BackgroundProps) {
  const DEFAULT_GLOW_COLOR = "132, 0, 255";
  const DEFAULT_GLOW_RADIUS = 200;
  const DEFAULT_PARTICLE_COUNT = 12;

  const cardRef = useRef<HTMLElement | null>(null);
  const isHoveredRef = useRef(false);
  const memoizedParticles = useRef<HTMLDivElement[]>([]);
  const particlesRef = useRef<HTMLDivElement[]>([]);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const magnetismAnimationRef = useRef<gsap.core.Tween | null>(null);

  const glowColor = glowColorProp ?? DEFAULT_GLOW_COLOR;
  const particlesInitialized = useRef(false);

  const initializeParticles = useCallback(() => {
    if (particlesInitialized.current || !cardRef.current) return;
    const { width, height } = cardRef.current.getBoundingClientRect();
    const count = particleCount ?? DEFAULT_PARTICLE_COUNT;
    memoizedParticles.current = Array.from({ length: count }, () => {
      const el = document.createElement("div");
      el.className = "bento-particle";
      el.style.cssText = `position:absolute;width:4px;height:4px;border-radius:50%;background: rgba(${glowColor}, 1);box-shadow:0 0 6px rgba(${glowColor}, .6);pointer-events:none;z-index:2;left:${Math.random()*width}px;top:${Math.random()*height}px;`;
      return el;
    });
    particlesInitialized.current = true;
  }, [glowColor, particleCount]);

  const clearAllParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    magnetismAnimationRef.current?.kill();
    particlesRef.current.forEach((p) => {
      gsap.to(p, {
        scale: 0,
        opacity: 0,
        duration: 0.25,
        ease: "back.in(1.7)",
        onComplete: () => p.remove(),
      });
    });
    particlesRef.current = [];
  }, []);

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current) return;
    if (!particlesInitialized.current) initializeParticles();
    memoizedParticles.current.forEach((particle, index) => {
      const id = setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return;
        const clone = particle.cloneNode(true) as HTMLDivElement;
        cardRef.current.appendChild(clone);
        particlesRef.current.push(clone);
        gsap.fromTo(clone, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.25, ease: "back.out(1.7)" });
        gsap.to(clone, {
          x: (Math.random() - 0.5) * 100,
          y: (Math.random() - 0.5) * 100,
          rotation: Math.random() * 360,
          duration: 2 + Math.random() * 2,
          ease: "none",
          repeat: -1,
          yoyo: true,
        });
        gsap.to(clone, { opacity: 0.3, duration: 1.5, ease: "power2.inOut", repeat: -1, yoyo: true });
      }, index * 100);
      timeoutsRef.current.push(id);
    });
  }, [initializeParticles]);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    if (disableAnimations) return;

    const handleMouseEnter = () => {
      isHoveredRef.current = true;
      if (enableParticles) animateParticles();
      if (enableTilt) {
        gsap.to(el, { rotateX: 5, rotateY: 5, duration: 0.25, ease: "power2.out", transformPerspective: 1000 });
      }
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      if (enableParticles) clearAllParticles();
      if (enableTilt) {
        gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.25, ease: "power2.out" });
      }
      if (enableMagnetism) {
        gsap.to(el, { x: 0, y: 0, duration: 0.25, ease: "power2.out" });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!enableTilt && !enableMagnetism) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      if (enableTilt) {
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;
        gsap.to(el, { rotateX, rotateY, duration: 0.1, ease: "power2.out", transformPerspective: 1000 });
      }
      if (enableMagnetism) {
        const magnetX = (x - centerX) * 0.05;
        const magnetY = (y - centerY) * 0.05;
        magnetismAnimationRef.current = gsap.to(el, { x: magnetX, y: magnetY, duration: 0.25, ease: "power2.out" });
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (!clickEffect) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const maxDistance = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height)
      );
      const ripple = document.createElement("div");
      ripple.style.cssText = `position:absolute;width:${maxDistance * 2}px;height:${maxDistance * 2}px;border-radius:50%;background: radial-gradient(circle, rgba(${glowColor}, .4) 0%, rgba(${glowColor}, .2) 30%, transparent 70%);left:${x - maxDistance}px;top:${y - maxDistance}px;pointer-events:none;z-index:3;`;
      el.appendChild(ripple);
      gsap.fromTo(ripple, { scale: 0, opacity: 1 }, { scale: 1, opacity: 0, duration: 0.8, ease: "power2.out", onComplete: () => ripple.remove() });
    };

    el.addEventListener("mouseenter", handleMouseEnter);
    el.addEventListener("mouseleave", handleMouseLeave);
    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("click", handleClick);
    return () => {
      isHoveredRef.current = false;
      el.removeEventListener("mouseenter", handleMouseEnter);
      el.removeEventListener("mouseleave", handleMouseLeave);
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("click", handleClick);
      clearAllParticles();
    };
  }, [animateParticles, clearAllParticles, disableAnimations, enableTilt, enableMagnetism, clickEffect, glowColor, enableParticles]);
  // Default spans by variant if not provided
  const defaultColSpan: Span = (() => {
    if (variant === "media") return { base: 4, md: 4, lg: 4, xl: 4 };
    if (variant === "stat") return { base: 4, md: 2, lg: 3, xl: 3 };
    // text
    return { base: 4, md: 4, lg: 4, xl: 4 };
  })();
  const mergedCol: Span = {
    base: colSpan?.base ?? defaultColSpan.base,
    md: colSpan?.md ?? defaultColSpan.md,
    lg: colSpan?.lg ?? defaultColSpan.lg,
    xl: colSpan?.xl ?? defaultColSpan.xl,
  };

  const spanClass = fullRow
    ? "col-span-full"
    : joinClasses(
        `col-span-${mergedCol.base ?? 4}`,
        mergedCol.md ? `md:col-span-${mergedCol.md}` : "",
        mergedCol.lg ? `lg:col-span-${mergedCol.lg}` : "",
        mergedCol.xl ? `xl:col-span-${mergedCol.xl}` : "",
        rowSpan?.base ? `row-span-${rowSpan.base}` : "",
        rowSpan?.md ? `md:row-span-${rowSpan.md}` : "",
        rowSpan?.lg ? `lg:row-span-${rowSpan.lg}` : "",
        rowSpan?.xl ? `xl:row-span-${rowSpan.xl}` : "",
      );

  const subtitleClampStyle = clampLines
    ? ({
        display: "-webkit-box",
        WebkitBoxOrient: "vertical" as const,
        WebkitLineClamp: clampLines,
        overflow: "hidden",
      } as React.CSSProperties)
    : undefined;

  const baseBackground = backgroundImageSrc
    ? "bg-transparent"
    : (backgroundColorClassName ?? "bg-white/70 dark:bg-white/5");

  const glowVars: React.CSSProperties = useMemo(() => ({
    // CSS variables for spotlight/border glow
    ["--glow-x" as any]: "50%",
    ["--glow-y" as any]: "50%",
    ["--glow-intensity" as any]: 0 as unknown as string,
    ["--glow-radius" as any]: `${glowRadius ?? DEFAULT_GLOW_RADIUS}px`,
    ["--glow-color" as any]: glowColor,
  }), [glowColor, glowRadius]);

  return (
    <article
      ref={(n) => { cardRef.current = n; }}
      aria-label={ariaLabel ?? title}
      className={joinClasses(
        spanClass,
        "bento-card relative isolate rounded-3xl",
        baseBackground,
        enableBorderGlow ? "bento-card--border-glow" : "",
        "backdrop-blur-md ring-1 ring-black/5 dark:ring-white/10 shadow-sm overflow-hidden transition-transform",
        "hover:-translate-y-0.5 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:transform-none",
        "min-h-[220px] md:min-h-[260px] lg:min-h-[300px]",
        className,
      )}
      style={glowVars}
    >
      {backgroundImageSrc && (
        <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden rounded-3xl">
          <Image
            src={backgroundImageSrc}
            alt={backgroundImageAlt ?? ""}
            fill
            sizes={backgroundImageSizes ?? "100vw"}
            priority={backgroundImagePriority}
            className={joinClasses("object-cover", backgroundImageClassName)}
            style={backgroundImageOpacity != null ? { opacity: backgroundImageOpacity } : undefined}
          />
        </div>
      )}

      {(eyebrow || title || subtitle || icon) && (
        <header className="px-5 pt-5 sm:px-6 sm:pt-6 lg:px-8 lg:pt-8">
          {eyebrow && <p className="text-xs uppercase tracking-wide text-gray-500">{eyebrow}</p>}
          <div className="mt-1 flex items-start gap-3">
            {icon && <span aria-hidden className="shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/60 ring-1 ring-black/5">{icon}</span>}
            <div className="min-w-0">
              {title && <h3 className="text-lg sm:text-xl font-semibold text-gray-900 text-balance leading-tight">{title}</h3>}
              {subtitle && (
                <p
                  className="mt-1 text-sm md:text-base lg:text-[17px] leading-relaxed text-black/60 break-words hyphens-auto"
                  style={subtitleClampStyle}
                >
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </header>
      )}
      {media && (
        <div className={joinClasses(
          (eyebrow || title || subtitle || icon) ? "px-5 sm:px-6 lg:px-8" : "p-5 sm:p-6 lg:p-8",
          ""
        )}>
          <div className="relative aspect-[4/3] md:aspect-video w-full overflow-hidden rounded-2xl">
            {media}
          </div>
        </div>
      )}
      <div className={joinClasses("px-5 pb-5 sm:px-6 sm:pb-6 lg:px-8 lg:pb-8", contentClassName)}>{children}</div>
      {href && (
        <footer className="px-5 py-4 sm:px-6 lg:px-8 border-t border-black/5 dark:border-white/10">
          <a
            href={href}
            className="inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4 hover:no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 whitespace-nowrap"
          >
            {cta}
            <span aria-hidden>→</span>
          </a>
        </footer>
      )}
    </article>
  );
}


export function GlobalSpotlight({
  containerRef,
  enabled = true,
  disableAnimations = false,
  spotlightRadius = 300,
  glowColor = "132, 0, 255",
}: {
  containerRef: React.RefObject<HTMLElement | null>;
  enabled?: boolean;
  disableAnimations?: boolean;
  spotlightRadius?: number;
  glowColor?: string; // "r,g,b"
}) {
  const spotlightRef = useRef<HTMLDivElement | null>(null);
  const isInsideRef = useRef(false);

  useEffect(() => {
    if (disableAnimations || !enabled) return;
    const spot = document.createElement("div");
    spot.className = "bento-global-spotlight";
    spot.style.cssText = `position:fixed;width:800px;height:800px;border-radius:50%;pointer-events:none;background:radial-gradient(circle, rgba(${glowColor}, .15) 0%, rgba(${glowColor}, .08) 15%, rgba(${glowColor}, .04) 25%, rgba(${glowColor}, .02) 40%, rgba(${glowColor}, .01) 65%, transparent 70%);z-index:50;opacity:0;transform:translate(-50%, -50%);mix-blend-mode:screen;`;
    document.body.appendChild(spot);
    spotlightRef.current = spot;

    const calculateValues = (radius: number) => ({ proximity: radius * 0.5, fadeDistance: radius * 0.75 });

    const handleMouseMove = (e: MouseEvent) => {
      if (!spotlightRef.current || !containerRef.current) return;
      const section = containerRef.current;
      const rect = section.getBoundingClientRect();
      const mouseInside = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
      isInsideRef.current = mouseInside;
      const cards = Array.from(section.querySelectorAll<HTMLElement>(".bento-card"));

      if (!mouseInside) {
        gsap.to(spotlightRef.current, { opacity: 0, duration: 0.3, ease: "power2.out" });
        cards.forEach((c) => c.style.setProperty("--glow-intensity", "0"));
        return;
      }

      const { proximity, fadeDistance } = calculateValues(spotlightRadius);
      let minDistance = Infinity;
      cards.forEach((card) => {
        const r = card.getBoundingClientRect();
        const centerX = r.left + r.width / 2;
        const centerY = r.top + r.height / 2;
        const distance = Math.hypot(e.clientX - centerX, e.clientY - centerY) - Math.max(r.width, r.height) / 2;
        const effectiveDistance = Math.max(0, distance);
        minDistance = Math.min(minDistance, effectiveDistance);
        let glowIntensity = 0;
        if (effectiveDistance <= proximity) glowIntensity = 1;
        else if (effectiveDistance <= fadeDistance) glowIntensity = (fadeDistance - effectiveDistance) / (fadeDistance - proximity);
        const relativeX = ((e.clientX - r.left) / r.width) * 100;
        const relativeY = ((e.clientY - r.top) / r.height) * 100;
        card.style.setProperty("--glow-x", `${relativeX}%`);
        card.style.setProperty("--glow-y", `${relativeY}%`);
        card.style.setProperty("--glow-intensity", glowIntensity.toString());
        card.style.setProperty("--glow-radius", `${spotlightRadius}px`);
        card.style.setProperty("--glow-color", glowColor);
      });

      gsap.to(spotlightRef.current, { left: e.clientX, top: e.clientY, duration: 0.1, ease: "power2.out" });
      const targetOpacity =
        minDistance <= proximity ? 0.8 : minDistance <= fadeDistance ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.8 : 0;
      gsap.to(spotlightRef.current, { opacity: targetOpacity, duration: targetOpacity > 0 ? 0.2 : 0.5, ease: "power2.out" });
    };

    const handleMouseLeave = () => {
      isInsideRef.current = false;
      const section = containerRef.current;
      if (section) {
        section.querySelectorAll<HTMLElement>(".bento-card").forEach((c) => c.style.setProperty("--glow-intensity", "0"));
      }
      if (spotlightRef.current) {
        gsap.to(spotlightRef.current, { opacity: 0, duration: 0.3, ease: "power2.out" });
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      spotlightRef.current?.parentNode?.removeChild(spotlightRef.current);
    };
  }, [containerRef, disableAnimations, enabled, spotlightRadius, glowColor]);

  return null;
}

// Global CSS for border glow and particles
// Inject once per app via a lightweight component
export function BentoCardStyles() {
  return (
    <style jsx global>{`
      .bento-card--border-glow { border: 5px solid rgba(var(--glow-color), .25); }
      .bento-card--border-glow::after { content: ''; position: absolute; inset: 0; padding: 6px; background: radial-gradient(var(--glow-radius) circle at var(--glow-x) var(--glow-y), rgba(var(--glow-color), calc(var(--glow-intensity) * 0.8)) 0%, rgba(var(--glow-color), calc(var(--glow-intensity) * 0.4)) 30%, transparent 60%); border-radius: inherit; mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); mask-composite: subtract; -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; pointer-events: none; transition: opacity .3s ease; z-index: 1; opacity: var(--glow-intensity, 0); }
      .bento-card--border-glow:hover { --glow-intensity: .9; }
      .bento-particle::before { content:''; position:absolute; top:-2px; left:-2px; right:-2px; bottom:-2px; background: rgba(var(--glow-color), .2); border-radius:50%; z-index:-1; }
    `}</style>
  );
}
