"use client";

import { motion } from "framer-motion";

interface SubscriptionBillingProps {
  readonly onToast: (message: string) => void;
}

const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" as const },
  }),
};

const SECTION_COLORS = ["#2563EB", "#7c3aed", "#059669", "#d97706"];

const glassCard = {
  className: "rounded-2xl border border-gray-100 bg-white/70 p-6",
  style: {
    backdropFilter: "blur(12px)",
    boxShadow: "0 4px 24px -4px rgba(37, 99, 235, 0.06)",
  },
};

export default function SubscriptionBilling({
  onToast: _onToast,
}: SubscriptionBillingProps) {
  {/* TODO: Wire up to Stripe Customer Portal */}

  return (
    <div className="space-y-6">
      {/* Section 0: Current Plan */}
      {/* TODO: Wire up to Stripe Customer Portal */}
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
          {/* TODO: Wire up to Stripe Customer Portal */}
          <button
            type="button"
            disabled
            className="rounded-xl border-[1.5px] border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-400 cursor-not-allowed opacity-60"
            title="Coming soon"
          >
            Manage Subscription
          </button>
          <p className="mt-1.5 text-xs text-gray-400">Coming soon</p>
        </div>
      </motion.section>

      {/* Section 1: Usage */}
      {/* TODO: Wire up to Stripe Customer Portal */}
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

        <div className="mt-5 space-y-5">
          {/* Submissions this month */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Submissions this month
              </span>
              <span className="text-sm text-gray-500">12 / 100</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100">
              {/* TODO: Wire up to Stripe Customer Portal */}
              <div
                className="h-full rounded-full bg-blue-500 transition-all"
                style={{ width: "12%" }}
              />
            </div>
          </div>

          {/* Active QR codes */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Active QR codes
              </span>
              <span className="text-sm text-gray-500">1 / 3</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100">
              {/* TODO: Wire up to Stripe Customer Portal */}
              <div
                className="h-full rounded-full bg-purple-500 transition-all"
                style={{ width: "33%" }}
              />
            </div>
          </div>
        </div>
      </motion.section>

      {/* Section 2: Payment Method */}
      {/* TODO: Wire up to Stripe Customer Portal */}
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
          Payment Method
        </h3>

        <p className="mt-5 text-sm text-gray-500">
          No payment method on file
        </p>

        <div className="mt-4">
          {/* TODO: Wire up to Stripe Customer Portal */}
          <button
            type="button"
            disabled
            className="rounded-xl border-[1.5px] border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-400 cursor-not-allowed opacity-60"
            title="Coming soon"
          >
            Add payment method
          </button>
        </div>
      </motion.section>

      {/* Section 3: Billing History */}
      {/* TODO: Wire up to Stripe Customer Portal */}
      <motion.section
        custom={3}
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
            borderLeft: `3px solid ${SECTION_COLORS[3]}`,
          }}
        >
          Billing History
        </h3>

        <div className="mt-5 overflow-x-auto">
          {/* TODO: Wire up to Stripe Customer Portal */}
          <table className="w-full min-w-[420px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Date
                </th>
                <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Description
                </th>
                <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Amount
                </th>
                <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {/* TODO: Wire up to Stripe Customer Portal */}
              <tr>
                <td className="py-3 text-sm text-gray-700">Mar 1, 2026</td>
                <td className="py-3 text-sm text-gray-700">Free plan</td>
                <td className="py-3 text-sm text-gray-700">$0.00</td>
                <td className="py-3">
                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                    Active
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3 text-sm text-gray-700">Feb 1, 2026</td>
                <td className="py-3 text-sm text-gray-700">Free plan</td>
                <td className="py-3 text-sm text-gray-700">$0.00</td>
                <td className="py-3">
                  <span className="inline-flex items-center rounded-full bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                    Completed
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3 text-sm text-gray-700">Jan 1, 2026</td>
                <td className="py-3 text-sm text-gray-700">Free plan</td>
                <td className="py-3 text-sm text-gray-700">$0.00</td>
                <td className="py-3">
                  <span className="inline-flex items-center rounded-full bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                    Completed
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.section>
    </div>
  );
}
