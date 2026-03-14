"use client";

import { useState } from "react";
import {
  detectPlatform,
  createSubmission,
  PLATFORM_INFO,
  type Platform,
  type BusinessData,
  type RewardTierPublic,
} from "@/lib/data";
import { formatPhoneInput, parsePhoneToE164, isValidUSPhone } from "@/lib/phone-utils";
import {
  Instagram,
  Music,
  Youtube,
  Twitter,
  Facebook,
  Link,
  Gift,
  Lock,
  Clock,
  ArrowRight,
  Camera,
  Video,
} from "lucide-react";

const PLATFORM_ICON_MAP: Record<string, React.ReactNode> = {
  instagram: <Instagram className="h-3.5 w-3.5" />,
  music: <Music className="h-3.5 w-3.5" />,
  youtube: <Youtube className="h-3.5 w-3.5" />,
  twitter: <Twitter className="h-3.5 w-3.5" />,
  facebook: <Facebook className="h-3.5 w-3.5" />,
};

const TIER_ICONS: Record<string, React.ReactNode> = {
  instagram: <Camera className="h-5 w-5" />,
  tiktok: <Video className="h-5 w-5" />,
};

function PlatformBadgeInline({ platform, darkMode }: { platform: Platform | null; darkMode?: boolean }) {
  const iconKey = platform ? PLATFORM_INFO[platform].icon : null;
  const icon = iconKey ? PLATFORM_ICON_MAP[iconKey] : <Link className="h-3.5 w-3.5" />;
  const label = platform ? PLATFORM_INFO[platform].label : "Link";
  return (
    <span
      className="inline-flex items-center gap-1.5 whitespace-nowrap"
      style={{
        backgroundColor: darkMode ? "rgba(26, 29, 39, 0.8)" : "#F2F0ED",
        color: darkMode ? "#94a3b8" : undefined,
        border: darkMode ? "1px solid rgba(55, 65, 81, 0.4)" : undefined,
        borderRadius: "8px",
        padding: "5px 10px",
        fontSize: "12px",
        fontWeight: 600,
      }}
    >
      {icon} {label}
    </span>
  );
}

export default function SubmitForm({
  business,
  selectedTierId,
}: {
  business: BusinessData;
  selectedTierId: string | null;
}) {
  const dk = business.darkMode;
  const hasTiers = business.rewardTiers.length > 0;
  const initialTier = selectedTierId
    ? business.rewardTiers.find((t) => t.id === selectedTierId) || null
    : null;

  const [postLink, setPostLink] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [smsConsent, setSmsConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const [duplicateLink, setDuplicateLink] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [touched, setTouched] = useState({ postLink: false, phone: false });
  const [selectedTier, setSelectedTier] = useState<RewardTierPublic | null>(initialTier);
  const [showTierPicker, setShowTierPicker] = useState(false);

  const detectedPlatform = detectPlatform(postLink);

  // Reward display: use tier reward or fallback to business reward
  const displayReward = selectedTier?.reward_description || business.reward;

  const isValidUrl =
    postLink.trim() === "" ||
    postLink.startsWith("http://") ||
    postLink.startsWith("https://");
  const phoneDigits = phone.replace(/\D/g, "");
  const isPhoneValid = phone.trim() === "" || isValidUSPhone(phone);

  const isValid =
    postLink.trim() !== "" &&
    isValidUrl &&
    name.trim() !== "" &&
    phoneDigits.length === 10 &&
    isPhoneValid &&
    smsConsent &&
    (!hasTiers || selectedTier !== null);

  // Dashboard-matching dark mode color constants
  const inputBg = dk ? "#141620" : "#fff";
  const inputBorder = dk ? "rgba(55, 65, 81, 0.6)" : "#E0DDD8";
  const cardBg = dk ? "rgba(26, 29, 39, 0.7)" : "#F7F5F2";
  const cardBorder = dk ? "rgba(55, 65, 81, 0.4)" : undefined;
  const surfaceBg = dk ? "#1a1d27" : "#F7F5F2";
  const outlineBtnBg = dk ? "rgba(26, 29, 39, 0.7)" : "#fff";
  const outlineBtnBorder = dk ? "1.5px solid rgba(55, 65, 81, 0.6)" : "1.5px solid #E0DDD8";
  const checkboxBorder = dk ? "1.5px solid rgba(55, 65, 81, 0.6)" : "1.5px solid #D0CCC6";

  async function handleSubmit() {
    if (!isValid || submitting) return;
    setSubmitting(true);
    setDuplicateLink(false);
    setFormError(null);

    const e164 = parsePhoneToE164(phone);
    if (!e164) {
      setFormError("Invalid phone number.");
      setSubmitting(false);
      return;
    }

    const { error, code } = await createSubmission({
      businessId: business.id,
      postUrl: postLink,
      detectedPlatform: detectedPlatform,
      customerName: name,
      customerPhone: e164,
      rewardTierId: selectedTier?.id || null,
    });

    setSubmitting(false);

    if (error) {
      if (code === "DUPLICATE_LINK") {
        setDuplicateLink(true);
      } else if (code === "LIMIT_REACHED") {
        setLimitReached(true);
      } else {
        setFormError(error);
      }
      return;
    }

    setSubmitted(true);
  }

  if (limitReached) {
    return (
      <div className="flex flex-col items-center pt-6 text-center">
        {/* Info circle icon */}
        <div
          className="flex items-center justify-center rounded-full"
          style={{
            width: "88px",
            height: "88px",
            background: `linear-gradient(135deg, ${business.brandColor}15, ${business.brandColor}25)`,
          }}
        >
          <svg
            className="h-10 w-10"
            style={{ color: business.brandColor }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h1
          className="mt-5"
          style={{ fontSize: "26px", fontWeight: 700, color: dk ? "#f1f5f9" : undefined }}
        >
          You&apos;ve already submitted!
        </h1>
        <p className="mt-2" style={{ fontSize: "15px", color: dk ? "#94a3b8" : "#8B8B9B" }}>
          You&apos;ve already submitted content for{" "}
          <strong>{business.name}</strong>. Thank you for your support!
        </p>

        <a
          href={`/b/${business.slug}`}
          className="mt-8 block w-full rounded-2xl py-4 text-center text-base font-semibold transition-colors"
          style={{
            backgroundColor: outlineBtnBg,
            color: dk ? "#94a3b8" : "#6B6B7B",
            border: outlineBtnBorder,
            boxShadow: dk ? "0 4px 16px rgba(0, 0, 0, 0.15)" : undefined,
          }}
        >
          Back to {business.name}
        </a>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center pt-6 text-center">
        {/* Checkmark circle */}
        <div
          className="flex items-center justify-center rounded-full"
          style={{
            width: "88px",
            height: "88px",
            background: dk
              ? "linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(16, 185, 129, 0.2))"
              : "linear-gradient(135deg, #E8F5E8, #D4EDDA)",
          }}
        >
          <svg
            className="h-10 w-10"
            style={{ color: dk ? "#34d399" : "#2E7D32" }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1
          className="mt-5"
          style={{ fontSize: "26px", fontWeight: 700, color: dk ? "#f1f5f9" : undefined }}
        >
          You&apos;re all set!
        </h1>
        <p className="mt-2" style={{ fontSize: "15px", color: dk ? "#94a3b8" : "#8B8B9B" }}>
          {selectedTier
            ? `Your post needs to stay live for ${selectedTier.verification_hours} hours. ${business.name} will verify and send your reward after that.`
            : `${business.name} will review your post and send your reward within 24 hours.`}
        </p>

        {/* Reward summary card */}
        <div
          className="mt-6 w-full rounded-2xl p-5 text-center"
          style={{
            backgroundColor: surfaceBg,
            border: dk ? `1px solid ${cardBorder}` : undefined,
            boxShadow: dk ? "0 4px 16px rgba(0, 0, 0, 0.15)" : undefined,
          }}
        >
          <p
            className="font-semibold uppercase tracking-widest"
            style={{ fontSize: "11px", color: dk ? "#64748b" : "#8B8B9B" }}
          >
            Your Reward
          </p>
          {selectedTier && (
            <p className="mt-1 flex items-center justify-center gap-1.5 text-xs" style={{ color: dk ? "#64748b" : "#6b7280" }}>
              <span style={{ color: business.brandColor }}>
                {TIER_ICONS[selectedTier.platform] || <Gift className="h-3.5 w-3.5" />}
              </span>
              {selectedTier.tier_name}
            </p>
          )}
          <p
            className="mt-2 font-bold text-brand"
            style={{ fontSize: "22px" }}
          >
            {displayReward}
          </p>
          {selectedTier?.reward_value && (
            <span
              className="mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold"
              style={{
                backgroundColor: `${business.brandColor}18`,
                color: business.brandColor,
              }}
            >
              {selectedTier.reward_value}
            </span>
          )}
          <p className="mt-2 text-xs" style={{ color: dk ? "#64748b" : "#8B8B9B" }}>
            We&apos;ll text it to the number you provided once your post is
            {selectedTier ? " verified and" : ""} approved.
          </p>
        </div>

        {/* Platform card */}
        {detectedPlatform && (
          <div
            className="mt-4 flex w-full items-center gap-3 rounded-xl p-4"
            style={{
              backgroundColor: cardBg,
              border: dk ? `1px solid ${cardBorder}` : undefined,
            }}
          >
            <span className="flex h-5 w-5 items-center justify-center" style={{ color: dk ? "#94a3b8" : "#374151" }}>
              {PLATFORM_ICON_MAP[PLATFORM_INFO[detectedPlatform].icon]}
            </span>
            <div className="min-w-0 text-left">
              <p className="text-sm font-semibold" style={{ color: dk ? "#f1f5f9" : undefined }}>
                {PLATFORM_INFO[detectedPlatform].label} post submitted
              </p>
              <p className="truncate text-xs" style={{ color: dk ? "#64748b" : "#8B8B9B" }}>
                {postLink}
              </p>
            </div>
          </div>
        )}

        {/* Done button — outline style */}
        <a
          href={`/b/${business.slug}`}
          className="mt-8 block w-full rounded-2xl py-4 text-center text-base font-semibold transition-colors"
          style={{
            backgroundColor: outlineBtnBg,
            color: dk ? "#94a3b8" : "#6B6B7B",
            border: outlineBtnBorder,
            boxShadow: dk ? "0 4px 16px rgba(0, 0, 0, 0.15)" : undefined,
          }}
        >
          Done
        </a>
      </div>
    );
  }

  return (
    <>
      {/* Back link */}
      <a
        href={`/b/${business.slug}`}
        className="inline-flex items-center gap-1 text-sm transition-colors"
        style={{ color: dk ? "#94a3b8" : "#6b7280" }}
      >
        &larr; Back
      </a>

      {/* Header with business name */}
      <div className="mt-4 flex items-center gap-3">
        {business.logoUrl && (
          <img
            src={business.logoUrl}
            alt={business.name}
            className="h-10 w-10 rounded-xl object-cover shadow-sm"
          />
        )}
        <div>
          <h1 className="text-xl font-bold" style={{ color: dk ? "#f1f5f9" : undefined }}>Submit your post</h1>
          <p className="text-xs" style={{ color: dk ? "#94a3b8" : "#6b7280" }}>{business.name}</p>
        </div>
      </div>

      {/* Reward reminder banner — tier-aware */}
      {hasTiers && selectedTier ? (
        <div
          className="mt-5 rounded-2xl p-4"
          style={{
            backgroundColor: dk ? "rgba(26, 29, 39, 0.5)" : `${business.brandColor}0D`,
            border: dk ? `1px solid rgba(55, 65, 81, 0.3)` : undefined,
          }}
        >
          <div className="flex items-center gap-3">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${business.brandColor}18`, color: business.brandColor }}
            >
              {TIER_ICONS[selectedTier.platform] || <Gift className="h-4 w-4" />}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium" style={{ color: dk ? "#64748b" : "#6b7280" }}>
                {selectedTier.tier_name}
              </p>
              <p className="text-sm font-semibold text-brand">
                {selectedTier.reward_description}
              </p>
              {selectedTier.reward_value && (
                <span
                  className="mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold"
                  style={{
                    backgroundColor: `${business.brandColor}18`,
                    color: business.brandColor,
                  }}
                >
                  {selectedTier.reward_value}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => setShowTierPicker(!showTierPicker)}
              className="shrink-0 text-xs font-medium underline"
              style={{ color: business.brandColor }}
            >
              Change
            </button>
          </div>

          {/* Tier picker dropdown */}
          {showTierPicker && (
            <div className="mt-3 space-y-2 border-t pt-3" style={{ borderColor: dk ? "rgba(55, 65, 81, 0.3)" : `${business.brandColor}20` }}>
              {business.rewardTiers.map((tier) => (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => {
                    setSelectedTier(tier);
                    setShowTierPicker(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors"
                  style={{
                    backgroundColor: tier.id === selectedTier.id
                      ? dk ? "rgba(26, 29, 39, 0.8)" : "#fff"
                      : "transparent",
                    boxShadow: tier.id === selectedTier.id ? (dk ? "0 2px 8px rgba(0,0,0,0.2)" : "0 1px 3px rgba(0,0,0,0.08)") : undefined,
                  }}
                >
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${business.brandColor}18`, color: business.brandColor }}
                  >
                    {TIER_ICONS[tier.platform] || <Gift className="h-4 w-4" />}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium" style={{ color: dk ? "#64748b" : "#6b7280" }}>
                      {tier.tier_name}
                    </p>
                    <p className="text-sm font-semibold" style={{ color: dk ? "#f1f5f9" : "#111827" }}>
                      {tier.reward_description}
                    </p>
                  </div>
                  {tier.id === selectedTier.id && (
                    <svg className="h-5 w-5 shrink-0" style={{ color: dk ? "#34d399" : "#10b981" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : hasTiers && !selectedTier ? (
        /* Tier selection when none is selected yet */
        <div className="mt-5 space-y-2">
          <p
            className="text-center text-xs font-semibold uppercase tracking-widest"
            style={{ color: business.brandColor }}
          >
            Select Your Reward
          </p>
          {business.rewardTiers.map((tier) => (
            <button
              key={tier.id}
              type="button"
              onClick={() => setSelectedTier(tier)}
              className="flex w-full items-center gap-3 rounded-2xl p-4 text-left transition-all hover:shadow-md active:scale-[0.98]"
              style={{
                backgroundColor: dk ? "rgba(26, 29, 39, 0.7)" : "#fff",
                border: dk ? "1px solid rgba(55, 65, 81, 0.4)" : "1px solid rgba(0,0,0,0.06)",
                boxShadow: dk ? "0 4px 16px rgba(0, 0, 0, 0.15)" : "0 1px 3px rgba(0,0,0,0.08)",
              }}
            >
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${business.brandColor}18`, color: business.brandColor }}
              >
                {TIER_ICONS[tier.platform] || <Gift className="h-5 w-5" />}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium" style={{ color: dk ? "#64748b" : "#6b7280" }}>
                  {tier.tier_name}
                </p>
                <p className="text-sm font-bold" style={{ color: dk ? "#f1f5f9" : "#111827" }}>
                  {tier.reward_description}
                </p>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0" style={{ color: dk ? "#4b5563" : "#9ca3af" }} />
            </button>
          ))}
        </div>
      ) : (
        /* Legacy single reward banner */
        <div
          className="mt-5 flex items-center gap-3 rounded-2xl p-4"
          style={{
            backgroundColor: dk ? "rgba(26, 29, 39, 0.5)" : `${business.brandColor}0D`,
            border: dk ? "1px solid rgba(55, 65, 81, 0.3)" : undefined,
          }}
        >
          <Gift className="h-5 w-5 shrink-0" style={{ color: business.brandColor }} />
          <div>
            <p className="text-sm font-semibold text-brand">
              {business.reward}
            </p>
            <p className="text-xs" style={{ color: dk ? "#94a3b8" : "#6b7280" }}>After your post is approved</p>
          </div>
        </div>
      )}

      {/* General form error */}
      {formError && (
        <div
          className="mt-4 rounded-xl p-3 text-center text-sm font-medium"
          style={{
            backgroundColor: dk ? "rgba(244, 63, 94, 0.12)" : "#FEF2F2",
            color: dk ? "#fb7185" : "#DC2626",
            border: dk ? "1px solid rgba(244, 63, 94, 0.25)" : undefined,
          }}
        >
          {formError}
        </div>
      )}

      {/* Form */}
      <div className="mt-6 space-y-4">
        {/* Post link */}
        <div>
          <label htmlFor="postLink" className="block text-sm font-medium" style={{ color: dk ? "#f1f5f9" : undefined }}>
            Post link
          </label>
          <div className="relative mt-1.5">
            <input
              id="postLink"
              type="url"
              value={postLink}
              onChange={(e) => {
                setPostLink(e.target.value);
                if (duplicateLink) setDuplicateLink(false);
              }}
              placeholder="https://www.instagram.com/reel/..."
              className="w-full text-sm outline-none transition-colors"
              style={{
                borderRadius: "14px",
                border: `1.5px solid ${duplicateLink ? "#EF4444" : inputBorder}`,
                padding: "16px",
                paddingRight: postLink.trim() ? "120px" : "16px",
                backgroundColor: inputBg,
                color: dk ? "#f1f5f9" : undefined,
              }}
              onFocus={(e) => {
                if (!duplicateLink) e.target.style.borderColor = business.brandColor;
              }}
              onBlur={(e) => {
                if (!duplicateLink) e.target.style.borderColor = inputBorder;
                setTouched((t) => ({ ...t, postLink: true }));
              }}
            />
            {postLink.trim() && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2">
                <PlatformBadgeInline platform={detectedPlatform} darkMode={dk} />
              </span>
            )}
          </div>
          {duplicateLink ? (
            <p className="mt-1.5" style={{ fontSize: "12px", color: dk ? "#fb7185" : "#EF4444" }}>
              This link has already been submitted
            </p>
          ) : touched.postLink && !isValidUrl ? (
            <p className="mt-1.5" style={{ fontSize: "12px", color: dk ? "#fb7185" : "#EF4444" }}>
              Please enter a valid URL
            </p>
          ) : (
            <p className="mt-1.5 text-xs" style={{ color: dk ? "#64748b" : "#9ca3af" }}>
              We&apos;ll automatically detect which platform you posted on
            </p>
          )}
        </div>

        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium" style={{ color: dk ? "#f1f5f9" : undefined }}>
            First name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your first name"
            className="mt-1.5 w-full text-sm outline-none transition-colors"
            style={{
              borderRadius: "14px",
              border: `1.5px solid ${inputBorder}`,
              padding: "16px",
              backgroundColor: inputBg,
              color: dk ? "#f1f5f9" : undefined,
            }}
            onFocus={(e) => (e.target.style.borderColor = business.brandColor)}
            onBlur={(e) => (e.target.style.borderColor = inputBorder)}
          />
        </div>

        {/* Phone number */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium" style={{ color: dk ? "#f1f5f9" : undefined }}>
            Phone number
          </label>
          <div className="relative mt-1.5">
            <span
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-sm"
              style={{ color: dk ? "#64748b" : "#6b7280" }}
            >
              <span className="text-base leading-none">🇺🇸</span> +1
            </span>
            <input
              id="phone"
              type="tel"
              inputMode="numeric"
              value={phone}
              onChange={(e) => {
                const formatted = formatPhoneInput(e.target.value);
                setPhone(formatted);
              }}
              placeholder="(555) 123-4567"
              className="w-full text-sm outline-none transition-colors"
              style={{
                borderRadius: "14px",
                border: `1.5px solid ${inputBorder}`,
                padding: "16px",
                paddingLeft: "72px",
                backgroundColor: inputBg,
                color: dk ? "#f1f5f9" : undefined,
              }}
              onFocus={(e) => (e.target.style.borderColor = business.brandColor)}
              onBlur={(e) => {
                e.target.style.borderColor = inputBorder;
                setTouched((t) => ({ ...t, phone: true }));
              }}
            />
          </div>
          {touched.phone && !isPhoneValid ? (
            <p className="mt-1.5" style={{ fontSize: "12px", color: dk ? "#fb7185" : "#EF4444" }}>
              Please enter a valid 10-digit US phone number
            </p>
          ) : (
            <p className="mt-1.5 text-xs" style={{ color: dk ? "#64748b" : "#9ca3af" }}>
              Only used to text your reward. We never spam.
            </p>
          )}
        </div>
      </div>

      {/* SMS consent checkbox */}
      <label className="mt-5 flex items-start gap-3 cursor-pointer">
        <span className="relative mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center">
          <input
            type="checkbox"
            checked={smsConsent}
            onChange={(e) => setSmsConsent(e.target.checked)}
            className="sr-only"
          />
          <span
            className="absolute inset-0 rounded-md transition-colors"
            style={{
              border: smsConsent ? "none" : checkboxBorder,
              backgroundColor: smsConsent ? business.brandColor : "transparent",
            }}
          />
          {smsConsent && (
            <svg className="relative h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          )}
        </span>
        <span className="text-xs leading-relaxed" style={{ color: dk ? "#94a3b8" : "#6b7280" }}>
          By submitting, I agree to receive SMS messages from {business.name} via Astrevix about my submission
          and reward. Up to 3 msgs per submission. Msg &amp; data rates may apply. Reply STOP to opt-out.{" "}
          <a href="/terms" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-700">Terms &amp; Conditions</a>
          {" | "}
          <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-700">Privacy Policy</a>.
        </span>
      </label>

      {/* Submit button */}
      <button
        disabled={!isValid || submitting}
        onClick={handleSubmit}
        className="mt-6 w-full rounded-2xl py-4 text-base font-semibold transition-all hover:enabled:brightness-110 active:enabled:scale-[0.98]"
        style={
          isValid
            ? {
                backgroundColor: business.brandColor,
                color: "#fff",
                boxShadow: dk ? `0 8px 24px ${business.brandColor}50` : `0 8px 24px ${business.brandColor}66`,
              }
            : {
                backgroundColor: dk ? "rgba(26, 29, 39, 0.7)" : "#E0DDD8",
                color: dk ? "#4b5563" : "#A0A0AA",
                border: dk ? "1px solid rgba(55, 65, 81, 0.4)" : undefined,
                cursor: "not-allowed",
              }
        }
      >
        {submitting ? "Submitting..." : "Submit"}
      </button>

      {/* Trust signals */}
      <div className="mt-4 flex justify-center gap-6 text-xs" style={{ color: dk ? "#64748b" : "#9ca3af" }}>
        <span className="inline-flex items-center gap-1"><Lock className="h-3 w-3" /> Info stays private</span>
        <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> Usually approved in {selectedTier ? (selectedTier.verification_hours >= 24 ? `${Math.round(selectedTier.verification_hours / 24)}d` : `${selectedTier.verification_hours}h`) : "24h"}</span>
      </div>
    </>
  );
}
