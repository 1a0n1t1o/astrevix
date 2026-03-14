import { notFound } from "next/navigation";
import Image from "next/image";
import { getBusinessBySlug } from "@/lib/data";
import { Camera, Video, Gift, ChevronRight } from "lucide-react";

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

const TIER_ICONS: Record<string, React.ReactNode> = {
  instagram: <Camera className="h-5 w-5" />,
  tiktok: <Video className="h-5 w-5" />,
};

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
  const dk = business.darkMode;

  return (
    <>
      {/* Powered by badge */}
      <div className="flex justify-center">
        <div
          className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5"
          style={{ fontSize: "10px", color: dk ? "#64748b" : "#B0B0BA", letterSpacing: "0.01em" }}
        >
          Powered by <span className="font-medium" style={{ color: dk ? "#94a3b8" : "#9090A0" }}>Astrevix</span>
        </div>
      </div>

      {/* Business logo */}
      {hasLogo && (
        <div className="mt-6 flex justify-center">
          <Image
            src={business.logoUrl!}
            alt={business.name}
            width={176}
            height={88}
            quality={100}
            unoptimized
            className="rounded-2xl shadow-md"
            style={{ height: "88px", width: "auto", objectFit: "contain" }}
          />
        </div>
      )}

      {/* Business name + tagline */}
      <div className={`${hasLogo ? "mt-4" : "mt-8"} text-center`}>
        <h1
          className="font-bold"
          style={{ fontSize: hasLogo ? "24px" : "36px", color: dk ? "#f1f5f9" : "#1a1a1a" }}
        >
          {business.name}
        </h1>
        {business.tagline && (
          <p className="mt-1 text-sm" style={{ color: dk ? "#94a3b8" : "#6b7280" }}>{business.tagline}</p>
        )}
      </div>

      {/* Reward section — tiers or single card */}
      {business.rewardTiers.length > 0 ? (
        <div className="mt-6 space-y-2.5">
          <p
            className="text-center text-[11px] font-semibold uppercase tracking-widest"
            style={{ color: business.brandColor }}
          >
            Choose Your Reward
          </p>
          {business.rewardTiers.map((tier) => (
            <a
              key={tier.id}
              href={`/b/${business.slug}/submit?tier=${tier.id}`}
              className="group block transition-all active:scale-[0.98]"
            >
              <div
                className="overflow-hidden rounded-2xl px-4 py-4 transition-shadow group-hover:shadow-md"
                style={{
                  background: dk ? "rgba(26, 29, 39, 0.7)" : "rgba(255,255,255,0.85)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: dk ? "1px solid rgba(55, 65, 81, 0.4)" : "1px solid rgba(0,0,0,0.06)",
                  borderLeft: `3px solid ${business.brandColor}`,
                  boxShadow: dk ? "0 4px 16px rgba(0, 0, 0, 0.2)" : undefined,
                }}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${business.brandColor}18`, color: business.brandColor }}
                  >
                    {TIER_ICONS[tier.platform] || <Gift className="h-5 w-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-medium uppercase tracking-wide" style={{ color: dk ? "#64748b" : "#9ca3af" }}>
                      {tier.tier_name}
                    </p>
                    <p className="mt-0.5 text-base font-bold" style={{ color: dk ? "#f1f5f9" : "#111827" }}>
                      {tier.reward_description}
                    </p>
                    {tier.reward_value && (
                      <span
                        className="mt-1 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                        style={{
                          backgroundColor: `${business.brandColor}18`,
                          color: business.brandColor,
                        }}
                      >
                        {tier.reward_value}
                      </span>
                    )}
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" style={{ color: dk ? "#4b5563" : "#d1d5db" }} />
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
              background: dk ? "rgba(26, 29, 39, 0.7)" : "rgba(255,255,255,0.6)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: dk ? "1px solid rgba(55, 65, 81, 0.4)" : "1px solid rgba(255,255,255,0.4)",
              boxShadow: dk ? "0 4px 16px rgba(0, 0, 0, 0.2)" : "0 8px 32px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.5)",
            }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: business.brandColor }}
            >
              Your Reward
            </p>
            <p className="mt-3 text-2xl font-bold" style={{ color: dk ? "#f1f5f9" : "#111827" }}>
              {business.reward}
            </p>
            <p className="mt-2 text-sm" style={{ color: dk ? "#94a3b8" : "#6b7280" }}>
              Create a {business.contentType}
            </p>
          </div>
        </div>
      )}

      {/* How it works */}
      <div className="mt-8">
        <h2 className="text-lg font-bold" style={{ color: dk ? "#f1f5f9" : "#111827" }}>How it works</h2>
        <div className="mt-5">
          {STEPS.map((step, i) => (
            <div key={step.num} className="flex gap-3.5">
              <div className="flex flex-col items-center">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: business.brandColor }}
                >
                  {step.num}
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className="my-1 flex-1 w-0.5 rounded-full"
                    style={{ backgroundColor: dk ? "rgba(55, 65, 81, 0.4)" : `${business.brandColor}20` }}
                  />
                )}
              </div>
              <div className={i < STEPS.length - 1 ? "pb-5 pt-1" : "pt-1"}>
                <p className="text-sm font-semibold" style={{ color: dk ? "#f1f5f9" : "#111827" }}>{step.label}</p>
                <p className="mt-0.5 text-[13px]" style={{ color: dk ? "#64748b" : "#9ca3af" }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Requirements */}
      {business.requirements.length > 0 && (
        <div
          className="mt-8 rounded-2xl p-5"
          style={{
            backgroundColor: dk ? "#1a1d27" : "#F7F5F2",
            border: dk ? "1px solid rgba(55, 65, 81, 0.4)" : "1px solid #EDEAE6",
            boxShadow: dk ? "0 4px 16px rgba(0, 0, 0, 0.15)" : undefined,
          }}
        >
          <h2 className="flex items-center gap-2 text-lg font-bold" style={{ color: dk ? "#f1f5f9" : "#111827" }}>
            <svg className="h-5 w-5" style={{ color: dk ? "#94a3b8" : "#6b7280" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            Requirements
          </h2>
          <ul className="mt-3 space-y-3">
            {business.requirements.map((req) => (
              <li key={req} className="flex items-start gap-3 text-sm">
                <div
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md"
                  style={{ border: `1.5px solid ${business.brandColor}40` }}
                >
                  <svg
                    className="h-3 w-3"
                    style={{ color: business.brandColor }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <span style={{ color: dk ? "#94a3b8" : undefined }}>{req}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* CTA button */}
      <a
        href={`/b/${business.slug}/submit`}
        className="mt-8 block w-full rounded-2xl bg-brand py-4 text-center text-base font-semibold text-white transition-all hover:brightness-110 active:scale-[0.98]"
        style={{
          boxShadow: dk ? `0 8px 24px ${business.brandColor}50` : `0 8px 24px ${business.brandColor}40`,
        }}
      >
        Submit Your Post &rarr;
      </a>

      {/* Footer note */}
      <p className="mt-3 text-center text-xs" style={{ color: dk ? "#64748b" : "#9ca3af" }}>
        Rewards issued after review. Usually within 24 hours.
      </p>

      {/* Terms & Conditions */}
      <details className="group mt-4 mb-2">
        <summary className="flex cursor-pointer items-center justify-center gap-1.5 text-xs font-medium transition-colors" style={{ color: dk ? "#64748b" : "#9ca3af" }}>
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          Terms & Conditions
          <svg className="h-3 w-3 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </summary>
        <div
          className="mt-3 rounded-xl p-4 text-[11px] leading-relaxed"
          style={{
            backgroundColor: dk ? "#141620" : "#f9fafb",
            color: dk ? "#94a3b8" : "#6b7280",
            border: dk ? "1px solid rgba(55, 65, 81, 0.4)" : "1px solid #EDEAE6",
          }}
        >
          {(business.termsConditions || DEFAULT_TERMS).split("\n").map((line, i) => (
            <p key={i} className={line.trim() === "" ? "h-2" : ""}>{line}</p>
          ))}
        </div>
      </details>

      {/* Legal links */}
      <div className="mb-4 flex justify-center gap-3 text-[10px]" style={{ color: dk ? "#64748b" : "#9ca3af" }}>
        <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">Privacy Policy</a>
        <span>&middot;</span>
        <a href="/terms" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">Terms</a>
      </div>
    </>
  );
}
