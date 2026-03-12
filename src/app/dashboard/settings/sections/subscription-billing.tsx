"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const WHOP_CHECKOUT_BASE = "https://whop.com/astrevix-io/access2";
const WHOP_MANAGE_URL = "https://whop.com/astrevix-io/access2";

interface SubscriptionBillingProps {
  readonly onToast: (message: string) => void;
  readonly userEmail: string;
  readonly approvedThisMonth: number;
  readonly autoApproveRequested: boolean;
  readonly subscriptionStatus: string;
  readonly subscriptionActivatedAt: string | null;
}

const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" as const },
  }),
};

const SECTION_COLORS = ["#2563EB", "#7c3aed", "#d97706"];

const glassCard = {
  className: "rounded-2xl border border-gray-100 bg-white/70 p-6",
  style: {
    backdropFilter: "blur(12px)",
    boxShadow: "0 4px 24px -4px rgba(37, 99, 235, 0.06)",
  },
};

export default function SubscriptionBilling({
  onToast,
  userEmail,
  approvedThisMonth,
  autoApproveRequested,
  subscriptionStatus,
  subscriptionActivatedAt,
}: SubscriptionBillingProps) {
  const approvedLimit = 100;
  const approvedPercent = Math.min(
    Math.round((approvedThisMonth / approvedLimit) * 100),
    100
  );
  const [autoApprove, setAutoApprove] = useState(autoApproveRequested);
  const [togglingAutoApprove, setTogglingAutoApprove] = useState(false);

  const isActive = subscriptionStatus === "active";
  const checkoutUrl = `${WHOP_CHECKOUT_BASE}?email=${encodeURIComponent(userEmail)}`;

  return (
    <div className="space-y-6">
      {/* Section 0: Current Plan */}
      <motion.section
        custom={0}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className={glassCard.className}
        style={glassCard.style}
      >
        <h3
          className="text-base font-semibold text-gray-900"
          style={{
            paddingLeft: "12px",
            borderLeft: `3px solid ${SECTION_COLORS[0]}`,
          }}
        >
          Current Plan
        </h3>

        {isActive ? (
          <>
            <div className="mt-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold text-gray-900">
                  Pro Plan
                </span>
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                  Active
                </span>
              </div>
            </div>
            {subscriptionActivatedAt && (
              <p className="mt-2 text-sm text-gray-500">
                Activated on{" "}
                {new Date(subscriptionActivatedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            )}
            <div className="mt-4">
              <a
                href={WHOP_MANAGE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border-[1.5px] border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 active:scale-[0.98]"
              >
                Manage Subscription
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </a>
            </div>
          </>
        ) : (
          <>
            <div className="mt-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold text-gray-900">
                  No Active Plan
                </span>
                <span className="inline-flex items-center rounded-full bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-500 ring-1 ring-inset ring-gray-300/50">
                  Inactive
                </span>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Activate your account to unlock all dashboard features.
            </p>
            <div className="mt-4">
              <a
                href={checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border-[1.5px] border-[#2563EB] bg-[#2563EB] px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#1d4ed8] hover:border-[#1d4ed8] active:scale-[0.98]"
              >
                Activate Now
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
            </div>
          </>
        )}
      </motion.section>

      {/* Section 1: Usage */}
      <motion.section
        custom={1}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className={glassCard.className}
        style={glassCard.style}
      >
        <h3
          className="text-base font-semibold text-gray-900"
          style={{
            paddingLeft: "12px",
            borderLeft: `3px solid ${SECTION_COLORS[1]}`,
          }}
        >
          Usage
        </h3>

        <div className="mt-5">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Approved submissions this month
              </span>
              <span className="text-sm text-gray-500">{approvedThisMonth} / {approvedLimit}</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-blue-500 transition-all"
                style={{ width: `${approvedPercent}%` }}
              />
            </div>
          </div>
        </div>
      </motion.section>

      {/* Section 2: Team Review */}
      <motion.section
        custom={2}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className={glassCard.className}
        style={glassCard.style}
      >
        <h3
          className="text-base font-semibold text-gray-900"
          style={{
            paddingLeft: "12px",
            borderLeft: `3px solid ${SECTION_COLORS[2]}`,
          }}
        >
          Team Review
        </h3>

        <div className="mt-5 flex items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-700">
              Let the Astrevix team review and approve submissions on your behalf
            </p>
            <p className="mt-1 text-xs text-gray-400">
              You can still approve or reject submissions yourself at any time.
            </p>
          </div>

          {/* Toggle switch */}
          <button
            type="button"
            role="switch"
            aria-checked={autoApprove}
            disabled={togglingAutoApprove}
            onClick={async () => {
              const newValue = !autoApprove;
              setTogglingAutoApprove(true);
              try {
                const res = await fetch("/api/business/update", {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ auto_approve_requested: newValue }),
                });
                if (res.ok) {
                  setAutoApprove(newValue);
                  onToast(newValue ? "Team review enabled" : "Team review disabled");
                } else {
                  onToast("Failed to update. Please try again.");
                }
              } catch {
                onToast("Failed to update. Please try again.");
              } finally {
                setTogglingAutoApprove(false);
              }
            }}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:ring-offset-2 disabled:opacity-50 ${
              autoApprove ? "bg-amber-500" : "bg-gray-200"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out ${
                autoApprove ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </motion.section>

    </div>
  );
}
