"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { Business } from "@/types/database";
import { countSmsSegments } from "@/lib/phone-utils";

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
  confirmation:
    "Thanks for submitting your post to [Business Name]! We'll review it and get back to you shortly.",
  approval:
    "Great news! Your post for [Business Name] has been approved! Your coupon code is: [Coupon Code]. Here's your reward: [Reward Details]. Thank you for your support!",
  rejection:
    "Thanks for your submission to [Business Name]. Unfortunately, we weren't able to approve this one. Feel free to try again with a new post!",
};

interface SmsEditorProps {
  readonly business: Business;
}

function SegmentCounter({ text }: { text: string }) {
  const { characters, segments } = countSmsSegments(text);
  const isWarning = segments > 2;
  return (
    <p
      className={`mt-1.5 text-xs ${isWarning ? "text-amber-600 font-medium" : ""}`}
      style={isWarning ? undefined : { color: "var(--dash-text-muted)" }}
    >
      {characters}/160 chars ({segments} segment{segments !== 1 ? "s" : ""})
      {isWarning && " — Consider shortening to reduce SMS costs"}
    </p>
  );
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
    // Restore cursor position after the inserted variable
    requestAnimationFrame(() => {
      textarea.focus();
      const pos = start + variable.length;
      textarea.setSelectionRange(pos, pos);
    });
  }

  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      <span className="text-xs self-center mr-1" style={{ color: "var(--dash-text-muted)" }}>Insert:</span>
      {chips.map((chip) => (
        <button
          key={chip.variable}
          type="button"
          onClick={() => insertVariable(chip.variable)}
          className="rounded-lg px-2.5 py-1 text-xs font-medium transition-colors"
          style={{ backgroundColor: "var(--dash-hover)", color: "var(--dash-text-secondary)" }}
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

export default function SmsEditor({ business }: SmsEditorProps) {
  const router = useRouter();

  // Template state
  const [confirmationTemplate, setConfirmationTemplate] = useState(
    business.sms_confirmation_template || DEFAULT_TEMPLATES.confirmation
  );
  const [confirmationEnabled, setConfirmationEnabled] = useState(
    business.sms_confirmation_enabled ?? true
  );
  const [approvalTemplate, setApprovalTemplate] = useState(
    business.sms_approval_template || DEFAULT_TEMPLATES.approval
  );
  const [approvalEnabled, setApprovalEnabled] = useState(
    business.sms_approval_enabled ?? true
  );
  const [rejectionTemplate, setRejectionTemplate] = useState(
    business.sms_rejection_template || DEFAULT_TEMPLATES.rejection
  );
  const [rejectionEnabled, setRejectionEnabled] = useState(
    business.sms_rejection_enabled ?? false
  );

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

  const inputStyle = {
    backgroundColor: "var(--dash-surface)",
    borderColor: "var(--dash-card-border)",
    color: "var(--dash-text)",
  };
  const inputClasses =
    "w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all focus:border-blue-300 focus:ring-2 focus:ring-blue-100 resize-none";

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/business/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: business.name,
          reward_description: business.reward_description,
          sms_confirmation_template: confirmationTemplate,
          sms_confirmation_enabled: confirmationEnabled,
          sms_approval_template: approvalTemplate,
          sms_approval_enabled: approvalEnabled,
          sms_rejection_template: rejectionTemplate,
          sms_rejection_enabled: rejectionEnabled,
          default_coupon_expiry_days: couponExpiryDays,
        }),
      });

      if (res.ok) {
        setToast("SMS templates saved!");
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

  // Get the current preview text
  const previewText =
    activePreview === "confirmation"
      ? renderPreview(confirmationTemplate, business.name, business.reward_description)
      : activePreview === "approval"
        ? renderPreview(approvalTemplate, business.name, business.reward_description)
        : renderPreview(rejectionTemplate, business.name, business.reward_description);

  const previewLabel =
    activePreview === "confirmation"
      ? "Confirmation"
      : activePreview === "approval"
        ? "Approval"
        : "Rejection";

  const templates = [
    {
      key: "confirmation" as const,
      title: "Submission Confirmation",
      description: "Sent immediately when a customer submits content",
      template: confirmationTemplate,
      setTemplate: setConfirmationTemplate,
      enabled: confirmationEnabled,
      setEnabled: setConfirmationEnabled,
      ref: confirmationRef,
      showReward: false,
      colorIndex: 0,
    },
    {
      key: "approval" as const,
      title: "Reward / Approval Message",
      description: "Sent when you approve a submission",
      template: approvalTemplate,
      setTemplate: setApprovalTemplate,
      enabled: approvalEnabled,
      setEnabled: setApprovalEnabled,
      ref: approvalRef,
      showReward: true,
      colorIndex: 1,
    },
    {
      key: "rejection" as const,
      title: "Rejection Message",
      description: "Sent when you reject a submission",
      template: rejectionTemplate,
      setTemplate: setRejectionTemplate,
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
            className="rounded-2xl border p-6"
            style={{
              backdropFilter: "blur(12px)",
              boxShadow: "0 4px 24px -4px rgba(37, 99, 235, 0.06)",
              backgroundColor: "var(--dash-card-bg)",
              borderColor: "var(--dash-card-border)",
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  className="text-base font-semibold"
                  style={{
                    paddingLeft: "12px",
                    borderLeft: `3px solid ${SECTION_COLORS[t.colorIndex]}`,
                    color: "var(--dash-text)",
                  }}
                >
                  {t.title}
                </h2>
                <p className="mt-1 text-sm" style={{ color: "var(--dash-text-secondary)" }}>{t.description}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={t.enabled}
                onClick={() => t.setEnabled(!t.enabled)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  t.enabled ? "bg-[#2563EB]" : ""
                }`}
                style={t.enabled ? undefined : { backgroundColor: "var(--dash-toggle-bg)" }}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ease-in-out ${
                    t.enabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className={`mt-4 ${!t.enabled ? "opacity-50 pointer-events-none" : ""}`}>
              <textarea
                ref={t.ref}
                value={t.template}
                onChange={(e) => t.setTemplate(e.target.value)}
                rows={3}
                className={inputClasses}
                style={inputStyle}
                onFocus={() => setActivePreview(t.key)}
              />
              <SegmentCounter text={t.template} />
              <VariableChips
                textareaRef={t.ref}
                value={t.template}
                onChange={t.setTemplate}
                showReward={t.showReward}
              />
            </div>
          </motion.section>
        ))}

        {/* Coupon Settings */}
        <motion.section
          custom={templates.length}
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          className="rounded-2xl border p-6"
          style={{
            backdropFilter: "blur(12px)",
            boxShadow: "0 4px 24px -4px rgba(37, 99, 235, 0.06)",
            backgroundColor: "var(--dash-card-bg)",
            borderColor: "var(--dash-card-border)",
          }}
        >
          <h2
            className="text-base font-semibold"
            style={{
              paddingLeft: "12px",
              borderLeft: "3px solid #8b5cf6",
              color: "var(--dash-text)",
            }}
          >
            Coupon Settings
          </h2>
          <p className="mt-1 text-sm" style={{ color: "var(--dash-text-secondary)" }}>
            Auto-generated coupon codes are included in approval messages
          </p>

          <div className="mt-4">
            <label
              htmlFor="coupon-expiry"
              className="mb-1.5 block text-xs font-medium"
              style={{ color: "var(--dash-text-secondary)" }}
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
              style={{ resize: "none", ...inputStyle }}
            >
              <option value={7}>7 days</option>
              <option value={14}>14 days</option>
              <option value={30}>30 days</option>
              <option value={60}>60 days</option>
              <option value={90}>90 days</option>
              <option value={0}>No expiry</option>
            </select>
            <p className="mt-1.5 text-xs" style={{ color: "var(--dash-text-muted)" }}>
              Coupon codes will automatically expire after this period
            </p>
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

      {/* Right — iPhone SMS Preview */}
      <div className="hidden lg:block">
        <div className="sticky top-6 flex flex-col items-center">
          <p className="mb-3 text-sm font-medium" style={{ color: "var(--dash-text-secondary)" }}>
            SMS Preview — {previewLabel}
          </p>

          {/* iPhone frame */}
          <div
            style={{ width: "320px" }}
            className="overflow-hidden rounded-[2.5rem] border-[3px] border-gray-800 bg-gray-900 shadow-2xl"
          >
            {/* Status bar */}
            <div className="flex items-center justify-between bg-gray-900 px-7 pb-1 pt-3">
              <span className="text-xs font-medium text-white">9:41</span>
              <div className="flex items-center gap-1">
                <svg className="h-3.5 w-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 18c3.31 0 6-2.69 6-6s-2.69-6-6-6-6 2.69-6 6 2.69 6 6 6zm0-10c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4z" />
                </svg>
                <svg className="h-3.5 w-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2 22h20V2z" />
                </svg>
              </div>
            </div>

            {/* Notch */}
            <div className="mx-auto h-6 w-32 rounded-b-2xl bg-gray-900" />

            {/* Chat screen */}
            <div className="bg-[#F2F2F7] px-0" style={{ minHeight: "420px" }}>
              {/* Chat header */}
              <div className="bg-[#F8F8FA] px-4 py-3 text-center border-b border-gray-200/60">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                  Text Message
                </p>
                <p className="text-sm font-semibold text-gray-900 mt-0.5">
                  {business.name}
                </p>
              </div>

              {/* Messages area */}
              <div className="px-4 py-4 space-y-2">
                {/* Timestamp */}
                <p className="text-center text-[10px] text-gray-400 mb-3">
                  Today 2:34 PM
                </p>

                {/* SMS bubble */}
                <div className="flex justify-start">
                  <div
                    className="max-w-[85%] rounded-2xl rounded-tl-md px-4 py-2.5"
                    style={{ backgroundColor: "#E9E9EB" }}
                  >
                    <p className="text-[13px] leading-relaxed text-gray-900 whitespace-pre-wrap">
                      {previewText}
                    </p>
                  </div>
                </div>

                {/* Delivered indicator */}
                <p className="text-right text-[10px] text-gray-400 pr-1 mt-1">
                  Delivered
                </p>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="flex items-center gap-2 bg-[#F8F8FA] px-4 py-3 border-t border-gray-200/60">
              <div className="flex-1 rounded-full bg-white border border-gray-200 px-4 py-2">
                <p className="text-xs text-gray-300">iMessage</p>
              </div>
            </div>

            {/* Home indicator */}
            <div className="flex justify-center bg-[#F8F8FA] pb-2 pt-1">
              <div className="h-1 w-28 rounded-full bg-gray-800" />
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
                    : ""
                }`}
                style={activePreview === key ? undefined : { backgroundColor: "var(--dash-toggle-bg)", color: "var(--dash-text-muted)" }}
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
