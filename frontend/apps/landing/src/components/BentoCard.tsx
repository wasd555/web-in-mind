"use client";

import React from "react";
import Image from "next/image";

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
} & BackgroundProps) {
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

  return (
    <article
      aria-label={ariaLabel ?? title}
      className={joinClasses(
        spanClass,
        "relative isolate rounded-3xl",
        baseBackground,
        "backdrop-blur-md ring-1 ring-black/5 dark:ring-white/10 shadow-sm overflow-hidden transition-transform",
        "hover:-translate-y-0.5 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:transform-none",
        "min-h-[220px] md:min-h-[260px] lg:min-h-[300px]",
        className,
      )}
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


