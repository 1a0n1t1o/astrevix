import { notFound } from "next/navigation";
import { getBusinessBySlug } from "@/lib/data";

const STEPS = [
  { num: "1", label: "Create your content" },
  { num: "2", label: "Post it publicly" },
  { num: "3", label: "Submit your link" },
  { num: "4", label: "Get rewarded" },
];

export default async function BusinessPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const business = getBusinessBySlug(slug);
  if (!business) notFound();

  return (
    <>
      {/* Powered by badge */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500">
          <span>⚡</span>
          Powered by <span className="font-semibold">Astrevix</span>
        </div>
      </div>

      {/* Hero section with gradient */}
      <div
        className="-mx-5 mt-4 rounded-3xl px-5 pb-8 pt-6"
        style={{
          background: `linear-gradient(to bottom, ${business.brandColor}1A, #FEFCFA)`,
        }}
      >
        {/* Business logo */}
        <div className="flex justify-center">
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
          <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/15" />
          <div className="absolute -bottom-6 -left-6 h-20 w-20 rounded-full bg-white/15" />
          <div className="absolute right-12 bottom-3 h-12 w-12 rounded-full bg-white/10" />
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
                className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm"
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                    isLast
                      ? "bg-brand text-white"
                      : "bg-brand/10 text-brand"
                  }`}
                >
                  {step.num}
                </div>
                <p className="text-sm font-medium">{step.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Requirements */}
      <div className="mt-8">
        <h2 className="font-serif text-lg font-bold">Requirements</h2>
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
