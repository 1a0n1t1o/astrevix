"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Info } from "lucide-react";
import type { Business } from "@/types/database";

interface QrNfcDefaultsProps {
  readonly business: Business;
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

const SECTION_COLOR = "#2563EB";

const INPUT_CLASS =
  "w-full rounded-xl border-[1.5px] border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20";

const glassCard = {
  className: "rounded-2xl border border-gray-100 bg-white/70 p-6",
  style: {
    backdropFilter: "blur(12px)",
    boxShadow: "0 4px 24px -4px rgba(37, 99, 235, 0.06)",
  },
};

const FALLBACK_OPTIONS = [
  { value: "landing_page", label: "Landing page" },
  { value: "website_url", label: "Website URL" },
  { value: "custom_url", label: "Custom URL" },
];

export default function QrNfcDefaults({
  business,
  onToast,
}: QrNfcDefaultsProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [redirectUrl, setRedirectUrl] = useState(
    business.qr_default_redirect_url || ""
  );
  const [fallback, setFallback] = useState(
    business.qr_default_fallback || "landing_page"
  );
  const [autoBranding, setAutoBranding] = useState(
    business.qr_default_branding !== false
  );

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/settings/qr-defaults", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          qr_default_redirect_url: redirectUrl || null,
          qr_default_fallback: fallback,
          qr_default_branding: autoBranding,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Failed to save");
      }

      onToast("QR/NFC defaults saved");
      router.refresh();
    } catch (err) {
      onToast(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Section 0: QR/NFC Defaults */}
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
          style={{ paddingLeft: "12px", borderLeft: `3px solid ${SECTION_COLOR}` }}
        >
          QR/NFC Defaults
        </h3>

        {/* Info note */}
        <div className="mt-5 flex items-start gap-3 rounded-xl bg-blue-50 border border-blue-100 p-4">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
          <p className="text-sm text-blue-700">
            These defaults apply to all newly created QR codes and NFC tags. You
            can override them per campaign.
          </p>
        </div>

        <div className="mt-5 space-y-4">
          {/* Default redirect URL */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Default Redirect URL
            </label>
            <input
              type="text"
              value={redirectUrl}
              onChange={(e) => setRedirectUrl(e.target.value)}
              placeholder="https://yourbusiness.com/menu"
              className={INPUT_CLASS}
            />
          </div>

          {/* Default fallback behavior */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Default Fallback Behavior
            </label>
            <select
              value={fallback}
              onChange={(e) => setFallback(e.target.value)}
              className={INPUT_CLASS}
            >
              {FALLBACK_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Default branding toggle */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Auto-apply branding
              </label>
              <p className="mt-0.5 text-sm text-gray-500">
                Automatically apply your business logo and brand colors to newly
                created QR codes
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={autoBranding}
              aria-label="Auto-apply branding"
              onClick={() => setAutoBranding(!autoBranding)}
              className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                autoBranding ? "bg-green-500" : "bg-gray-200"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                  autoBranding ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </motion.section>

      {/* Save Button */}
      <motion.button
        whileHover={{
          scale: 1.01,
          boxShadow: "0 12px 28px -4px rgba(37, 99, 235, 0.35)",
        }}
        whileTap={{ scale: 0.99 }}
        disabled={saving}
        onClick={handleSave}
        className="w-full rounded-xl bg-gradient-to-r from-[#2563EB] to-[#7C3AED] py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving ? (
          <span className="flex items-center justify-center gap-2">
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Saving...
          </span>
        ) : (
          "Save QR/NFC Defaults"
        )}
      </motion.button>
    </div>
  );
}
