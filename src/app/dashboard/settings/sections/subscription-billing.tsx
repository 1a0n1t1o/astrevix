"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WhopCheckoutEmbed } from "@whop/checkout/react";

interface SubscriptionBillingProps {
  readonly onToast: (message: string) => void;
  readonly userEmail: string;
  readonly approvedThisMonth: number;
  readonly autoApproveRequested: boolean;
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
  className: "rounded-2xl border p-6",
  style: {
    backdropFilter: "blur(12px)",
    boxShadow: "0 4px 24px -4px rgba(37, 99, 235, 0.06)",
    backgroundColor: "var(--dash-card-bg)",
    borderColor: "var(--dash-card-border)",
  },
};

export default function SubscriptionBilling({
  onToast,
  userEmail,
  approvedThisMonth,
  autoApproveRequested,
}: SubscriptionBillingProps) {
  const approvedLimit = 100;
  const approvedPercent = Math.min(
    Math.round((approvedThisMonth / approvedLimit) * 100),
    100
  );
  const [showCheckout, setShowCheckout] = useState(false);
  const [autoApprove, setAutoApprove] = useState(autoApproveRequested);
  const [togglingAutoApprove, setTogglingAutoApprove] = useState(false);

  return (
    <div className="space-y-6">
      {/* Whop Checkout Modal Overlay */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setShowCheckout(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative mx-4 w-full max-w-lg overflow-hidden rounded-2xl shadow-2xl"
              style={{ backgroundColor: "var(--dash-surface)" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b px-6 py-4" style={{ borderColor: "var(--dash-card-border)" }}>
                <h3 className="text-lg font-semibold" style={{ color: "var(--dash-text)" }}>
                  Upgrade Plan
                </h3>
                <button
                  onClick={() => setShowCheckout(false)}
                  className="rounded-lg p-1.5 transition-colors"
                  style={{ color: "var(--dash-text-muted)" }}
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Whop Checkout Embed */}
              <div className="p-6">
                <WhopCheckoutEmbed
                  planId="plan_hiFPI4u5kBSZD"
                  theme="light"
                  prefill={{ email: userEmail }}
                  disableEmail={true}
                  returnUrl="https://astrevix.com/dashboard/settings?status=success"
                  onComplete={() => {
                    setShowCheckout(false);
                  }}
                  fallback={
                    <div className="flex items-center justify-center py-12">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-[#2563EB]" />
                    </div>
                  }
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
          className="text-base font-semibold"
          style={{
            paddingLeft: "12px",
            borderLeft: `3px solid ${SECTION_COLORS[0]}`,
            color: "var(--dash-text)",
          }}
        >
          Current Plan
        </h3>

        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold" style={{ color: "var(--dash-text)" }}>
              Free Plan
            </span>
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
              Active
            </span>
          </div>
        </div>

        <p className="mt-2 text-sm" style={{ color: "var(--dash-text-secondary)" }}>
          You&apos;re on the free plan with basic features.
        </p>

        <div className="mt-4">
          <button
            type="button"
            onClick={() => setShowCheckout(true)}
            className="rounded-xl border-[1.5px] border-[#2563EB] bg-[#2563EB] px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#1d4ed8] hover:border-[#1d4ed8] active:scale-[0.98]"
          >
            Upgrade Plan
          </button>
        </div>
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
          className="text-base font-semibold"
          style={{
            paddingLeft: "12px",
            borderLeft: `3px solid ${SECTION_COLORS[1]}`,
            color: "var(--dash-text)",
          }}
        >
          Usage
        </h3>

        <div className="mt-5">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium" style={{ color: "var(--dash-text-secondary)" }}>
                Approved submissions this month
              </span>
              <span className="text-sm" style={{ color: "var(--dash-text-secondary)" }}>{approvedThisMonth} / {approvedLimit}</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full" style={{ backgroundColor: "var(--dash-hover)" }}>
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
          className="text-base font-semibold"
          style={{
            paddingLeft: "12px",
            borderLeft: `3px solid ${SECTION_COLORS[2]}`,
            color: "var(--dash-text)",
          }}
        >
          Team Review
        </h3>

        <div className="mt-5 flex items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm font-medium" style={{ color: "var(--dash-text-secondary)" }}>
              Let the Astrevix team review and approve submissions on your behalf
            </p>
            <p className="mt-1 text-xs" style={{ color: "var(--dash-text-muted)" }}>
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
