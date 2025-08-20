"use client";

import { useMemo } from "react";
import { useSectionObserver } from "./ScrollEffects";

type Props = {
    ids: string[];
};

export default function SectionDots({ ids }: Props) {
    const activeId = useSectionObserver(ids);
    const items = useMemo(() => ids.map((id) => ({ id, href: `#${id}` })), [ids]);

    return (
        <div className="fixed right-5 top-1/2 -translate-y-1/2 z-[60]">
            <ul className="flex flex-col gap-3">
                {items.map((item) => (
                    <li key={item.id}>
                        <a
                            href={item.href}
                            className={`block h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                                activeId === item.id
                                    ? "bg-teal-500 ring-4 ring-teal-200/60 scale-110"
                                    : "bg-gray-400/60 hover:bg-gray-500/80"
                            }`}
                            aria-label={`Перейти к секции ${item.id}`}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
}


