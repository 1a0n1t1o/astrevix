"use client";

import { Children, useState, type ReactNode } from "react";

const TABS = [
  { id: "dash" as const, label: "What you see" },
  { id: "cust" as const, label: "What customers see" },
];

interface ExperienceToggleProps {
  children: ReactNode;
}

/**
 * Mobile-only toggle for the "Two beautiful experiences" section.
 *
 * Mobile (≤768px): a tablist at top + one mockup visible at a time, with a
 * 200ms opacity crossfade between them. Both children stay mounted (the
 * inactive one is overlaid via absolute positioning so its mounted state +
 * scroll listeners survive the swap, and so the wrapper's height tracks the
 * active mockup naturally).
 *
 * Desktop (≥768px): tablist hidden, both children rendered in normal flow
 * with the same `space-y-16 / space-y-24` rhythm the section had before.
 */
export function ExperienceToggle({ children }: ExperienceToggleProps) {
  const [tab, setTab] = useState<"dash" | "cust">("dash");
  const slots = Children.toArray(children);

  return (
    <div className="mt-12 md:mt-16">
      <div
        role="tablist"
        aria-label="Switch view"
        className="mb-6 flex items-center justify-center gap-2 md:hidden"
      >
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t.id)}
              className={`rounded-full px-5 py-2 text-xs font-semibold transition-all active:scale-95 ${
                active
                  ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/25"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="relative md:space-y-16 lg:space-y-24">
        <div
          aria-hidden={tab !== "dash"}
          className={`transition-opacity duration-200 md:!relative md:!opacity-100 md:!pointer-events-auto ${
            tab === "dash"
              ? "opacity-100"
              : "absolute inset-0 opacity-0 pointer-events-none"
          }`}
        >
          {slots[0]}
        </div>
        <div
          aria-hidden={tab !== "cust"}
          className={`transition-opacity duration-200 md:!relative md:!opacity-100 md:!pointer-events-auto ${
            tab === "cust"
              ? "opacity-100"
              : "absolute inset-0 opacity-0 pointer-events-none"
          }`}
        >
          {slots[1]}
        </div>
      </div>
    </div>
  );
}
