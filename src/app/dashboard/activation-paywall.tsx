"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

const WHOP_CHECKOUT_BASE = "https://whop.com/astrevix-io/access2";

const FEATURES = [
  {
    label: "Manage Submissions",
    description: "Review, approve, and track customer content",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z" />
      </svg>
    ),
  },
  {
    label: "Customize Page",
    description: "Brand your landing page with your colors and logo",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z" />
      </svg>
    ),
  },
  {
    label: "Send Rewards",
    description: "Issue coupon codes and SMS rewards automatically",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
  },
  {
    label: "Customer Insights",
    description: "Track your top creators and engagement stats",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
  },
];

interface ActivationPaywallProps {
  readonly userEmail: string;
  readonly businessName: string;
}

export default function ActivationPaywall({ userEmail, businessName }: ActivationPaywallProps) {
  const router = useRouter();
  const [checking, setChecking] = useState(false);

  const checkoutUrl = `${WHOP_CHECKOUT_BASE}?email=${encodeURIComponent(userEmail)}`;

  const checkStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/subscription/status");
      if (!res.ok) return;
      const data = await res.json();
      if (data.subscription_status === "active") {
        router.refresh();
      }
    } catch {
      // Silently fail on polling errors
    }
  }, [router]);

  // Poll every 10 seconds
  useEffect(() => {
    const interval = setInterval(checkStatus, 10000);
    return () => clearInterval(interval);
  }, [checkStatus]);

  async function handleRefresh() {
    setChecking(true);
    await checkStatus();
    setChecking(false);
  }

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center">
      {/* Activation Card */}
      <div
        className="w-full max-w-2xl rounded-2xl border border-blue-100 p-8 text-center sm:p-12"
        style={{
          background: "linear-gradient(135deg, #eff6ff 0%, #e0e7ff 50%, #ede9fe 100%)",
          boxShadow: "0 8px 32px -8px rgba(37, 99, 235, 0.15), 0 0 0 1px rgba(37, 99, 235, 0.05)",
        }}
      >
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#2563EB]/10">
          <svg className="h-8 w-8 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Activate Your Astrevix Account
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-gray-600 sm:text-base">
          Complete your subscription to unlock your full dashboard — manage submissions, customize your page, send rewards, and more.
        </p>

        {/* Feature Grid */}
        <div className="mx-auto mt-8 grid max-w-lg grid-cols-1 gap-4 text-left sm:grid-cols-2">
          {FEATURES.map((feature) => (
            <div
              key={feature.label}
              className="flex items-start gap-3 rounded-xl bg-white/60 px-4 py-3"
              style={{ backdropFilter: "blur(8px)" }}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#2563EB]/10 text-[#2563EB]">
                {feature.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{feature.label}</p>
                <p className="mt-0.5 text-xs text-gray-500">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-8">
          <a
            href={checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-[#1d4ed8] hover:shadow-blue-500/40 active:scale-[0.98]"
          >
            Activate Now
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </div>

        {/* Refresh status */}
        <div className="mt-6">
          <button
            onClick={handleRefresh}
            disabled={checking}
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-[#2563EB] disabled:opacity-50"
          >
            <svg className={`h-4 w-4 ${checking ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
            </svg>
            {checking ? "Checking..." : "Already subscribed? Click here to refresh your status."}
          </button>
        </div>
      </div>

      <p className="mt-4 text-xs text-gray-400">
        Welcome, {businessName}. Your settings page is available while you set up.
      </p>
    </div>
  );
}
