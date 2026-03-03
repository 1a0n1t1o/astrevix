"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import type { Business } from "@/types/database";

const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" as const },
  }),
};

const SECTION_COLORS = ["#2563EB", "#7c3aed", "#059669", "#d97706", "#e11d48"];

const COLOR_PRESETS = [
  { label: "Coral", value: "#E8553A" },
  { label: "Ocean Blue", value: "#2563EB" },
  { label: "Emerald", value: "#059669" },
  { label: "Purple", value: "#7C3AED" },
  { label: "Sunset", value: "#F59E0B" },
  { label: "Rose", value: "#EC4899" },
];

const CONTENT_TYPES = [
  "Instagram Reel or TikTok",
  "Instagram Post",
  "TikTok Video",
  "Any Social Media Post",
];

const PREVIEW_STEPS = [
  { num: "1", label: "Create your content", desc: "Film a short video about your experience here" },
  { num: "2", label: "Post it publicly", desc: "Share it on your TikTok or Instagram" },
  { num: "3", label: "Submit your link", desc: "Paste your post link — takes 10 seconds" },
  { num: "4", label: "Get rewarded", desc: "Receive your reward after approval" },
];

interface CustomizeEditorProps {
  readonly business: Business;
}

export default function CustomizeEditor({ business }: CustomizeEditorProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [name, setName] = useState(business.name);
  const [tagline, setTagline] = useState(business.tagline || "");
  const [logoUrl, setLogoUrl] = useState(business.logo_url || "");
  const [brandColor, setBrandColor] = useState(business.brand_color || "#E8553A");
  const [rewardDescription, setRewardDescription] = useState(business.reward_description);
  const [contentType, setContentType] = useState(business.content_type || "Instagram Reel or TikTok");
  const [requirements, setRequirements] = useState<string[]>(
    business.requirements && business.requirements.length > 0
      ? business.requirements
      : ["Tag @yourbusiness in your post"]
  );

  // UI state
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Suppress unused variable
  void createClient;

  function addRequirement() {
    if (requirements.length >= 6) return;
    setRequirements([...requirements, ""]);
  }

  function removeRequirement(index: number) {
    setRequirements(requirements.filter((_, i) => i !== index));
  }

  function updateRequirement(index: number, value: string) {
    const updated = [...requirements];
    updated[index] = value;
    setRequirements(updated);
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      setUploadError("File too large. Maximum size is 2MB.");
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("logo", file);

      const res = await fetch("/api/business/upload-logo", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.logoUrl) {
        // Append cache-buster to force image refresh
        setLogoUrl(data.logoUrl + "?t=" + Date.now());
        setToast("Logo uploaded!");
        setTimeout(() => setToast(null), 3000);
        router.refresh();
      } else {
        setUploadError(data.error || "Failed to upload logo.");
      }
    } catch {
      setUploadError("Failed to upload logo.");
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/business/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          tagline,
          logo_url: logoUrl || null,
          brand_color: brandColor,
          reward_description: rewardDescription,
          content_type: contentType,
          requirements: requirements.filter((r) => r.trim() !== ""),
        }),
      });

      if (res.ok) {
        setToast("Changes saved!");
        setTimeout(() => setToast(null), 3000);
        router.refresh();
      } else {
        setToast("Failed to save. Please try again.");
        setTimeout(() => setToast(null), 4000);
      }
    } catch {
      setToast("Failed to save. Please try again.");
      setTimeout(() => setToast(null), 4000);
    } finally {
      setSaving(false);
    }
  }

  // Letter fallback for logo
  const nameInitial = (name || "A").charAt(0).toUpperCase();

  const inputClasses =
    "w-full rounded-xl border-[1.5px] border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20";

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
              toast.includes("Failed") ? "bg-red-500" : "bg-emerald-500"
            }`}
          >
            {toast.includes("Failed") ? (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            )}
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-8 lg:grid-cols-[1fr_auto]">
        {/* Left side — Edit controls */}
        <div className="space-y-8">
          {/* Business Logo */}
          <motion.section
            custom={0}
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            className="rounded-2xl border border-gray-100 bg-white/70 p-6"
            style={{ backdropFilter: "blur(12px)", boxShadow: "0 4px 24px -4px rgba(37, 99, 235, 0.06)" }}
          >
            <h2 className="text-base font-semibold text-gray-900" style={{ paddingLeft: "12px", borderLeft: `3px solid ${SECTION_COLORS[0]}` }}>Business Logo</h2>
            <p className="mt-1 text-sm text-gray-500">Upload your business logo (max 2MB)</p>

            <div className="mt-5 flex items-center gap-5">
              {/* Logo preview circle */}
              <div
                className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full"
                style={
                  logoUrl
                    ? {}
                    : { backgroundColor: brandColor }
                }
              >
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Logo"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-white">
                    {nameInitial}
                  </span>
                )}
              </div>

              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="logo-upload"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="rounded-xl border-[1.5px] border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                >
                  {uploading ? (
                    <span className="flex items-center gap-2">
                      <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                      Uploading...
                    </span>
                  ) : (
                    "Upload logo"
                  )}
                </button>
                {uploadError && (
                  <p className="mt-2 text-xs text-red-500">{uploadError}</p>
                )}
                {!uploadError && (
                  <p className="mt-2 text-xs text-gray-400">PNG, JPG, or WebP</p>
                )}
              </div>
            </div>
          </motion.section>

          {/* Business Info */}
          <motion.section
            custom={1}
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            className="rounded-2xl border border-gray-100 bg-white/70 p-6"
            style={{ backdropFilter: "blur(12px)", boxShadow: "0 4px 24px -4px rgba(37, 99, 235, 0.06)" }}
          >
            <h2 className="text-base font-semibold text-gray-900" style={{ paddingLeft: "12px", borderLeft: `3px solid ${SECTION_COLORS[1]}` }}>Business Info</h2>
            <p className="mt-1 text-sm text-gray-500">Basic details about your business</p>

            <div className="mt-5 space-y-4">
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Business name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sunrise Café"
                  className={inputClasses}
                />
              </div>

              <div>
                <label htmlFor="tagline" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Tagline
                </label>
                <input
                  id="tagline"
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. The best coffee in town"
                  className={inputClasses}
                />
              </div>
            </div>
          </motion.section>

          {/* Color Scheme */}
          <motion.section
            custom={2}
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            className="rounded-2xl border border-gray-100 bg-white/70 p-6"
            style={{ backdropFilter: "blur(12px)", boxShadow: "0 4px 24px -4px rgba(37, 99, 235, 0.06)" }}
          >
            <h2 className="text-base font-semibold text-gray-900" style={{ paddingLeft: "12px", borderLeft: `3px solid ${SECTION_COLORS[2]}` }}>Color Scheme</h2>
            <p className="mt-1 text-sm text-gray-500">Choose your brand color for buttons and accents</p>

            <div className="mt-5 grid grid-cols-3 gap-3">
              {COLOR_PRESETS.map((preset) => {
                const isSelected = brandColor === preset.value;
                return (
                  <motion.button
                    key={preset.value}
                    onClick={() => setBrandColor(preset.value)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`flex items-center gap-3 rounded-xl border-[1.5px] px-4 py-3 text-left transition-all ${
                      isSelected
                        ? "border-gray-900 bg-gray-50 shadow-sm"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div
                      className="h-6 w-6 shrink-0 rounded-full"
                      style={{ backgroundColor: preset.value }}
                    />
                    <span className={`text-sm ${isSelected ? "font-medium text-gray-900" : "text-gray-600"}`}>
                      {preset.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.section>

          {/* Reward */}
          <motion.section
            custom={3}
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            className="rounded-2xl border border-gray-100 bg-white/70 p-6"
            style={{ backdropFilter: "blur(12px)", boxShadow: "0 4px 24px -4px rgba(37, 99, 235, 0.06)" }}
          >
            <h2 className="text-base font-semibold text-gray-900" style={{ paddingLeft: "12px", borderLeft: `3px solid ${SECTION_COLORS[3]}` }}>Reward</h2>
            <p className="mt-1 text-sm text-gray-500">What customers get for posting about you</p>

            <div className="mt-5 space-y-4">
              <div>
                <label htmlFor="reward" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Reward description
                </label>
                <input
                  id="reward"
                  type="text"
                  value={rewardDescription}
                  onChange={(e) => setRewardDescription(e.target.value)}
                  placeholder="e.g. $10 off your next visit"
                  className={inputClasses}
                />
              </div>

              <div>
                <label htmlFor="contentType" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Content type
                </label>
                <select
                  id="contentType"
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                  className={inputClasses}
                >
                  {CONTENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.section>

          {/* Requirements */}
          <motion.section
            custom={4}
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            className="rounded-2xl border border-gray-100 bg-white/70 p-6"
            style={{ backdropFilter: "blur(12px)", boxShadow: "0 4px 24px -4px rgba(37, 99, 235, 0.06)" }}
          >
            <h2 className="text-base font-semibold text-gray-900" style={{ paddingLeft: "12px", borderLeft: `3px solid ${SECTION_COLORS[4]}` }}>Requirements</h2>
            <p className="mt-1 text-sm text-gray-500">Rules customers must follow when posting</p>

            <div className="mt-5 space-y-3">
              {requirements.map((req, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={req}
                    onChange={(e) => updateRequirement(i, e.target.value)}
                    placeholder="e.g. Tag @yourbusiness in your post"
                    className={`${inputClasses} flex-1`}
                  />
                  <button
                    onClick={() => removeRequirement(i)}
                    className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl border-[1.5px] border-gray-200 bg-white text-gray-400 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}

              {requirements.length < 6 && (
                <button
                  onClick={addRequirement}
                  className="flex items-center gap-2 rounded-xl border-[1.5px] border-dashed border-gray-300 px-4 py-3 text-sm font-medium text-gray-500 transition-colors hover:border-gray-400 hover:text-gray-700"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Add requirement
                </button>
              )}
            </div>
          </motion.section>

          {/* Save button */}
          <motion.button
            onClick={handleSave}
            disabled={saving || !name.trim() || !rewardDescription.trim()}
            whileHover={{ scale: 1.01, boxShadow: "0 12px 28px -4px rgba(37, 99, 235, 0.35)" }}
            whileTap={{ scale: 0.99 }}
            className="w-full rounded-xl bg-gradient-to-r from-[#2563EB] to-[#7C3AED] py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Saving...
              </span>
            ) : (
              "Save changes"
            )}
          </motion.button>
        </div>

        {/* Right side — Live Preview */}
        <div className="hidden lg:block">
          <div className="sticky top-6 flex flex-col items-center justify-center">
            <p className="mb-3 text-sm font-medium text-gray-500">Live Preview</p>

            {/* Phone frame — scrollable container */}
            <div
              className="border shadow-xl [&::-webkit-scrollbar]:hidden"
              style={{
                width: "375px",
                height: "750px",
                borderRadius: "40px",
                borderColor: "#E5E7EB",
                borderWidth: "1px",
                overflowY: "auto",
                overflowX: "hidden",
                scrollbarWidth: "none",
                backgroundColor: "#FEFCFA",
              }}
            >
              {/* Zoomed preview content — zoom shrinks 480px → 375px and allows native scrolling */}
              <div
                style={{
                  width: "480px",
                  zoom: 0.78125,
                  background: `linear-gradient(to bottom, ${brandColor}14 0%, #FEFCFA 35%)`,
                }}
              >
                <div className="mx-auto max-w-[480px] px-5 py-8">
                  {/* Powered by badge */}
                  <div className="flex justify-center">
                    <div
                      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1"
                      style={{ backgroundColor: "rgba(0,0,0,0.04)", fontSize: "11px", color: "#8B8B9B" }}
                    >
                      Powered by <span className="font-semibold" style={{ color: "#6B6B7B" }}>Astrevix</span>
                    </div>
                  </div>

                  {/* Logo */}
                  {logoUrl && (
                    <div className="mt-6 flex justify-center">
                      <img
                        src={logoUrl}
                        alt="Logo"
                        className="rounded-2xl object-cover shadow-md"
                        style={{ width: "64px", height: "64px" }}
                      />
                    </div>
                  )}

                  {/* Business name + tagline */}
                  <div className={`${logoUrl ? "mt-4" : "mt-8"} text-center`}>
                    <h3
                      className="font-bold text-gray-900"
                      style={{ fontSize: logoUrl ? "24px" : "36px" }}
                    >
                      {name || "Your Business"}
                    </h3>
                    {tagline && (
                      <p className="mt-1 text-sm text-gray-500">{tagline}</p>
                    )}
                  </div>

                  {/* Reward card — liquid glass */}
                  <div className="relative mt-6">
                    <div
                      className="absolute inset-0 rounded-[20px] opacity-20 blur-xl"
                      style={{ backgroundColor: brandColor }}
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
                        style={{ color: brandColor }}
                      >
                        Your Reward
                      </p>
                      <p className="mt-3 text-2xl font-bold text-gray-900">
                        {rewardDescription || "Your reward here"}
                      </p>
                      <p className="mt-2 text-sm text-gray-500">
                        Create a {contentType}
                      </p>
                    </div>
                  </div>

                  {/* How it works */}
                  <div className="mt-8">
                    <h3 className="text-lg font-bold text-gray-900">How it works</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Create a {contentType.toLowerCase()} about your experience and earn your reward.
                    </p>
                    <div className="mt-5 space-y-3">
                      {PREVIEW_STEPS.map((step) => (
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
                            <p className="text-sm font-medium text-gray-900">{step.label}</p>
                            <p className="mt-0.5" style={{ fontSize: "13px", color: "#8B8B9B" }}>{step.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Requirements */}
                  {requirements.filter((r) => r.trim()).length > 0 && (
                    <div
                      className="mt-8 rounded-2xl p-5"
                      style={{ backgroundColor: "#F7F5F2", border: "1px solid #EDEAE6" }}
                    >
                      <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                        <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                        Requirements
                      </h3>
                      <ul className="mt-3 space-y-3">
                        {requirements
                          .filter((r) => r.trim())
                          .map((req, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm">
                              <div className="mt-0.5 h-5 w-5 shrink-0 rounded-md border-[1.5px] border-gray-300" />
                              <span className="text-gray-700">{req}</span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}

                  {/* CTA button */}
                  <div
                    className="mt-8 rounded-2xl py-4 text-center text-base font-semibold text-white"
                    style={{
                      backgroundColor: brandColor,
                      boxShadow: `0 8px 24px ${brandColor}66`,
                    }}
                  >
                    Submit Your Post →
                  </div>

                  {/* Footer */}
                  <p className="mt-3 pb-4 text-center text-xs text-gray-400">
                    Rewards issued after review. Usually within 24 hours.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
