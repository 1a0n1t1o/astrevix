"use client";

import { useEffect } from "react";

/**
 * Mounts a single IntersectionObserver that watches every `.reveal` element
 * on the page and adds `.is-visible` when each enters the viewport.
 * Replaces dozens of framer-motion `whileInView` instances at near-zero JS cost.
 */
export default function RevealObserver() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0, rootMargin: "0px 0px 200px 0px" },
    );

    const targets = document.querySelectorAll(".reveal:not(.is-visible)");
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
