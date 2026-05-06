import { QualifyButton } from "@/components/qualify/QualifyButton";

export default function CTASection() {
  return (
    <section
      className="relative overflow-hidden py-[80px] md:py-[140px]"
      style={{
        background:
          "linear-gradient(180deg, #4F46E5 0%, #7C3AED 40%, #6D28D9 100%)",
      }}
    >
      {/* Faint grid overlay for depth */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Subtle center radial glow */}
      <div
        aria-hidden="true"
        className="gpu-layer pointer-events-none absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.06) 30%, transparent 65%)",
          filter: "blur(60px)",
        }}
      />

      <div className="reveal reveal-up relative mx-auto max-w-[800px] px-6 text-center">
        <p className="mb-6 text-sm font-semibold uppercase tracking-[0.2em] text-white/85">
          30 Days Free — No Risk
        </p>
        <h2 className="mb-6 text-3xl font-bold leading-tight tracking-tight text-white md:text-5xl">
          Stop chasing customer content. Start collecting it.
        </h2>
        <p className="mx-auto mb-10 max-w-2xl text-xl text-white/80">
          Set up takes under 2 minutes. Your custom QR code and NFC stand ship
          within 24 hours. Try it free for 30 days — if you&apos;re not getting
          customer posts, we&apos;ll work with you until you are or you walk
          away.
        </p>

        <QualifyButton className="inline-flex items-center gap-2 rounded-full bg-white px-10 py-5 text-lg font-bold text-purple-700 shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
          I&apos;m Ready to Scale
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
            />
          </svg>
        </QualifyButton>
      </div>
    </section>
  );
}
