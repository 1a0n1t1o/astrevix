import { notFound } from "next/navigation";
import Image from "next/image";
import { getBusinessBySlug, TIER_PLATFORM_EMOJIS } from "@/lib/data";

const DEFAULT_TERMS = `By submitting content through this page, you agree to the following terms:

1. Reward eligibility is at the sole discretion of the business. Submitting content does not guarantee a reward.
2. Only one reward per person unless otherwise stated. Duplicate or fraudulent submissions may be rejected without notice.
3. Submitted content must be original, publicly posted, and comply with the platform's community guidelines.
4. The business reserves the right to use, share, or repost your submitted content for promotional purposes.
5. Rewards are non-transferable, have no cash value, and may be subject to expiration or additional terms set by the business.
6. The business and Astrevix are not liable for any issues arising from participation, including but not limited to lost rewards or content removal.
7. These terms may be updated at any time. Continued participation constitutes acceptance of any changes.`;

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

  // Show unavailable page if business is suspended
  if (business.status === "suspended") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
          <svg className="h-7 w-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-gray-900">Page Unavailable</h1>
        <p className="mt-2 text-sm text-gray-500">
          This business page is currently unavailable. Please check back later.
        </p>
      </div>
    );
  }

  const hasLogo = !!business.logoUrl;

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

      {/* Business logo (only if logo_url exists) */}
      {hasLogo && (
        <div className="mt-6 flex justify-center">
          <Image
            src={business.logoUrl!}
            alt={business.name}
            width={64}
            height={64}
            className="rounded-2xl object-cover shadow-md"
            style={{ width: "64px", height: "64px" }}
          />
        </div>
      )}

      {/* Business name + tagline */}
      <div className={`${hasLogo ? "mt-4" : "mt-8"} text-center`}>
        <h1
          className="font-bold text-foreground"
          style={{ fontSize: hasLogo ? "24px" : "36px" }}
        >
          {business.name}
        </h1>
        {business.tagline && (
          <p className="mt-1 text-sm text-gray-500">{business.tagline}</p>
        )}
      </div>

      {/* Reward section — tiers or single card */}
      {business.rewardTiers.length > 0 ? (
        <div className="mt-6 space-y-3">
          <p
            className="text-center text-xs font-semibold uppercase tracking-widest"
            style={{ color: business.brandColor }}
          >
            Choose Your Reward
          </p>
          {business.rewardTiers.map((tier, i) => (
            <a
              key={tier.id}
              href={`/b/${business.slug}/submit?tier=${tier.id}`}
              className="block transition-transform active:scale-[0.98]"
            >
              <div
                className="relative overflow-hidden rounded-[20px] px-5 py-5"
                style={{
                  background: i === 0 ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.6)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: i === 0
                    ? `2px solid ${business.brandColor}40`
                    : "1px solid rgba(255,255,255,0.4)",
                  boxShadow: i === 0
                    ? `0 8px 24px ${business.brandColor}15`
                    : "0 4px 16px rgba(0,0,0,0.04)",
                }}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">
                    {TIER_PLATFORM_EMOJIS[tier.platform] || "🎁"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-500">
                      {tier.tier_name}
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      {tier.reward_description}
                    </p>
                    {tier.reward_value && (
                      <span
                        className="mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold"
                        style={{
                          backgroundColor: `${business.brandColor}15`,
                          color: business.brandColor,
                        }}
                      >
                        {tier.reward_value}
                      </span>
                    )}
                  </div>
                  <svg className="h-5 w-5 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </div>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="relative mt-6">
          <div
            className="absolute inset-0 rounded-[20px] opacity-20 blur-xl"
            style={{ backgroundColor: business.brandColor }}
          />
          <div
            className="relative overflow-hidden rounded-[20px] px-6 py-8 text-center"
            style={{
              background: "rgba(255,255,255,0.6)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.4)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.5)",
            }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: business.brandColor }}
            >
              Your Reward
            </p>
            <p className="mt-3 text-2xl font-bold text-gray-900">
              {business.reward}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Create a {business.contentType}
            </p>
          </div>
        </div>
      )}

      {/* How it works */}
      <div className="mt-8">
        <h2 className="text-lg font-bold text-gray-900">How it works</h2>
        <p className="mt-1 text-sm text-gray-500">
          Create a {business.contentType.toLowerCase()} about your experience
          and earn your reward.
        </p>
        <div className="mt-5 space-y-3">
          {STEPS.map((step) => (
            <div
              key={step.num}
              className="flex items-start gap-4 rounded-xl bg-white p-4 shadow-sm"
            >
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-bold"
                style={{ backgroundColor: "rgba(0,0,0,0.04)", color: "#1a1a1a", fontSize: "14px" }}
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
          ))}
        </div>
      </div>

      {/* Requirements */}
      {business.requirements.length > 0 && (
        <div
          className="mt-8 rounded-2xl p-5"
          style={{ backgroundColor: "#F7F5F2", border: "1px solid #EDEAE6" }}
        >
          <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
            <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            Requirements
          </h2>
          <ul className="mt-3 space-y-3">
            {business.requirements.map((req) => (
              <li key={req} className="flex items-start gap-3 text-sm">
                <div className="mt-0.5 h-5 w-5 shrink-0 rounded-md border-[1.5px] border-gray-300" />
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

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
      <p className="mt-3 text-center text-xs text-gray-400">
        Rewards issued after review. Usually within 24 hours.
      </p>

      {/* Legal links */}
      <div className="mt-2 flex justify-center gap-3 text-[11px] text-gray-400">
        <a href="/privacy" target="_blank" className="underline hover:text-gray-600">Privacy Policy</a>
        <span>&middot;</span>
        <a href="/terms" target="_blank" className="underline hover:text-gray-600">Terms &amp; Conditions</a>
      </div>

      {/* Terms & Conditions */}
      <details className="group mt-6 mb-4">
        <summary className="flex cursor-pointer items-center justify-center gap-1.5 text-xs font-medium text-gray-400 transition-colors hover:text-gray-600">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          Terms & Conditions
          <svg className="h-3 w-3 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </summary>
        <div className="mt-3 rounded-xl bg-gray-50 p-4 text-[11px] leading-relaxed text-gray-500" style={{ border: "1px solid #EDEAE6" }}>
          {(business.termsConditions || DEFAULT_TERMS).split("\n").map((line, i) => (
            <p key={i} className={line.trim() === "" ? "h-2" : ""}>{line}</p>
          ))}
        </div>
      </details>
    </>
  );
}
