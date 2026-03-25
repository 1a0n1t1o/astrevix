"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { Business } from "@/types/database";
import { Upload, X, Paperclip } from "lucide-react";

const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" as const },
  }),
};

const SECTION_COLORS = ["#059669", "#2563EB", "#e11d48"];

const DEFAULT_TEMPLATES = {
  confirmation: {
    subject: "Thanks for your submission to [Business Name]!",
    body: "We received your post and we're reviewing it now. We'll get back to you shortly with your reward!",
  },
  approval: {
    subject: "Your reward from [Business Name] is here!",
    body: "Great news! Your post has been approved. Here's your reward: [Reward Details]. Thank you for your support!",
  },
  rejection: {
    subject: "Update on your submission to [Business Name]",
    body: "Thanks for your submission. Unfortunately, we weren't able to approve this one. Feel free to try again with a new post!",
  },
};

interface EmailEditorProps {
  readonly business: Business;
}

function VariableChips({
  textareaRef,
  value,
  onChange,
  showReward,
}: {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  value: string;
  onChange: (v: string) => void;
  showReward: boolean;
}) {
  const chips = [
    { label: "Business Name", variable: "[Business Name]" },
    { label: "Customer Name", variable: "[Customer Name]" },
    ...(showReward
      ? [
          { label: "Reward Details", variable: "[Reward Details]" },
          { label: "Coupon Code", variable: "[Coupon Code]" },
          { label: "Reward Link", variable: "[Reward Link]" },
        ]
      : []),
  ];

  function insertVariable(variable: string) {
    const textarea = textareaRef.current;
    if (!textarea) {
      onChange(value + variable);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newValue = value.slice(0, start) + variable + value.slice(end);
    onChange(newValue);
    requestAnimationFrame(() => {
      textarea.focus();
      const pos = start + variable.length;
      textarea.setSelectionRange(pos, pos);
    });
  }

  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      <span className="text-xs text-gray-400 self-center mr-1">Insert:</span>
      {chips.map((chip) => (
        <button
          key={chip.variable}
          type="button"
          onClick={() => insertVariable(chip.variable)}
          className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-900"
        >
          {chip.label}
        </button>
      ))}
    </div>
  );
}

function renderPreview(template: string, businessName: string, rewardDescription: string): string {
  return template
    .replace(/\[Business Name\]/g, businessName)
    .replace(/\[Customer Name\]/g, "Sarah")
    .replace(/\[Reward Details\]/g, rewardDescription)
    .replace(/\[Coupon Code\]/g, "AX7K2M")
    .replace(/\[Reward Link\]/g, "https://example.com/reward");
}

export default function EmailEditor({ business }: EmailEditorProps) {
  const router = useRouter();

  // Template state
  const [confirmationSubject, setConfirmationSubject] = useState(
    business.email_subject_confirmation || DEFAULT_TEMPLATES.confirmation.subject
  );
  const [confirmationBody, setConfirmationBody] = useState(
    business.email_body_confirmation || DEFAULT_TEMPLATES.confirmation.body
  );
  const [confirmationEnabled, setConfirmationEnabled] = useState(
    business.email_confirmation_enabled ?? true
  );

  const [approvalSubject, setApprovalSubject] = useState(
    business.email_subject_approval || DEFAULT_TEMPLATES.approval.subject
  );
  const [approvalBody, setApprovalBody] = useState(
    business.email_body_approval || DEFAULT_TEMPLATES.approval.body
  );
  const [approvalEnabled, setApprovalEnabled] = useState(
    business.email_approval_enabled ?? true
  );

  const [rejectionSubject, setRejectionSubject] = useState(
    business.email_subject_rejection || DEFAULT_TEMPLATES.rejection.subject
  );
  const [rejectionBody, setRejectionBody] = useState(
    business.email_body_rejection || DEFAULT_TEMPLATES.rejection.body
  );
  const [rejectionEnabled, setRejectionEnabled] = useState(
    business.email_rejection_enabled ?? false
  );

  // Reward link & file
  const [rewardLink, setRewardLink] = useState(business.email_reward_link || "");
  const [rewardFileUrl, setRewardFileUrl] = useState(business.email_reward_file_url || "");
  const [rewardFileName, setRewardFileName] = useState(business.email_reward_file_name || "");
  const [uploading, setUploading] = useState(false);

  // Coupon settings
  const [couponExpiryDays, setCouponExpiryDays] = useState<number | null>(
    business.default_coupon_expiry_days ?? 30
  );

  // Active preview
  const [activePreview, setActivePreview] = useState<
    "confirmation" | "approval" | "rejection"
  >("confirmation");

  // UI state
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Textarea refs
  const confirmationRef = useRef<HTMLTextAreaElement>(null);
  const approvalRef = useRef<HTMLTextAreaElement>(null);
  const rejectionRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const inputClasses =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all focus:border-blue-300 focus:ring-2 focus:ring-blue-100";

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const ext = file.name.split(".").pop();
      const path = `${business.id}/${Date.now()}.${ext}`;

      const { error } = await supabase.storage
        .from("reward-files")
        .upload(path, file, { upsert: true });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from("reward-files")
        .getPublicUrl(path);

      setRewardFileUrl(urlData.publicUrl);
      setRewardFileName(file.name);
    } catch (err) {
      console.error("Upload failed:", err);
      setToast("Failed to upload file");
      setTimeout(() => setToast(null), 3000);
    } finally {
      setUploading(false);
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
          name: business.name,
          reward_description: business.reward_description,
          email_subject_confirmation: confirmationSubject,
          email_body_confirmation: confirmationBody,
          email_confirmation_enabled: confirmationEnabled,
          email_subject_approval: approvalSubject,
          email_body_approval: approvalBody,
          email_approval_enabled: approvalEnabled,
          email_subject_rejection: rejectionSubject,
          email_body_rejection: rejectionBody,
          email_rejection_enabled: rejectionEnabled,
          email_reward_link: rewardLink || null,
          email_reward_file_url: rewardFileUrl || null,
          email_reward_file_name: rewardFileName || null,
          default_coupon_expiry_days: couponExpiryDays,
        }),
      });

      if (res.ok) {
        setToast("Email templates saved!");
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

  // Get the current preview data
  const previewData =
    activePreview === "confirmation"
      ? { subject: confirmationSubject, body: confirmationBody }
      : activePreview === "approval"
        ? { subject: approvalSubject, body: approvalBody }
        : { subject: rejectionSubject, body: rejectionBody };

  const previewLabel =
    activePreview === "confirmation"
      ? "Confirmation"
      : activePreview === "approval"
        ? "Approval"
        : "Rejection";

  const brandColor = business.email_brand_color || business.brand_color || "#E8553A";

  const templates = [
    {
      key: "confirmation" as const,
      title: "Submission Confirmation",
      description: "Sent immediately when a customer submits content",
      subject: confirmationSubject,
      setSubject: setConfirmationSubject,
      body: confirmationBody,
      setBody: setConfirmationBody,
      enabled: confirmationEnabled,
      setEnabled: setConfirmationEnabled,
      ref: confirmationRef,
      showReward: false,
      colorIndex: 0,
    },
    {
      key: "approval" as const,
      title: "Reward / Approval Email",
      description: "Sent when you approve a submission",
      subject: approvalSubject,
      setSubject: setApprovalSubject,
      body: approvalBody,
      setBody: setApprovalBody,
      enabled: approvalEnabled,
      setEnabled: setApprovalEnabled,
      ref: approvalRef,
      showReward: true,
      colorIndex: 1,
    },
    {
      key: "rejection" as const,
      title: "Rejection Email",
      description: "Sent when you reject a submission",
      subject: rejectionSubject,
      setSubject: setRejectionSubject,
      body: rejectionBody,
      setBody: setRejectionBody,
      enabled: rejectionEnabled,
      setEnabled: setRejectionEnabled,
      ref: rejectionRef,
      showReward: false,
      colorIndex: 2,
    },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_auto]">
      {/* Left — Editor */}
      <div className="space-y-5">
        {templates.map((t, index) => (
          <motion.section
            key={t.key}
            custom={index}
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            className="rounded-2xl border border-gray-100 bg-white/70 p-6"
            style={{
              backdropFilter: "blur(12px)",
              boxShadow: "0 4px 24px -4px rgba(37, 99, 235, 0.06)",
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  className="text-base font-semibold text-gray-900"
                  style={{
                    paddingLeft: "12px",
                    borderLeft: `3px solid ${SECTION_COLORS[t.colorIndex]}`,
                  }}
                >
                  {t.title}
                </h2>
                <p className="mt-1 text-sm text-gray-500">{t.description}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={t.enabled}
                onClick={() => t.setEnabled(!t.enabled)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  t.enabled ? "bg-[#2563EB]" : "bg-gray-200"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ease-in-out ${
                    t.enabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className={`mt-4 space-y-3 ${!t.enabled ? "opacity-50 pointer-events-none" : ""}`}>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-500">
                  Subject line
                </label>
                <input
                  type="text"
                  value={t.subject}
                  onChange={(e) => t.setSubject(e.target.value)}
                  className={inputClasses}
                  onFocus={() => setActivePreview(t.key)}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-500">
                  Email body
                </label>
                <textarea
                  ref={t.ref}
                  value={t.body}
                  onChange={(e) => t.setBody(e.target.value)}
                  rows={4}
                  className={`${inputClasses} resize-none`}
                  onFocus={() => setActivePreview(t.key)}
                />
              </div>
              <VariableChips
                textareaRef={t.ref}
                value={t.body}
                onChange={t.setBody}
                showReward={t.showReward}
              />
            </div>
          </motion.section>
        ))}

        {/* Reward Settings */}
        <motion.section
          custom={templates.length}
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
              borderLeft: "3px solid #8b5cf6",
            }}
          >
            Reward Settings
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Configure reward delivery details for approval emails
          </p>

          <div className="mt-4 space-y-4">
            {/* Reward link */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500">
                Reward link (optional)
              </label>
              <input
                type="url"
                value={rewardLink}
                onChange={(e) => setRewardLink(e.target.value)}
                placeholder="https://example.com/reward"
                className={inputClasses}
              />
              <p className="mt-1 text-xs text-gray-400">
                Inserted as [Reward Link] in approval emails
              </p>
            </div>

            {/* File attachment */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500">
                Reward file attachment (optional)
              </label>
              {rewardFileUrl ? (
                <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3">
                  <Paperclip className="h-4 w-4 text-gray-400 shrink-0" />
                  <span className="flex-1 truncate text-sm text-gray-700">
                    {rewardFileName}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setRewardFileUrl("");
                      setRewardFileName("");
                    }}
                    className="shrink-0 rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-white px-4 py-4 text-sm text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-700 disabled:opacity-50"
                >
                  <Upload className="h-4 w-4" />
                  {uploading ? "Uploading..." : "Upload PDF or image"}
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileUpload}
                className="hidden"
              />
              <p className="mt-1 text-xs text-gray-400">
                Attached to approval emails (coupon, voucher, etc.)
              </p>
            </div>

            {/* Coupon expiry */}
            <div>
              <label
                htmlFor="coupon-expiry"
                className="mb-1.5 block text-xs font-medium text-gray-500"
              >
                Default coupon expiry
              </label>
              <select
                id="coupon-expiry"
                value={couponExpiryDays ?? 0}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setCouponExpiryDays(val === 0 ? null : val);
                }}
                className={inputClasses}
              >
                <option value={7}>7 days</option>
                <option value={14}>14 days</option>
                <option value={30}>30 days</option>
                <option value={60}>60 days</option>
                <option value={90}>90 days</option>
                <option value={0}>No expiry</option>
              </select>
              <p className="mt-1 text-xs text-gray-400">
                Coupon codes will automatically expire after this period
              </p>
            </div>
          </div>
        </motion.section>

        {/* Save button */}
        <motion.button
          onClick={handleSave}
          disabled={saving}
          whileTap={{ scale: 0.98 }}
          className="w-full rounded-2xl bg-[#2563EB] py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-[#1d4ed8] disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Templates"}
        </motion.button>
      </div>

      {/* Right — Email Preview */}
      <div className="hidden lg:block">
        <div className="sticky top-6 flex flex-col items-center">
          <p className="mb-3 text-sm font-medium text-gray-500">
            Email Preview — {previewLabel}
          </p>

          {/* Email preview frame */}
          <div
            style={{ width: "360px" }}
            className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl"
          >
            {/* Email header */}
            <div
              style={{ backgroundColor: brandColor }}
              className="px-6 py-5 text-center"
            >
              {business.logo_url && (
                <img
                  src={business.logo_url}
                  alt={business.name}
                  className="mx-auto mb-2 h-8 rounded-lg"
                />
              )}
              <p className="text-lg font-bold text-white">{business.name}</p>
            </div>

            {/* Subject line */}
            <div className="border-b border-gray-100 px-6 py-3">
              <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
                Subject
              </p>
              <p className="mt-0.5 text-sm font-medium text-gray-900">
                {renderPreview(previewData.subject, business.name, business.reward_description)}
              </p>
            </div>

            {/* Email body */}
            <div className="px-6 py-5">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                {renderPreview(previewData.body, business.name, business.reward_description)}
              </p>
            </div>

            {/* Attachment indicator */}
            {activePreview === "approval" && rewardFileUrl && (
              <div className="mx-6 mb-4 flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                <Paperclip className="h-3.5 w-3.5 text-gray-400" />
                <span className="text-xs text-gray-600 truncate">
                  {rewardFileName}
                </span>
              </div>
            )}

            {/* Footer */}
            <div className="border-t border-gray-100 px-6 py-3 text-center">
              <p className="text-[11px] text-gray-400">
                Sent via{" "}
                <span style={{ color: brandColor }} className="font-medium">
                  Astrevix
                </span>
              </p>
            </div>
          </div>

          {/* Preview tab buttons */}
          <div className="mt-4 flex gap-1.5">
            {(["confirmation", "approval", "rejection"] as const).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setActivePreview(key)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  activePreview === key
                    ? "bg-[#2563EB] text-white"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </button>
            ))}
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
