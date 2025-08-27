import React from "react";
import Image from "next/image";

function joinClasses(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function Section({
  id,
  title,
  subtitle,
  children,
  ariaLabelledBy,
  // visual panel options
  panel,
  rounded,
  backgroundColorClassName,
  backgroundImageSrc,
  backgroundImageAlt,
  backgroundImageSizes,
  backgroundImagePriority,
  backgroundImageClassName,
  backgroundImageOpacity,
  containerClassName,
  contentClassName,
}: {
  id?: string;
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  ariaLabelledBy?: string;
  panel?: boolean;
  rounded?: boolean;
  backgroundColorClassName?: string;
  backgroundImageSrc?: string;
  backgroundImageAlt?: string;
  backgroundImageSizes?: string;
  backgroundImagePriority?: boolean;
  backgroundImageClassName?: string;
  backgroundImageOpacity?: number;
  containerClassName?: string;
  contentClassName?: string;
}) {
  const headingId = ariaLabelledBy || (title ? `${id ?? "section"}-heading` : undefined);
  const usePanel = panel || !!backgroundColorClassName || !!backgroundImageSrc;

  const panelClasses = usePanel
    ? joinClasses(
        "relative isolate overflow-hidden",
        rounded !== false ? "rounded-3xl" : undefined,
        // стеклянный фон по умолчанию, если не задан кастомный цвет
        backgroundColorClassName ?? "bg-white/70 dark:bg-white/5",
        "backdrop-blur-md ring-1 ring-black/5 dark:ring-white/10",
        "p-5 sm:p-6 lg:p-8"
      )
    : undefined;

  const headerNode = (title || subtitle) && (
    <header className="mb-6 sm:mb-8 lg:mb-10">
      {title && (
        <h2 id={headingId} className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-[-0.01em] text-balance">
          {title}
        </h2>
      )}
      {subtitle && (
        <p className="mt-2 text-sm md:text-base lg:text-[17px] leading-relaxed text-gray-600 break-words hyphens-auto">{subtitle}</p>
      )}
    </header>
  );

  return (
    <section style={{ position: 'relative'}} id={id} aria-labelledby={headingId} className="py-12 sm:py-16 lg:py-24">
      <div className={joinClasses("mx-auto  px-4 sm:px-6 lg:px-8", containerClassName)}>
        {usePanel ? (
          <div className={panelClasses}>
            {backgroundImageSrc && (
              <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
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
            {headerNode}
            <div className={contentClassName}>{children}</div>
          </div>
        ) : (
          <>
            {headerNode}
            <div className={contentClassName}>{children}</div>
          </>
        )}
      </div>
    </section>
  );
}


