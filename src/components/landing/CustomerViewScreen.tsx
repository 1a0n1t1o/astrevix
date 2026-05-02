const PHONE_STEPS = [
  { num: "1", label: "Create your content" },
  { num: "2", label: "Post it publicly" },
  { num: "3", label: "Submit your link" },
  { num: "4", label: "Get rewarded" },
];

// Screen content for the "What your customers see" phone mockup.
// The customer phone is 260-280px wide regardless of viewport (vs the
// hero phone's 380px), so all type sizes here are fixed (no md: variants)
// at a tighter scale that fits the smaller frame.
export default function CustomerViewScreen() {
  return (
    <div className="relative z-0 px-4 pb-3 pt-[58px]">
      {/* Powered by badge */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-[9px] text-gray-500">
          Powered by{" "}
          <span className="font-semibold text-gray-700">Astrevix</span>
        </div>
      </div>

      {/* Business logo — pink/rose gradient */}
      <div className="mt-3 flex justify-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 text-sm font-bold text-white shadow-md">
          G
        </div>
      </div>

      {/* Business name + tagline */}
      <p className="mt-2 text-center text-sm font-bold text-gray-900">
        Glow Nail Studio
      </p>
      <p className="mt-0.5 text-center text-[9px] text-gray-500">
        Newport Beach&apos;s modern nail bar
      </p>

      {/* Reward card */}
      <div
        className="mt-3 rounded-xl bg-white/80 px-3 py-3 text-center shadow-sm"
        style={{ border: "1px solid rgba(255,255,255,0.4)" }}
      >
        <p
          className="text-[8px] font-semibold uppercase tracking-widest"
          style={{ color: "#EC4899" }}
        >
          Your Reward
        </p>
        <p className="mt-1 text-sm font-bold text-gray-900">
          Free gel upgrade
        </p>
        <p className="mt-0.5 text-[9px] text-gray-500">
          Post your manicure on Instagram
        </p>
      </div>

      {/* How it works */}
      <div className="mt-3 space-y-1.5">
        {PHONE_STEPS.map((step) => (
          <div
            key={step.num}
            className="flex items-center gap-2 rounded-lg bg-white p-1.5 shadow-sm"
          >
            <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-md bg-gray-100 text-[8px] font-bold text-gray-700">
              {step.num}
            </div>
            <span className="text-[9px] font-medium text-gray-800">
              {step.label}
            </span>
          </div>
        ))}
      </div>

      {/* CTA button — pink/rose gradient */}
      <div
        className="mt-3 rounded-xl py-2 text-center text-[10px] font-semibold text-white"
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
