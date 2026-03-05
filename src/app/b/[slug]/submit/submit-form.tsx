"use client";

import { useState } from "react";
import {
  detectPlatform,
  createSubmission,
  PLATFORM_INFO,
  type Platform,
  type BusinessData,
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
} from "lucide-react";

const PLATFORM_ICON_MAP: Record<string, React.ReactNode> = {
  instagram: <Instagram className="h-3.5 w-3.5" />,
  music: <Music className="h-3.5 w-3.5" />,
  youtube: <Youtube className="h-3.5 w-3.5" />,
  twitter: <Twitter className="h-3.5 w-3.5" />,
  facebook: <Facebook className="h-3.5 w-3.5" />,
};

function PlatformBadgeInline({ platform }: { platform: Platform | null }) {
  const iconKey = platform ? PLATFORM_INFO[platform].icon : null;
  const icon = iconKey ? PLATFORM_ICON_MAP[iconKey] : <Link className="h-3.5 w-3.5" />;
  const label = platform ? PLATFORM_INFO[platform].label : "Link";
  return (
    <span
      className="inline-flex items-center gap-1.5 whitespace-nowrap"
      style={{
        backgroundColor: "#F2F0ED",
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

export default function SubmitForm({ business }: { business: BusinessData }) {
  const [postLink, setPostLink] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const [duplicateLink, setDuplicateLink] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [touched, setTouched] = useState({ postLink: false, phone: false });

  const detectedPlatform = detectPlatform(postLink);

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
    isPhoneValid;

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
          style={{ fontSize: "26px", fontWeight: 700 }}
        >
          You&apos;ve already submitted!
        </h1>
        <p className="mt-2" style={{ fontSize: "15px", color: "#8B8B9B" }}>
          You&apos;ve already submitted content for{" "}
          <strong>{business.name}</strong>. Thank you for your support!
        </p>

        <a
          href={`/b/${business.slug}`}
          className="mt-8 block w-full rounded-2xl py-4 text-center text-base font-semibold transition-colors"
          style={{
            backgroundColor: "#fff",
            color: "#6B6B7B",
            border: "1.5px solid #E0DDD8",
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
            background: "linear-gradient(135deg, #E8F5E8, #D4EDDA)",
          }}
        >
          <svg
            className="h-10 w-10"
            style={{ color: "#2E7D32" }}
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
          style={{ fontSize: "26px", fontWeight: 700 }}
        >
          You&apos;re all set!
        </h1>
        <p className="mt-2" style={{ fontSize: "15px", color: "#8B8B9B" }}>
          {business.name} will review your post and send your reward within 24
          hours.
        </p>

        {/* Reward summary card */}
        <div
          className="mt-6 w-full rounded-2xl p-5 text-center"
          style={{ backgroundColor: "#F7F5F2" }}
        >
          <p
            className="font-semibold uppercase tracking-widest"
            style={{ fontSize: "11px", color: "#8B8B9B" }}
          >
            Your Reward
          </p>
          <p
            className="mt-2 font-bold text-brand"
            style={{ fontSize: "22px" }}
          >
            {business.reward}
          </p>
          <p className="mt-2 text-xs" style={{ color: "#8B8B9B" }}>
            We&apos;ll text it to the number you provided once your post is
            approved.
          </p>
        </div>

        {/* Platform card */}
        {detectedPlatform && (
          <div
            className="mt-4 flex w-full items-center gap-3 rounded-xl p-4"
            style={{ backgroundColor: "#F7F5F2" }}
          >
            <span className="flex h-5 w-5 items-center justify-center text-gray-700">
              {PLATFORM_ICON_MAP[PLATFORM_INFO[detectedPlatform].icon]}
            </span>
            <div className="min-w-0 text-left">
              <p className="text-sm font-semibold">
                {PLATFORM_INFO[detectedPlatform].label} post submitted
              </p>
              <p className="truncate text-xs" style={{ color: "#8B8B9B" }}>
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
            backgroundColor: "#fff",
            color: "#6B6B7B",
            border: "1.5px solid #E0DDD8",
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
        className="inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-foreground"
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
          <h1 className="text-xl font-bold">Submit your post</h1>
          <p className="text-xs text-gray-500">{business.name}</p>
        </div>
      </div>

      {/* Reward reminder banner */}
      <div
        className="mt-5 flex items-center gap-3 rounded-2xl p-4"
        style={{ backgroundColor: `${business.brandColor}0D` }}
      >
        <Gift className="h-5 w-5 shrink-0" style={{ color: business.brandColor }} />
        <div>
          <p className="text-sm font-semibold text-brand">
            {business.reward}
          </p>
          <p className="text-xs text-gray-500">After your post is approved</p>
        </div>
      </div>

      {/* General form error */}
      {formError && (
        <div
          className="mt-4 rounded-xl p-3 text-center text-sm font-medium"
          style={{ backgroundColor: "#FEF2F2", color: "#DC2626" }}
        >
          {formError}
        </div>
      )}

      {/* Form */}
      <div className="mt-6 space-y-4">
        {/* Post link */}
        <div>
          <label htmlFor="postLink" className="block text-sm font-medium">
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
              className="w-full bg-white text-sm outline-none transition-colors placeholder:text-gray-400"
              style={{
                borderRadius: "14px",
                border: `1.5px solid ${duplicateLink ? "#EF4444" : "#E0DDD8"}`,
                padding: "16px",
                paddingRight: postLink.trim() ? "120px" : "16px",
              }}
              onFocus={(e) => {
                if (!duplicateLink) e.target.style.borderColor = business.brandColor;
              }}
              onBlur={(e) => {
                if (!duplicateLink) e.target.style.borderColor = "#E0DDD8";
                setTouched((t) => ({ ...t, postLink: true }));
              }}
            />
            {postLink.trim() && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2">
                <PlatformBadgeInline platform={detectedPlatform} />
              </span>
            )}
          </div>
          {duplicateLink ? (
            <p className="mt-1.5" style={{ fontSize: "12px", color: "#EF4444" }}>
              This link has already been submitted
            </p>
          ) : touched.postLink && !isValidUrl ? (
            <p className="mt-1.5" style={{ fontSize: "12px", color: "#EF4444" }}>
              Please enter a valid URL
            </p>
          ) : (
            <p className="mt-1.5 text-xs text-gray-400">
              We&apos;ll automatically detect which platform you posted on
            </p>
          )}
        </div>

        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            First name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your first name"
            className="mt-1.5 w-full bg-white text-sm outline-none transition-colors placeholder:text-gray-400"
            style={{
              borderRadius: "14px",
              border: "1.5px solid #E0DDD8",
              padding: "16px",
            }}
            onFocus={(e) => (e.target.style.borderColor = business.brandColor)}
            onBlur={(e) => (e.target.style.borderColor = "#E0DDD8")}
          />
        </div>

        {/* Phone number */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium">
            Phone number
          </label>
          <div className="relative mt-1.5">
            <span
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-sm text-gray-500"
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
              className="w-full bg-white text-sm outline-none transition-colors placeholder:text-gray-400"
              style={{
                borderRadius: "14px",
                border: "1.5px solid #E0DDD8",
                padding: "16px",
                paddingLeft: "72px",
              }}
              onFocus={(e) => (e.target.style.borderColor = business.brandColor)}
              onBlur={(e) => {
                e.target.style.borderColor = "#E0DDD8";
                setTouched((t) => ({ ...t, phone: true }));
              }}
            />
          </div>
          {touched.phone && !isPhoneValid ? (
            <p className="mt-1.5" style={{ fontSize: "12px", color: "#EF4444" }}>
              Please enter a valid 10-digit US phone number
            </p>
          ) : (
            <p className="mt-1.5 text-xs text-gray-400">
              Only used to text your reward. We never spam.
            </p>
          )}
        </div>
      </div>

      {/* Submit button */}
      <button
        disabled={!isValid || submitting}
        onClick={handleSubmit}
        className="mt-6 w-full rounded-2xl py-4 text-base font-semibold transition-all active:enabled:scale-[0.98]"
        style={
          isValid
            ? {
                backgroundColor: business.brandColor,
                color: "#fff",
                boxShadow: `0 8px 24px ${business.brandColor}66`,
              }
            : {
                backgroundColor: "#E0DDD8",
                color: "#A0A0AA",
                cursor: "not-allowed",
              }
        }
      >
        {submitting ? "Submitting..." : "Submit"}
      </button>

      {/* Trust signals */}
      <div className="mt-4 flex justify-center gap-6 text-xs text-gray-400">
        <span className="inline-flex items-center gap-1"><Lock className="h-3 w-3" /> Info stays private</span>
        <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> Usually approved in 24h</span>
      </div>
    </>
  );
}
