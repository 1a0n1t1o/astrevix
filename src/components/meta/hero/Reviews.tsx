"use client";

import { useEffect, useRef } from "react";
import { REVIEWS } from "@/lib/reviews";
import { SectionTitle } from "./shared";

// Reviews rendered twice so the auto-scroll loops seamlessly: once we pass
// the width of the first set we subtract it, and the identical second set
// makes the reset invisible.
const LOOPED = [...REVIEWS, ...REVIEWS];

export default function Reviews() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let paused = false;
    let resumeT = 0;
    let raf = 0;
    let loopWidth = 0;

    const measure = () => {
      const first = el.children[0] as HTMLElement | undefined;
      const dupe = el.children[REVIEWS.length] as HTMLElement | undefined;
      loopWidth = first && dupe ? dupe.offsetLeft - first.offsetLeft : 0;
    };

    const tick = () => {
      if (!paused && loopWidth > 0) {
        el.scrollLeft += 0.5;
        if (el.scrollLeft >= loopWidth) el.scrollLeft -= loopWidth;
      }
      raf = requestAnimationFrame(tick);
    };

    const pause = () => {
      paused = true;
      window.clearTimeout(resumeT);
    };
    const resumeSoon = () => {
      window.clearTimeout(resumeT);
      resumeT = window.setTimeout(() => {
        paused = false;
      }, 1500);
    };

    // Native overflow scrolling already handles touch swipe + trackpad; this
    // adds click-drag for desktop mice. Either way we pause, then resume.
    let dragging = false;
    let startX = 0;
    let startScroll = 0;
    const down = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      dragging = true;
      startX = e.clientX;
      startScroll = el.scrollLeft;
      pause();
      el.setPointerCapture(e.pointerId);
      el.style.cursor = "grabbing";
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      el.scrollLeft = startScroll - (e.clientX - startX);
    };
    const up = () => {
      if (!dragging) return;
      dragging = false;
      el.style.cursor = "";
      resumeSoon();
    };
    const wheel = () => {
      pause();
      resumeSoon();
    };

    measure();
    if (document.fonts?.ready) document.fonts.ready.then(measure);

    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", resumeSoon);
    el.addEventListener("touchstart", pause, { passive: true });
    el.addEventListener("touchend", resumeSoon, { passive: true });
    el.addEventListener("wheel", wheel, { passive: true });
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    window.addEventListener("resize", measure);

    if (!reduce) raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(resumeT);
      window.removeEventListener("resize", measure);
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", resumeSoon);
      el.removeEventListener("touchstart", pause);
      el.removeEventListener("touchend", resumeSoon);
      el.removeEventListener("wheel", wheel);
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
  }, []);

  return (
    <section>
      <SectionTitle>What local owners are saying.</SectionTitle>

      <div
        ref={ref}
        className="-mx-5 flex cursor-grab select-none gap-4 overflow-x-auto px-5 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {LOOPED.map((review, i) => (
          <figure
            key={i}
            aria-hidden={i >= REVIEWS.length || undefined}
            className="flex w-[80%] shrink-0 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.06)] sm:w-[58%]"
          >
            <blockquote className="flex-1 text-[14px] leading-relaxed text-slate-700">
              {`“${review.quote}”`}
            </blockquote>
            <figcaption className="mt-4 flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-xs font-bold text-white">
                {review.name[0]}
              </div>
              <div>
                <div className="text-[13px] font-bold text-[#0A0E27]">
                  {review.name}
                </div>
                <div className="text-[12px] text-slate-500">{review.role}</div>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
