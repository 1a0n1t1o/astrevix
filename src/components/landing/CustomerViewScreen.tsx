const PHONE_STEPS = [
  { num: "1", label: "Create your content" },
  { num: "2", label: "Post it publicly" },
  { num: "3", label: "Submit your link" },
  { num: "4", label: "Get rewarded" },
];

// Screen content for the "What your customers see" phone mockup.
// Sits inside <HeroPhone>; the IPhoneMockup wrapper renders the Dynamic
// Island over the top, so we leave room for it via pt-[68px].
export default function CustomerViewScreen() {
  return (
    <div className="relative z-0 px-5 pb-5 pt-[68px] md:px-6 md:pb-6 md:pt-[72px]">
      {/* Powered by badge */}
      <div className="flex justify-center">
        <div
          className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-[10px] text-gray-500 md:text-[11px]"
        >
          Powered by{" "}
          <span className="font-semibold text-gray-700">Astrevix</span>
        </div>
      </div>

      {/* Business logo — pink/rose gradient */}
      <div className="mt-4 flex justify-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 text-lg font-bold text-white shadow-lg md:h-14 md:w-14 md:text-xl">
          G
        </div>
      </div>

      {/* Business name + tagline */}
      <p className="mt-3 text-center text-base font-bold text-gray-900 md:text-lg">
        Glow Nail Studio
      </p>
      <p className="mt-0.5 text-center text-[10px] text-gray-500 md:text-[11px]">
        Newport Beach&apos;s modern nail bar
      </p>

      {/* Reward card */}
      <div
        className="mt-4 rounded-2xl bg-white/80 p-4 text-center shadow-sm"
        style={{ border: "1px solid rgba(255,255,255,0.4)" }}
      >
        <p
          className="text-[9px] font-semibold uppercase tracking-widest md:text-[10px]"
          style={{ color: "#EC4899" }}
        >
          Your Reward
        </p>
        <p className="mt-1.5 text-sm font-bold text-gray-900 md:text-base">
          Free gel upgrade
        </p>
        <p className="mt-1 text-[10px] text-gray-500 md:text-[11px]">
          Post your manicure on Instagram
        </p>
      </div>

      {/* How it works */}
      <div className="mt-4 space-y-2">
        {PHONE_STEPS.map((step) => (
          <div
            key={step.num}
            className="flex items-center gap-2.5 rounded-lg bg-white p-2 shadow-sm md:p-2.5"
          >
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-gray-100 text-[9px] font-bold text-gray-700 md:h-6 md:w-6 md:text-[10px]">
              {step.num}
            </div>
            <span className="text-[10px] font-medium text-gray-800 md:text-[11px]">
              {step.label}
            </span>
          </div>
        ))}
      </div>

      {/* CTA button — pink/rose gradient */}
      <div
        className="mt-4 rounded-xl py-2.5 text-center text-xs font-semibold text-white md:py-3 md:text-sm"
        style={{
          background: "linear-gradient(135deg, #EC4899, #F43F5E)",
          boxShadow: "0 4px 12px rgba(236,72,153,0.3)",
        }}
      >
        Submit Your Post &rarr;
      </div>
    </div>
  );
}
