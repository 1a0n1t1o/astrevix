"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
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

const SECTION_COLORS = ["#2563EB", "#7c3aed", "#059669", "#d97706", "#e11d48", "#0891b2"];

const COLOR_PRESETS = [
  { label: "Blue", value: "#2563EB" },
  { label: "Purple", value: "#7C3AED" },
  { label: "Coral", value: "#E8553A" },
  { label: "Emerald", value: "#059669" },
  { label: "Sunset", value: "#F59E0B" },
  { label: "Rose", value: "#EC4899" },
];

interface EmailEditorProps {
  readonly business: Business;
}

export default function EmailEditor({ business }: EmailEditorProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state with defaults
  const [subject, setSubject] = useState(
    business.email_subject || `Your reward from ${business.name}!`
  );
  const [header, setHeader] = useState(
    business.email_header || "Thank you for your post!"
  );
  const [body, setBody] = useState(
    business.email_body ||
      "We appreciate you sharing your experience. Here's your reward as a thank you!"
  );
  const [footer, setFooter] = useState(
    business.email_footer ||
      `Thanks for being a valued customer of ${business.name}`
  );
  const [emailBrandColor, setEmailBrandColor] = useState(
    business.email_brand_color || business.brand_color || "#2563EB"
  );
  const [showLogo, setShowLogo] = useState(true);
  const [rewardFileUrl, setRewardFileUrl] = useState(
    business.reward_file_url || ""
  );
  const [rewardFileName, setRewardFileName] = useState(
    business.reward_file_name || ""
  );

  // UI state
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const inputClasses =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all focus:border-blue-300 focus:ring-2 focus:ring-blue-100";

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File too large. Maximum size is 5MB.");
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("reward_file", file);

      const res = await fetch("/api/business/upload-reward-file", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setRewardFileUrl(data.rewardFileUrl);
        setRewardFileName(data.rewardFileName);
        setToast("Reward file uploaded!");
        setTimeout(() => setToast(null), 3000);
      } else {
        const data = await res.json();
        setUploadError(data.error || "Upload failed.");
      }
    } catch {
      setUploadError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function handleRemoveFile() {
    setRewardFileUrl("");
    setRewardFileName("");
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/business/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: business.name,
          reward_description: business.reward_description,
          email_subject: subject,
          email_header: header,
          email_body: body,
          email_footer: footer,
          email_brand_color: emailBrandColor,
          reward_file_url: rewardFileUrl || null,
          reward_file_name: rewardFileName || null,
        }),
      });

      if (res.ok) {
        setToast("Email template saved!");
        setTimeout(() => setToast(null), 3000);
        router.refresh();
      } else {
        setToast("Failed to save. Please try again.");
        setTimeout(() => setToast(null), 3000);
      }
    } catch {
      setToast("Failed to save. Please try again.");
      setTimeout(() => setToast(null), 3000);
    } finally {
      setSaving(false);
    }
  }

  // Get file extension icon
  const fileExt = rewardFileName.split(".").pop()?.toLowerCase();
  const isFilePdf = fileExt === "pdf";

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_auto]">
      {/* Left — Editor */}
      <div className="space-y-5">
        {/* Subject Line */}
        <motion.section
          custom={0}
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          className="rounded-2xl border border-gray-100 bg-white/70 p-6"
          style={{
            backdropFilter: "blur(12px)",
            boxShadow: "0 4px 24px -4px rgba(37, 99, 235, 0.06)",
          }}
        >
          <h2
            className="text-base font-semibold text-gray-900"
            style={{
              paddingLeft: "12px",
              borderLeft: `3px solid ${SECTION_COLORS[0]}`,
            }}
          >
            Subject Line
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            The email subject your customers will see in their inbox
          </p>
          <div className="mt-4">
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={`Your reward from ${business.name}!`}
              className={inputClasses}
            />
          </div>
        </motion.section>

        {/* Header & Body */}
        <motion.section
          custom={1}
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          className="rounded-2xl border border-gray-100 bg-white/70 p-6"
          style={{
            backdropFilter: "blur(12px)",
            boxShadow: "0 4px 24px -4px rgba(37, 99, 235, 0.06)",
          }}
        >
          <h2
            className="text-base font-semibold text-gray-900"
            style={{
              paddingLeft: "12px",
              borderLeft: `3px solid ${SECTION_COLORS[1]}`,
            }}
          >
            Email Content
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            The headline and body message in the email
          </p>
          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Header text
              </label>
              <input
                type="text"
                value={header}
                onChange={(e) => setHeader(e.target.value)}
                placeholder="Thank you for your post!"
                className={inputClasses}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Body message
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="We appreciate you sharing your experience..."
                rows={3}
                className={`${inputClasses} resize-none`}
              />
            </div>
          </div>
        </motion.section>

        {/* Brand Color */}
        <motion.section
          custom={2}
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          className="rounded-2xl border border-gray-100 bg-white/70 p-6"
          style={{
            backdropFilter: "blur(12px)",
            boxShadow: "0 4px 24px -4px rgba(37, 99, 235, 0.06)",
          }}
        >
          <h2
            className="text-base font-semibold text-gray-900"
            style={{
              paddingLeft: "12px",
              borderLeft: `3px solid ${SECTION_COLORS[2]}`,
            }}
          >
            Email Color
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            The header accent color in your reward email
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {COLOR_PRESETS.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => setEmailBrandColor(preset.value)}
                className={`flex h-10 w-10 items-center justify-center rounded-xl border-2 transition-all ${
                  emailBrandColor === preset.value
                    ? "scale-110 border-gray-900 shadow-md"
                    : "border-transparent hover:scale-105"
                }`}
                style={{ backgroundColor: preset.value }}
                title={preset.label}
              >
                {emailBrandColor === preset.value && (
                  <svg
                    className="h-4 w-4 text-white"
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
                )}
              </button>
            ))}
          </div>
        </motion.section>

        {/* Logo Toggle */}
        <motion.section
          custom={3}
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          className="rounded-2xl border border-gray-100 bg-white/70 p-6"
          style={{
            backdropFilter: "blur(12px)",
            boxShadow: "0 4px 24px -4px rgba(37, 99, 235, 0.06)",
          }}
        >
          <h2
            className="text-base font-semibold text-gray-900"
            style={{
              paddingLeft: "12px",
              borderLeft: `3px solid ${SECTION_COLORS[3]}`,
            }}
          >
            Logo
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Show your business logo in the email header
          </p>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {business.logo_url ? (
                <img
                  src={business.logo_url}
                  alt={business.name}
                  className="h-10 w-10 rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-sm text-gray-400">
                  No logo
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Include logo in email
                </p>
                {!business.logo_url && (
                  <p className="text-xs text-gray-400">
                    Upload a logo on the Customize page first
                  </p>
                )}
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={showLogo}
              onClick={() => setShowLogo(!showLogo)}
              disabled={!business.logo_url}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out disabled:cursor-not-allowed disabled:opacity-50 ${
                showLogo && business.logo_url ? "bg-[#2563EB]" : "bg-gray-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ease-in-out ${
                  showLogo && business.logo_url
                    ? "translate-x-5"
                    : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </motion.section>

        {/* Reward File Upload */}
        <motion.section
          custom={4}
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          className="rounded-2xl border border-gray-100 bg-white/70 p-6"
          style={{
            backdropFilter: "blur(12px)",
            boxShadow: "0 4px 24px -4px rgba(37, 99, 235, 0.06)",
          }}
        >
          <h2
            className="text-base font-semibold text-gray-900"
            style={{
              paddingLeft: "12px",
              borderLeft: `3px solid ${SECTION_COLORS[4]}`,
            }}
          >
            Reward Attachment
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Upload a coupon, voucher, or reward file to attach to the email
          </p>
          <div className="mt-4">
            {rewardFileName ? (
              <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold text-white ${
                    isFilePdf ? "bg-red-500" : "bg-blue-500"
                  }`}
                >
                  {isFilePdf ? "PDF" : "IMG"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {rewardFileName}
                  </p>
                  <p className="text-xs text-gray-400">
                    Will be attached to reward emails
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-red-500"
                >
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
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 px-4 py-6 text-sm font-medium text-gray-500 transition-colors hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
              >
                {uploading ? (
                  <>
                    <svg
                      className="h-5 w-5 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Uploading...
                  </>
                ) : (
                  <>
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                      />
                    </svg>
                    Upload reward file (PDF, PNG, JPG — max 5MB)
                  </>
                )}
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              className="hidden"
              onChange={handleFileUpload}
            />
            {uploadError && (
              <p className="mt-2 text-sm text-red-500">{uploadError}</p>
            )}
          </div>
        </motion.section>

        {/* Footer */}
        <motion.section
          custom={5}
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          className="rounded-2xl border border-gray-100 bg-white/70 p-6"
          style={{
            backdropFilter: "blur(12px)",
            boxShadow: "0 4px 24px -4px rgba(37, 99, 235, 0.06)",
          }}
        >
          <h2
            className="text-base font-semibold text-gray-900"
            style={{
              paddingLeft: "12px",
              borderLeft: `3px solid ${SECTION_COLORS[5]}`,
            }}
          >
            Footer
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Small text at the bottom of the email
          </p>
          <div className="mt-4">
            <input
              type="text"
              value={footer}
              onChange={(e) => setFooter(e.target.value)}
              placeholder={`Thanks for being a valued customer of ${business.name}`}
              className={inputClasses}
            />
          </div>
        </motion.section>

        {/* Save button */}
        <motion.button
          onClick={handleSave}
          disabled={saving}
          whileTap={{ scale: 0.98 }}
          className="w-full rounded-2xl bg-[#2563EB] py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-[#1d4ed8] disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Template"}
        </motion.button>
      </div>

      {/* Right — Live Email Preview */}
      <div className="hidden lg:block">
        <div className="sticky top-6 flex flex-col items-center">
          <p className="mb-3 text-sm font-medium text-gray-500">
            Email Preview
          </p>
          <div
            style={{ width: "420px" }}
            className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl"
          >
            {/* Email meta */}
            <div className="border-b border-gray-100 px-5 py-3">
              <p className="text-xs text-gray-400">From</p>
              <p className="text-sm font-medium text-gray-900">
                {business.name}
              </p>
              <p className="mt-1 text-xs text-gray-400">Subject</p>
              <p className="text-sm text-gray-700">{subject}</p>
            </div>

            {/* Email body */}
            <div style={{ backgroundColor: "#f9fafb" }}>
              <div
                style={{
                  maxWidth: "520px",
                  margin: "0 auto",
                  padding: "20px 16px",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "12px",
                    overflow: "hidden",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  {/* Header */}
                  <div
                    style={{
                      backgroundColor: emailBrandColor,
                      padding: "24px 24px 20px",
                    }}
                  >
                    {showLogo && business.logo_url && (
                      <img
                        src={business.logo_url}
                        alt={business.name}
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "10px",
                          marginBottom: "10px",
                          objectFit: "cover",
                        }}
                      />
                    )}
                    <p
                      style={{
                        margin: 0,
                        color: "#ffffff",
                        fontSize: "18px",
                        fontWeight: 600,
                      }}
                    >
                      {header || "Thank you for your post!"}
                    </p>
                    <p
                      style={{
                        margin: "6px 0 0",
                        color: "rgba(255,255,255,0.85)",
                        fontSize: "13px",
                      }}
                    >
                      Your post has been approved
                    </p>
                  </div>

                  {/* Body */}
                  <div style={{ padding: "24px" }}>
                    <p
                      style={{
                        margin: "0 0 12px",
                        color: "#111827",
                        fontSize: "13px",
                        lineHeight: 1.6,
                      }}
                    >
                      Hi [Customer Name],
                    </p>
                    <p
                      style={{
                        margin: "0 0 16px",
                        color: "#374151",
                        fontSize: "13px",
                        lineHeight: 1.6,
                      }}
                    >
                      {body ||
                        "We appreciate you sharing your experience. Here's your reward as a thank you!"}
                    </p>

                    {/* Reward box */}
                    <div
                      style={{
                        backgroundColor: "#f0fdf4",
                        border: "1px solid #bbf7d0",
                        borderRadius: "10px",
                        padding: "16px",
                        marginBottom: "16px",
                      }}
                    >
                      <p
                        style={{
                          margin: "0 0 4px",
                          color: "#15803d",
                          fontSize: "11px",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        Your Reward
                      </p>
                      <p
                        style={{
                          margin: 0,
                          color: "#166534",
                          fontSize: "15px",
                          fontWeight: 600,
                        }}
                      >
                        {business.reward_description}
                      </p>
                    </div>

                    {/* Personal note placeholder */}
                    <div
                      style={{
                        backgroundColor: "#f9fafb",
                        borderRadius: "10px",
                        padding: "12px 16px",
                        marginBottom: "16px",
                      }}
                    >
                      <p
                        style={{
                          margin: "0 0 4px",
                          color: "#6b7280",
                          fontSize: "11px",
                          fontWeight: 500,
                        }}
                      >
                        Personal note from {business.name}
                      </p>
                      <p
                        style={{
                          margin: 0,
                          color: "#374151",
                          fontSize: "12px",
                          lineHeight: 1.5,
                          fontStyle: "italic",
                        }}
                      >
                        &quot;Optional personal message will appear here&quot;
                      </p>
                    </div>

                    {/* Attachment */}
                    {rewardFileName && (
                      <div
                        style={{
                          backgroundColor: "#eff6ff",
                          border: "1px solid #bfdbfe",
                          borderRadius: "10px",
                          padding: "12px 14px",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <span style={{ fontSize: "16px" }}>
                          {isFilePdf ? "\uD83D\uDCC4" : "\uD83D\uDDBC\uFE0F"}
                        </span>
                        <span
                          style={{ color: "#1e40af", fontSize: "12px" }}
                        >
                          {rewardFileName}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div
                    style={{
                      borderTop: "1px solid #f3f4f6",
                      padding: "16px 24px",
                      textAlign: "center",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        color: "#6b7280",
                        fontSize: "11px",
                      }}
                    >
                      {footer ||
                        `Thanks for being a valued customer of ${business.name}`}
                    </p>
                    <p
                      style={{
                        margin: "6px 0 0",
                        color: "#9ca3af",
                        fontSize: "10px",
                      }}
                    >
                      Sent via Astrevix
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white shadow-lg"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
