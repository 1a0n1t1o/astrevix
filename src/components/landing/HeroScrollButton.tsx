"use client";

export default function HeroScrollButton() {
  return (
    <button
      onClick={() =>
        document
          .querySelector("#how-it-works")
          ?.scrollIntoView({ behavior: "smooth" })
      }
      className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/50 px-8 py-4 text-base font-semibold text-gray-700 backdrop-blur-sm transition-all hover:bg-white/80 hover:shadow-lg"
    >
      See How It Works
    </button>
  );
}
