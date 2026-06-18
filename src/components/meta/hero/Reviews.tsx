"use client";

import { useEffect, useRef } from "react";
import { REVIEWS } from "@/lib/reviews";
import { SectionTitle } from "./shared";

// Reviews rendered twice so the auto-scroll loops seamlessly.
const LOOPED = [...REVIEWS, ...REVIEWS];

// Auto-scroll speed in pixels per SECOND. Time-based (below) so it's identical
// on 60Hz and 120Hz+ displays.
const SPEED = 18;

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
    // Sub-pixel position kept in JS: iOS Safari rounds scrollLeft to whole
    // integers, so adding a fraction each frame to scrollLeft itself would
    // never move. We accumulate here and assign it instead.
    let pos = 0;
    let last = 0;

    const measure = () => {
      const first = el.children[0] as HTMLElement | undefined;
      const dupe = el.children[REVIEWS.length] as HTMLElement | undefined;
      if (first && dupe) loopWidth = dupe.offsetLeft - first.offsetLeft;
    };

    // Re-measure whenever the rail gains/changes width (first layout, font
    // load, viewport resize).
    const ro = new ResizeObserver(measure);
    ro.observe(el);

    const tick = (now: number) => {
      const dt = last ? Math.min(now - last, 50) : 0; // cap after tab wakes
      last = now;
      if (!paused && loopWidth > 0) {
        pos += (SPEED * dt) / 1000;
        if (pos >= loopWidth) pos -= loopWidth;
        el.scrollLeft = pos;
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
        pos = el.scrollLeft; // resume from wherever the user left it
        paused = false;
      }, 1500);
    };

    // Native overflow scrolling covers touch swipe + trackpad; this adds
    // click-drag for desktop mice. Either way: pause, then resume.
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
    const upDrag = () => {
      if (!dragging) return;
      dragging = false;
      el.style.cursor = "";
      resumeSoon();
    };
    const wheel = () => {
      pause();
      resumeSoon();
    };

    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", resumeSoon);
    el.addEventListener("touchstart", pause, { passive: true });
    el.addEventListener("touchend", resumeSoon, { passive: true });
    el.addEventListener("wheel", wheel, { passive: true });
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", upDrag);
    el.addEventListener("pointercancel", upDrag);

    if (!reduce) raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(resumeT);
      ro.disconnect();
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", resumeSoon);
      el.removeEventListener("touchstart", pause);
      el.removeEventListener("touchend", resumeSoon);
      el.removeEventListener("wheel", wheel);
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", upDrag);
      el.removeEventListener("pointercancel", upDrag);
    };
  }, []);

  return (
    <section>
      <SectionTitle>What local owners are saying.</SectionTitle>

      <div
        ref={ref}
        className="-mx-5 flex items-start cursor-grab select-none gap-4 overflow-x-auto px-5 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
            {review.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={review.image}
                alt={`Astrevix counter sign at ${review.name}`}
                loading="lazy"
                className="mt-4 aspect-[4/5] w-full rounded-xl border border-slate-200 object-cover"
              />
            )}
          </figure>
        ))}
      </div>
    </section>
  );
}
