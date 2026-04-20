"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { Business } from "@/types/database";
import {
  DEFAULT_EMAIL_TEMPLATES,
  DEFAULT_EMAIL_SUBJECTS,
} from "@/lib/email";

const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" as const },
  }),
};

const SECTION_COLORS = ["#059669", "#2563EB", "#e11d48"];

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

function renderSubject(subject: string, businessName: string): string {
  return subject
    .replace(/\[Business Name\]/g, businessName)
    .replace(/\[Customer Name\]/g, "Sarah");
}

export default function EmailEditor({ business }: EmailEditorProps) {
  const router = useRouter();

  const [confirmationSubject, setConfirmationSubject] = useState(
    business.email_confirmation_subject || DEFAULT_EMAIL_SUBJECTS.confirmation
  );
  const [confirmationTemplate, setConfirmationTemplate] = useState(
    business.email_confirmation_template || DEFAULT_EMAIL_TEMPLATES.confirmation
  );
  const [confirmationEnabled, setConfirmationEnabled] = useState(
    business.email_confirmation_enabled ?? true
  );

  const [approvalSubject, setApprovalSubject] = useState(
    business.email_approval_subject || DEFAULT_EMAIL_SUBJECTS.approval
  );
  const [approvalTemplate, setApprovalTemplate] = useState(
    business.email_approval_template || DEFAULT_EMAIL_TEMPLATES.approval
  );
  const [approvalEnabled, setApprovalEnabled] = useState(
    business.email_approval_enabled ?? true
  );

  const [rejectionSubject, setRejectionSubject] = useState(
    business.email_rejection_subject || DEFAULT_EMAIL_SUBJECTS.rejection
  );
  const [rejectionTemplate, setRejectionTemplate] = useState(
    business.email_rejection_template || DEFAULT_EMAIL_TEMPLATES.rejection
  );
  const [rejectionEnabled, setRejectionEnabled] = useState(
    business.email_rejection_enabled ?? false
  );

  const [couponExpiryDays, setCouponExpiryDays] = useState<number | null>(
    business.default_coupon_expiry_days ?? 30
  );

  const [activePreview, setActivePreview] = useState<
    "confirmation" | "approval" | "rejection"
  >("confirmation");

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const confirmationRef = useRef<HTMLTextAreaElement>(null);
  const approvalRef = useRef<HTMLTextAreaElement>(null);
  const rejectionRef = useRef<HTMLTextAreaElement>(null);

  const inputClasses =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all focus:border-blue-300 focus:ring-2 focus:ring-blue-100";

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/business/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: business.name,
          reward_description: business.reward_description,
          email_confirmation_template: confirmationTemplate,
          email_confirmation_enabled: confirmationEnabled,
          email_confirmation_subject: confirmationSubject,
          email_approval_template: approvalTemplate,
          email_approval_enabled: approvalEnabled,
          email_approval_subject: approvalSubject,
          email_rejection_template: rejectionTemplate,
          email_rejection_enabled: rejectionEnabled,
          email_rejection_subject: rejectionSubject,
          default_coupon_expiry_days: couponExpiryDays,
        }),
      });

      if (res.ok) {
        setToast("Email templates saved");
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

  const previewBody =
    activePreview === "confirmation"
      ? renderPreview(confirmationTemplate, business.name, business.reward_description)
      : activePreview === "approval"
        ? renderPreview(approvalTemplate, business.name, business.reward_description)
        : renderPreview(rejectionTemplate, business.name, business.reward_description);

  const previewSubject =
    activePreview === "confirmation"
      ? renderSubject(confirmationSubject, business.name)
      : activePreview === "approval"
        ? renderSubject(approvalSubject, business.name)
        : renderSubject(rejectionSubject, business.name);

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
      subject: confirmationSubject,
      setSubject: setConfirmationSubject,
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
      subject: approvalSubject,
      setSubject: setApprovalSubject,
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
      subject: rejectionSubject,
      setSubject: setRejectionSubject,
      template: rejectionTemplate,
      setTemplate: setRejectionTemplate,
      enabled: rejectionEnabled,
      setEnabled: setRejectionEnabled,
      ref: rejectionRef,
      showReward: false,
      colorIndex: 2,
    },
  ];

  const avatarInitial = business.name.trim().charAt(0).toUpperCase() || "A";

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
                  Body
                </label>
                <textarea
                  ref={t.ref}
                  value={t.template}
                  onChange={(e) => t.setTemplate(e.target.value)}
                  className={`${inputClasses} min-h-32 resize-y`}
                  onFocus={() => setActivePreview(t.key)}
                />
                <VariableChips
                  textareaRef={t.ref}
                  value={t.template}
                  onChange={t.setTemplate}
                  showReward={t.showReward}
                />
              </div>
            </div>
          </motion.section>
        ))}

        {/* Coupon Settings */}
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
            Coupon Settings
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Auto-generated coupon codes are included in approval emails
          </p>

          <div className="mt-4">
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
            <p className="mt-1.5 text-xs text-gray-400">
              Coupon codes will automatically expire after this period
            </p>
          </div>
        </motion.section>

        <motion.button
          onClick={handleSave}
          disabled={saving}
          whileTap={{ scale: 0.98 }}
          className="w-full rounded-2xl bg-[#2563EB] py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-[#1d4ed8] disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Templates"}
        </motion.button>
      </div>

      {/* Right — Email inbox preview */}
      <div className="hidden lg:block">
        <div className="sticky top-6 flex flex-col items-center">
          <p className="mb-3 text-sm font-medium text-gray-500">
            Email Preview — {previewLabel}
          </p>

          <div
            style={{ width: "380px" }}
            className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl"
          >
            {/* Inbox header */}
            <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
                style={{ backgroundColor: "#2563EB" }}
              >
                {avatarInitial}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] text-gray-500">
                  From: <span className="text-gray-700">{business.name} &lt;contact@astrevix.com&gt;</span>
                </p>
                <p className="truncate text-[11px] text-gray-500">
                  To: <span className="text-gray-700">customer@example.com</span>
                </p>
              </div>
            </div>

            {/* Subject */}
            <div className="border-b border-gray-100 px-5 py-3">
              <p className="text-sm font-semibold text-gray-900">
                {previewSubject}
              </p>
            </div>

            {/* Body */}
            <div className="px-5 py-5" style={{ minHeight: "280px" }}>
              <p className="whitespace-pre-line text-[13px] leading-relaxed text-gray-800">
                {previewBody}
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
