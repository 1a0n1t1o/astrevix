"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Business } from "@/types/database";

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

  // Form state
  const [name, setName] = useState(business.name);
  const [tagline, setTagline] = useState(business.tagline || "");
  const [logoEmoji, setLogoEmoji] = useState(business.logo_emoji || "🏪");
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
  const [toast, setToast] = useState<string | null>(null);

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

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/business/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          tagline,
          logo_emoji: logoEmoji,
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

  // Suppress unused variable
  void createClient;

  const inputClasses =
    "w-full rounded-xl border-[1.5px] border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20";

  return (
    <>
      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium text-white shadow-lg transition-all ${
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
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Left side — Edit controls */}
        <div className="space-y-8">
          {/* Business Info */}
          <section className="rounded-2xl border border-gray-100 bg-white/70 p-6" style={{ backdropFilter: "blur(12px)" }}>
            <h2 className="text-base font-semibold text-gray-900">Business Info</h2>
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

              <div>
                <label htmlFor="emoji" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Logo emoji
                </label>
                <input
                  id="emoji"
                  type="text"
                  value={logoEmoji}
                  onChange={(e) => setLogoEmoji(e.target.value)}
                  placeholder="🏪"
                  className={`${inputClasses} max-w-[100px] text-center text-2xl`}
                />
              </div>
            </div>
          </section>

          {/* Color Scheme */}
          <section className="rounded-2xl border border-gray-100 bg-white/70 p-6" style={{ backdropFilter: "blur(12px)" }}>
            <h2 className="text-base font-semibold text-gray-900">Color Scheme</h2>
            <p className="mt-1 text-sm text-gray-500">Choose your brand color for buttons and accents</p>

            <div className="mt-5 grid grid-cols-3 gap-3">
              {COLOR_PRESETS.map((preset) => {
                const isSelected = brandColor === preset.value;
                return (
                  <button
                    key={preset.value}
                    onClick={() => setBrandColor(preset.value)}
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
                  </button>
                );
              })}
            </div>
          </section>

          {/* Reward */}
          <section className="rounded-2xl border border-gray-100 bg-white/70 p-6" style={{ backdropFilter: "blur(12px)" }}>
            <h2 className="text-base font-semibold text-gray-900">Reward</h2>
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
          </section>

          {/* Requirements */}
          <section className="rounded-2xl border border-gray-100 bg-white/70 p-6" style={{ backdropFilter: "blur(12px)" }}>
            <h2 className="text-base font-semibold text-gray-900">Requirements</h2>
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
          </section>

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={saving || !name.trim() || !rewardDescription.trim()}
            className="w-full rounded-xl bg-gradient-to-r from-[#2563EB] to-[#7C3AED] py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Saving...
              </span>
            ) : (
              "Save changes"
            )}
          </button>
        </div>

        {/* Right side — Live Preview */}
        <div className="hidden lg:block">
          <div className="sticky top-8">
            <p className="mb-3 text-sm font-medium text-gray-500">Live Preview</p>

            {/* Phone frame */}
            <div
              className="overflow-hidden rounded-[2.5rem] border-[3px] border-gray-800 bg-gray-800 shadow-2xl"
              style={{ height: "720px" }}
            >
              {/* Status bar */}
              <div className="flex items-center justify-between bg-gray-800 px-6 py-2">
                <span className="text-xs font-medium text-white">9:41</span>
                <div className="mx-auto h-6 w-24 rounded-full bg-gray-900" />
                <div className="flex gap-1">
                  <div className="h-2.5 w-2.5 rounded-full bg-white/60" />
                  <div className="h-2.5 w-2.5 rounded-full bg-white/60" />
                  <div className="h-2.5 w-2.5 rounded-full bg-white/60" />
                </div>
              </div>

              {/* Preview content */}
              <div
                className="h-[calc(100%-40px)] overflow-y-auto"
                style={{ backgroundColor: "#FEFCFA" }}
              >
                <div className="px-5 py-6">
                  {/* Powered by badge */}
                  <div className="flex justify-center">
                    <div
                      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1"
                      style={{ backgroundColor: "rgba(0,0,0,0.04)", fontSize: "10px", color: "#8B8B9B" }}
                    >
                      Powered by <span className="font-semibold" style={{ color: "#6B6B7B" }}>Astrevix</span>
                    </div>
                  </div>

                  {/* Hero section */}
                  <div
                    className="mt-3 rounded-2xl px-4 pb-6 pt-5"
                    style={{ background: "linear-gradient(to bottom, #FFF0ED, #FEFCFA)" }}
                  >
                    {/* Logo emoji */}
                    <div className="flex justify-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white text-2xl shadow-md">
                        {logoEmoji || "🏪"}
                      </div>
                    </div>

                    {/* Name + tagline */}
                    <div className="mt-3 text-center">
                      <h3 className="font-serif text-lg font-bold text-gray-900">
                        {name || "Your Business"}
                      </h3>
                      {tagline && (
                        <p className="mt-0.5 text-xs text-gray-500">{tagline}</p>
                      )}
                    </div>

                    {/* Reward card */}
                    <div
                      className="relative mt-4 overflow-hidden rounded-xl px-4 py-5 text-center text-white"
                      style={{ backgroundColor: brandColor }}
                    >
                      <div
                        className="absolute -right-3 -top-3 h-16 w-16 rounded-full"
                        style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
                      />
                      <div
                        className="absolute -bottom-2 -left-2 h-10 w-10 rounded-full"
                        style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                      />
                      <p className="relative text-[9px] font-semibold uppercase tracking-widest opacity-90">
                        🎁 Your Reward
                      </p>
                      <p className="relative mt-1.5 font-serif text-base font-bold">
                        {rewardDescription || "Your reward here"}
                      </p>
                      <p className="relative mt-1 text-[10px] opacity-80">
                        Create a {contentType}
                      </p>
                    </div>
                  </div>

                  {/* How it works */}
                  <div className="mt-5">
                    <h3 className="font-serif text-sm font-bold text-gray-900">How it works</h3>
                    <p className="mt-0.5 text-[10px] text-gray-500">
                      Create a {contentType.toLowerCase()} about your experience and earn your reward.
                    </p>
                    <div className="mt-3 space-y-2">
                      {PREVIEW_STEPS.map((step) => {
                        const isLast = step.num === "4";
                        return (
                          <div
                            key={step.num}
                            className="flex items-start gap-2.5 rounded-lg bg-white p-2.5 shadow-sm"
                          >
                            <div
                              className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-bold"
                              style={
                                isLast
                                  ? { backgroundColor: brandColor, color: "#fff" }
                                  : { backgroundColor: "rgba(0,0,0,0.04)", color: "#1a1a1a" }
                              }
                            >
                              {step.num}
                            </div>
                            <div>
                              <p className="text-[11px] font-medium text-gray-900">{step.label}</p>
                              <p className="mt-0.5 text-[9px] text-gray-400">{step.desc}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Requirements */}
                  {requirements.filter((r) => r.trim()).length > 0 && (
                    <div
                      className="mt-5 rounded-xl p-3.5"
                      style={{ backgroundColor: "#F7F5F2", border: "1px solid #EDEAE6" }}
                    >
                      <h3 className="font-serif text-sm font-bold text-gray-900">📋 Requirements</h3>
                      <ul className="mt-2 space-y-2">
                        {requirements
                          .filter((r) => r.trim())
                          .map((req, i) => (
                            <li key={i} className="flex items-start gap-2 text-[11px]">
                              <div className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded border border-gray-300" />
                              <span className="text-gray-700">{req}</span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}

                  {/* CTA button */}
                  <div
                    className="mt-5 rounded-xl py-3 text-center text-xs font-semibold text-white"
                    style={{
                      backgroundColor: brandColor,
                      boxShadow: `0 4px 12px ${brandColor}66`,
                    }}
                  >
                    Submit Your Post →
                  </div>

                  {/* Footer */}
                  <p className="mt-2 pb-2 text-center text-[9px] text-gray-400">
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
