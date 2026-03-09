"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WhopCheckoutEmbed } from "@whop/checkout/react";

interface SubscriptionBillingProps {
  readonly onToast: (message: string) => void;
  readonly userEmail: string;
  readonly approvedThisMonth: number;
}

const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" as const },
  }),
};

const SECTION_COLORS = ["#2563EB", "#7c3aed"];

const glassCard = {
  className: "rounded-2xl border border-gray-100 bg-white/70 p-6",
  style: {
    backdropFilter: "blur(12px)",
    boxShadow: "0 4px 24px -4px rgba(37, 99, 235, 0.06)",
  },
};

export default function SubscriptionBilling({
  onToast: _onToast,
  userEmail,
  approvedThisMonth,
}: SubscriptionBillingProps) {
  const approvedLimit = 100;
  const approvedPercent = Math.min(
    Math.round((approvedThisMonth / approvedLimit) * 100),
    100
  );
  const [showCheckout, setShowCheckout] = useState(false);

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
              className="relative mx-4 w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Upgrade Plan
                </h3>
                <button
                  onClick={() => setShowCheckout(false)}
                  className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
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
          className="text-base font-semibold text-gray-900"
          style={{
            paddingLeft: "12px",
            borderLeft: `3px solid ${SECTION_COLORS[0]}`,
          }}
        >
          Current Plan
        </h3>

        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold text-gray-900">
              Free Plan
            </span>
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
              Active
            </span>
          </div>
        </div>

        <p className="mt-2 text-sm text-gray-500">
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

    </div>
  );
}
