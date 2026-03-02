import { notFound } from "next/navigation";
import { getBusinessBySlug } from "@/lib/data";

const STEPS = [
  {
    num: "1",
    label: "Create your content",
    desc: "Film a short video about your experience here",
  },
  {
    num: "2",
    label: "Post it publicly",
    desc: "Share it on your TikTok or Instagram",
  },
  {
    num: "3",
    label: "Submit your link",
    desc: "Paste your post link — takes 10 seconds",
  },
  {
    num: "4",
    label: "Get rewarded",
    desc: "Receive your reward after approval",
  },
];

export default async function BusinessPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);
  if (!business) notFound();

  return (
    <>
      {/* Powered by badge */}
      <div className="flex justify-center">
        <div
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1"
          style={{ backgroundColor: "rgba(0,0,0,0.04)", fontSize: "11px", color: "#8B8B9B" }}
        >
          Powered by <span className="font-semibold" style={{ color: "#6B6B7B" }}>Astrevix</span>
        </div>
      </div>

      {/* Business logo */}
      <div className="mt-6 flex justify-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white text-4xl shadow-md">
          {business.logo}
        </div>
      </div>

      {/* Business name + tagline */}
      <div className="mt-4 text-center">
        <h1 className="font-serif text-2xl font-bold text-foreground">
          {business.name}
        </h1>
        <p className="mt-1 text-sm text-gray-500">{business.tagline}</p>
      </div>

      {/* Reward card */}
      <div className="relative mt-6 overflow-hidden rounded-2xl bg-brand px-6 py-8 text-center text-white">
        <div
          className="absolute -right-5 -top-5 h-[100px] w-[100px] rounded-full"
          style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
        />
        <div
          className="absolute -bottom-4 -left-4 h-[70px] w-[70px] rounded-full"
          style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
        />
        <p className="relative text-xs font-semibold uppercase tracking-widest opacity-90">
          🎁 Your Reward
        </p>
        <p className="relative mt-3 font-serif text-2xl font-bold">
          {business.reward}
        </p>
        <p className="relative mt-2 text-sm opacity-80">
          Create a {business.contentType}
        </p>
      </div>

      {/* How it works */}
      <div className="mt-8">
        <h2 className="font-serif text-lg font-bold">How it works</h2>
        <p className="mt-1 text-sm text-gray-500">
          Create a {business.contentType.toLowerCase()} about your experience
          and earn your reward.
        </p>
        <div className="mt-5 space-y-3">
          {STEPS.map((step) => {
            const isLast = step.num === "4";
            return (
              <div
                key={step.num}
                className="flex items-start gap-4 rounded-xl bg-white p-4 shadow-sm"
              >
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-bold"
                  style={
                    isLast
                      ? { backgroundColor: business.brandColor, color: "#fff", fontSize: "14px" }
                      : { backgroundColor: "rgba(0,0,0,0.04)", color: "#1a1a1a", fontSize: "14px" }
                  }
                >
                  {step.num}
                </div>
                <div>
                  <p className="text-sm font-medium">{step.label}</p>
                  <p style={{ fontSize: "13px", color: "#8B8B9B" }} className="mt-0.5">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Requirements */}
      <div
        className="mt-8 rounded-2xl p-5"
        style={{ backgroundColor: "#F7F5F2", border: "1px solid #EDEAE6" }}
      >
        <h2 className="font-serif text-lg font-bold">📋 Requirements</h2>
        <ul className="mt-3 space-y-3">
          {business.requirements.map((req) => (
            <li key={req} className="flex items-start gap-3 text-sm">
              <div className="mt-0.5 h-5 w-5 shrink-0 rounded-md border-[1.5px] border-gray-300" />
              <span>{req}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA button */}
      <a
        href={`/b/${business.slug}/submit`}
        className="mt-8 block w-full rounded-2xl bg-brand py-4 text-center text-base font-semibold text-white transition-transform active:scale-[0.98]"
        style={{
          boxShadow: `0 8px 24px ${business.brandColor}66`,
        }}
      >
        Submit Your Post &rarr;
      </a>

      {/* Footer note */}
      <p className="mt-3 pb-4 text-center text-xs text-gray-400">
        Rewards issued after review. Usually within 24 hours.
      </p>
    </>
  );
}
