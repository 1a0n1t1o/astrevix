"use client";

import { useEffect, useRef, useState } from "react";

const POINTS: ReadonlyArray<readonly [number, number]> = [
  [0, 58],
  [25, 48],
  [50, 52],
  [75, 35],
  [100, 40],
  [125, 25],
  [150, 30],
  [175, 15],
  [200, 20],
];

const LINE_PATH = POINTS.map(
  (p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`,
).join(" ");
const AREA_PATH = `${LINE_PATH} L200,80 L0,80 Z`;

export default function AnimatedChart() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px 200px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <svg
      ref={ref}
      viewBox="0 0 200 80"
      className="h-full w-full"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2563EB" stopOpacity={0.2} />
          <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
        </linearGradient>
      </defs>
      {[20, 40, 60].map((y) => (
        <line
          key={y}
          x1="0"
          y1={y}
          x2="200"
          y2={y}
          stroke="rgba(0,0,0,0.04)"
          strokeDasharray="3 3"
        />
      ))}
      <path
        d={AREA_PATH}
        fill="url(#chartGrad)"
        className="transition-opacity duration-1000"
        style={{ opacity: visible ? 1 : 0 }}
      />
      <path
        d={LINE_PATH}
        fill="none"
        stroke="#2563EB"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          strokeDasharray: 400,
          strokeDashoffset: visible ? 0 : 400,
          transition: "stroke-dashoffset 1.8s ease-out",
        }}
      />
      {POINTS.map((p, i) => (
        <circle
          key={i}
          cx={p[0]}
          cy={p[1]}
          r="2"
          fill="#2563EB"
          stroke="white"
          strokeWidth="1"
          className="transition-opacity duration-500"
          style={{
            opacity: visible ? 1 : 0,
            transitionDelay: `${0.8 + i * 0.1}s`,
          }}
        />
      ))}
    </svg>
  );
}
