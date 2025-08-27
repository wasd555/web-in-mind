"use client";

import React from "react";

type GridCols = { base?: number; sm?: number; md?: number; lg?: number; xl?: number; [k: `_${string}`]: number | undefined } & { [k in "2xl"]?: number };

function clampCols(n?: number): number | undefined {
  if (typeof n !== "number") return undefined;
  if (Number.isNaN(n)) return undefined;
  return Math.min(12, Math.max(1, Math.floor(n)));
}

const colsClass: Record<number, string> = {
  1: "grid-cols-1", 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-4",
  5: "grid-cols-5", 6: "grid-cols-6", 7: "grid-cols-7", 8: "grid-cols-8",
  9: "grid-cols-9", 10: "grid-cols-10", 11: "grid-cols-11", 12: "grid-cols-12",
};

function buildColsClasses(cols?: GridCols): string {
  const base = clampCols(cols?.base);
  const sm = clampCols(cols?.sm);
  const md = clampCols(cols?.md);
  const lg = clampCols(cols?.lg);
  const xl = clampCols(cols?.xl);
  // @ts-expect-error - support 2xl breakpoint key
  const x2 = clampCols(cols?.["2xl"] as number | undefined);

  return [
    base && colsClass[base],
    sm && `sm:${colsClass[sm]}`,
    md && `md:${colsClass[md]}`,
    lg && `lg:${colsClass[lg]}`,
    xl && `xl:${colsClass[xl]}`,
    x2 && `2xl:${colsClass[x2]}`,
  ].filter(Boolean).join(" ");
}

export default function BentoGrid({ children, cols }: { children: React.ReactNode; cols?: GridCols }) {
  // Сохраняем текущее поведение по умолчанию (mobile:4, md:2, xl:4)
  const defaultClasses = "grid-cols-4 md:grid-cols-2 xl:grid-cols-4";
  const custom = buildColsClasses(cols);

  return (
    <div className="mx-auto max-w-[120rem] px-4 sm:px-6 lg:px-8">
      <div className={`grid auto-rows-[1fr] gap-4 sm:gap-6 lg:gap-8 ${custom || defaultClasses}`}>
        {children}
      </div>
    </div>
  );
}


