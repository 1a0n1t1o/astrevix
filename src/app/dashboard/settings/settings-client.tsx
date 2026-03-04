"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, CreditCard } from "lucide-react";
import type { Business, UserProfile } from "@/types/database";
import AccountProfile from "./sections/account-profile";
import SubscriptionBilling from "./sections/subscription-billing";

type SettingsTab = "account" | "subscription";

const SETTINGS_TABS: {
  id: SettingsTab;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "account",
    label: "Account & Profile",
    icon: <User className="h-4.5 w-4.5" />,
  },
  {
    id: "subscription",
    label: "Subscription & Billing",
    icon: <CreditCard className="h-4.5 w-4.5" />,
  },
];

interface SettingsClientProps {
  readonly business: Business;
  readonly userEmail: string;
  readonly userProfile: UserProfile;
}

export default function SettingsClient({
  userEmail,
  userProfile,
}: SettingsClientProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>("account");
  const [toast, setToast] = useState<string | null>(null);

  function showToast(message: string) {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  }

  return (
    <>
      {/* Toast notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium text-white shadow-lg ${
              toast.includes("Failed") || toast.includes("failed") || toast.includes("incorrect")
                ? "bg-red-500"
                : "bg-emerald-500"
            }`}
          >
            {toast.includes("Failed") || toast.includes("failed") || toast.includes("incorrect") ? (
              <svg
                className="h-4 w-4"
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
            ) : (
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
            )}
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        {/* Left side — Vertical tab nav (desktop) / Horizontal tabs (mobile) */}
        <div>
          {/* Desktop: vertical tabs */}
          <nav
            className="hidden rounded-2xl border border-gray-100 bg-white/70 p-2 lg:block"
            style={{
              backdropFilter: "blur(12px)",
              boxShadow: "0 4px 24px -4px rgba(37, 99, 235, 0.06)",
            }}
          >
            <div className="space-y-1">
              {SETTINGS_TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                      isActive
                        ? "text-[#2563EB]"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="settings-tab-indicator"
                        className="absolute inset-0 rounded-xl"
                        style={{
                          background:
                            "linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)",
                          zIndex: -1,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 350,
                          damping: 30,
                        }}
                      />
                    )}
                    {isActive && (
                      <motion.div
                        layoutId="settings-tab-bar"
                        className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-[#2563EB]"
                        transition={{
                          type: "spring",
                          stiffness: 350,
                          damping: 30,
                        }}
                      />
                    )}
                    {tab.icon}
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Mobile: horizontal scrollable tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 lg:hidden">
            {SETTINGS_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "text-white"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="settings-tab-indicator-mobile"
                      className="absolute inset-0 rounded-xl bg-[#2563EB]"
                      style={{ zIndex: -1 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  {tab.icon}
                  <span className="whitespace-nowrap">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right side — Active section content */}
        <div className="min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {activeTab === "account" && (
                <AccountProfile
                  userProfile={userProfile}
                  userEmail={userEmail}
                  onToast={showToast}
                />
              )}
              {activeTab === "subscription" && (
                <SubscriptionBilling onToast={showToast} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
