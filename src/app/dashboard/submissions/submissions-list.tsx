"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { Submission } from "@/types/database";
import {
  Instagram,
  Music,
  Youtube,
  Twitter,
  Facebook,
  Link,
  Inbox,
  Clock,
  CheckCircle,
  XCircle,
  Gift,
  ChevronDown,
  Search,
  X,
} from "lucide-react";

type FilterTab = "all" | "pending" | "approved" | "rejected";

const TABS: { label: string; value: FilterTab; color: string }[] = [
  { label: "All", value: "all", color: "#2563EB" },
  { label: "Pending", value: "pending", color: "#d97706" },
  { label: "Approved", value: "approved", color: "#059669" },
  { label: "Rejected", value: "rejected", color: "#e11d48" },
];

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  instagram: <Instagram className="h-5 w-5" />,
  tiktok: <Music className="h-5 w-5" />,
  youtube: <Youtube className="h-5 w-5" />,
  x: <Twitter className="h-5 w-5" />,
  facebook: <Facebook className="h-5 w-5" />,
};

const PLATFORM_LABELS: Record<string, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
  x: "X",
  facebook: "Facebook",
};

const EMPTY_STATE_ICONS: Record<string, React.ReactNode> = {
  all: <Inbox className="mx-auto h-10 w-10 text-gray-300" />,
  pending: <Clock className="mx-auto h-10 w-10 text-gray-300" />,
  approved: <CheckCircle className="mx-auto h-10 w-10 text-gray-300" />,
  rejected: <XCircle className="mx-auto h-10 w-10 text-gray-300" />,
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

interface EmailTemplateData {
  subject: string | null;
  header: string | null;
  body: string | null;
  footer: string | null;
  brandColor: string | null;
  logoUrl: string | null;
  rewardFileUrl: string | null;
  rewardFileName: string | null;
  businessName: string;
}

interface SubmissionsListProps {
  readonly submissions: Submission[];
  readonly businessId: string;
  readonly rewardDescription: string;
  readonly hasEmailTemplate: boolean;
  readonly emailTemplateData: EmailTemplateData;
}

export default function SubmissionsList({
  submissions,
  businessId,
  rewardDescription,
  hasEmailTemplate,
  emailTemplateData,
}: SubmissionsListProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [rewardValue, setRewardValue] = useState<string>("");
  const [commentValue, setCommentValue] = useState<string>("");
  const [personalNoteOpen, setPersonalNoteOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewSub, setPreviewSub] = useState<Submission | null>(null);
  const router = useRouter();

  // Suppress unused variable warning
  void businessId;

  const query = searchQuery.toLowerCase().trim();

  const searched = query
    ? submissions.filter(
        (s) =>
          s.customer_name.toLowerCase().includes(query) ||
          s.customer_email.toLowerCase().includes(query) ||
          s.post_url.toLowerCase().includes(query)
      )
    : submissions;

  const filtered =
    activeTab === "all"
      ? searched
      : searched.filter((s) => s.status === activeTab);

  function toggleExpand(id: string) {
    if (expandedId === id) {
      setExpandedId(null);
      setRewardValue("");
      setCommentValue("");
      setPersonalNoteOpen(false);
    } else {
      setExpandedId(id);
      setRewardValue(rewardDescription);
      setCommentValue("");
      setPersonalNoteOpen(false);
    }
  }

  function openPreview(sub: Submission) {
    setPreviewSub(sub);
    setPreviewModalOpen(true);
  }

  async function handleReview(id: string, status: "approved" | "rejected") {
    setUpdatingId(id);
    try {
      await fetch(`/api/submissions/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          reward_given: status === "approved" ? rewardValue : null,
          review_comment: commentValue || null,
        }),
      });
      setExpandedId(null);
      setRewardValue("");
      setCommentValue("");
      setPersonalNoteOpen(false);
      router.refresh();
    } catch {
      // silently fail
    } finally {
      setUpdatingId(null);
    }
  }

  const et = emailTemplateData;
  const brandColor = et.brandColor || "#2563EB";

  return (
    <div>
      {/* Filter Tabs */}
      <div className="mb-6 flex gap-2">
        {TABS.map((tab) => {
          const count =
            tab.value === "all"
              ? searched.length
              : searched.filter((s) => s.status === tab.value).length;
          const isActive = activeTab === tab.value;

          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`relative rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? ""
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
              style={isActive ? { color: tab.color } : undefined}
            >
              {isActive && (
                <motion.div
                  layoutId="submissions-tab-indicator"
                  className="absolute inset-0 rounded-xl"
                  style={{ zIndex: -1, backgroundColor: `${tab.color}15` }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              {tab.label}
              <span
                className={`ml-1.5 rounded-full px-1.5 py-0.5 text-xs ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Bar */}
      {submissions.length > 0 && (
        <div className="relative mb-5">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or link..."
            className="w-full rounded-xl border border-gray-200 bg-white/80 py-2.5 pl-10 pr-9 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10"
            style={{ backdropFilter: "blur(8px)" }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {/* Submissions List */}
      {filtered.length === 0 ? (
        <div className="dash-animate-scale-in rounded-2xl border border-gray-100 bg-white/70 p-12 text-center shadow-[0_4px_24px_-4px_rgba(37,99,235,0.06)]">
          <div className="mx-auto mb-4">
            {query ? (
              <Search className="mx-auto h-10 w-10 text-gray-300" />
            ) : (
              EMPTY_STATE_ICONS[activeTab]
            )}
          </div>
          <p className="font-medium text-gray-900">
            {query
              ? "No results found"
              : activeTab === "all"
                ? "No submissions yet"
                : `No ${activeTab} submissions`}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            {query
              ? `No submissions match "${searchQuery}"`
              : activeTab === "all"
                ? "Share your QR code to start getting customer content!"
                : `You don't have any ${activeTab} submissions right now.`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((sub, index) => {
              const platformIcon = sub.detected_platform
                ? PLATFORM_ICONS[sub.detected_platform]
                : null;
              const platformLabel = sub.detected_platform
                ? PLATFORM_LABELS[sub.detected_platform]
                : null;
              const isExpanded = expandedId === sub.id;
              const isUpdating = updatingId === sub.id;
              const isReviewed = sub.status !== "pending";

              return (
                <motion.div
                  key={sub.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{
                    delay: index * 0.05,
                    duration: 0.3,
                    ease: "easeOut",
                  }}
                  whileHover={
                    !isExpanded
                      ? {
                          y: -2,
                          boxShadow:
                            "0 8px 24px -4px rgba(37, 99, 235, 0.08)",
                        }
                      : undefined
                  }
                  className={`rounded-2xl border transition-colors duration-200 ${
                    isExpanded
                      ? "border-[#2563EB]/20"
                      : "border-gray-100/80 hover:border-gray-200"
                  }`}
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    boxShadow: isExpanded
                      ? "0 8px 32px -4px rgba(37, 99, 235, 0.12)"
                      : "0 2px 12px -2px rgba(0, 0, 0, 0.04)",
                  }}
                >
                  {/* Card Header — always visible, clickable */}
                  <button
                    onClick={() => toggleExpand(sub.id)}
                    className="flex w-full items-center gap-4 p-5 text-left"
                  >
                    {/* Platform avatar */}
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                      style={{
                        backgroundColor:
                          sub.detected_platform === "instagram"
                            ? "#fce7f3"
                            : sub.detected_platform === "tiktok"
                              ? "#ede9fe"
                              : sub.detected_platform === "youtube"
                                ? "#fee2e2"
                                : sub.detected_platform === "x"
                                  ? "#f3f4f6"
                                  : sub.detected_platform === "facebook"
                                    ? "#dbeafe"
                                    : "#f3f4f6",
                        color:
                          sub.detected_platform === "instagram"
                            ? "#db2777"
                            : sub.detected_platform === "tiktok"
                              ? "#7c3aed"
                              : sub.detected_platform === "youtube"
                                ? "#dc2626"
                                : sub.detected_platform === "x"
                                  ? "#1f2937"
                                  : sub.detected_platform === "facebook"
                                    ? "#2563eb"
                                    : "#6b7280",
                      }}
                    >
                      {platformIcon || <Link className="h-5 w-5" />}
                    </div>

                    {/* Customer info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">
                          {sub.customer_name}
                        </p>
                        {platformLabel && (
                          <span className="rounded-lg bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                            {platformLabel}
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">
                        {formatDate(sub.created_at)} at{" "}
                        {formatTime(sub.created_at)}
                      </p>
                    </div>

                    {/* Status badge */}
                    <span
                      className={`shrink-0 inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium capitalize ${
                        sub.status === "pending"
                          ? "border-amber-200 bg-amber-50 text-amber-700"
                          : sub.status === "approved"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-red-200 bg-red-50 text-red-700"
                      }`}
                    >
                      {sub.status}
                    </span>

                    {/* Expand chevron */}
                    <svg
                      className={`h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                      />
                    </svg>
                  </button>

                  {/* Expanded Panel */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-gray-100 px-5 pb-5 pt-4">
                          {/* Submission details */}
                          <div className="grid gap-3 sm:grid-cols-2">
                            <div>
                              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Email
                              </p>
                              <p className="mt-1 text-sm text-gray-900">
                                {sub.customer_email}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Post URL
                              </p>
                              <a
                                href={sub.post_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-1 block truncate text-sm text-[#2563EB] hover:underline"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {sub.post_url
                                  .replace(/^https?:\/\//, "")
                                  .substring(0, 50)}
                                {sub.post_url.replace(/^https?:\/\//, "")
                                  .length > 50
                                  ? "..."
                                  : ""}
                              </a>
                            </div>
                          </div>

                          {/* Reviewed submission details */}
                          {isReviewed && (
                            <div className="mt-4 rounded-xl bg-gray-50 p-4">
                              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                                Review Details
                              </p>
                              <div className="grid gap-3 sm:grid-cols-2">
                                {sub.reward_given && (
                                  <div>
                                    <p className="text-xs text-gray-500">
                                      Reward given
                                    </p>
                                    <p className="mt-0.5 flex items-center gap-1.5 text-sm font-medium text-gray-900">
                                      <Gift className="h-4 w-4 text-emerald-500" />{" "}
                                      {sub.reward_given}
                                    </p>
                                  </div>
                                )}
                                {sub.reviewed_at && (
                                  <div>
                                    <p className="text-xs text-gray-500">
                                      Reviewed on
                                    </p>
                                    <p className="mt-0.5 text-sm text-gray-900">
                                      {formatDate(sub.reviewed_at)}
                                    </p>
                                  </div>
                                )}
                              </div>
                              {sub.review_comment && (
                                <div className="mt-3">
                                  <p className="text-xs text-gray-500">
                                    Personal note
                                  </p>
                                  <p className="mt-0.5 text-sm text-gray-700">
                                    {sub.review_comment}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Review panel — pending only */}
                          {!isReviewed && (
                            <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                              <p className="text-sm font-medium text-gray-900 mb-3">
                                Review this submission
                              </p>

                              {/* Reward selector */}
                              <div className="mb-3">
                                <label
                                  htmlFor={`reward-${sub.id}`}
                                  className="mb-1.5 block text-xs font-medium text-gray-500"
                                >
                                  Reward to give
                                </label>
                                <input
                                  id={`reward-${sub.id}`}
                                  type="text"
                                  value={rewardValue}
                                  onChange={(e) =>
                                    setRewardValue(e.target.value)
                                  }
                                  placeholder="e.g. 10% off your next visit"
                                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20"
                                />
                              </div>

                              {/* Email template notice */}
                              {hasEmailTemplate ? (
                                <div className="mb-3 flex items-center justify-between rounded-lg bg-blue-50 border border-blue-100 px-3 py-2.5">
                                  <div className="flex items-center gap-2">
                                    <svg className="h-4 w-4 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                    </svg>
                                    <p className="text-xs text-blue-700">
                                      Reward email will be sent using your template
                                    </p>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openPreview(sub);
                                    }}
                                    className="text-xs font-medium text-blue-600 hover:text-blue-800"
                                  >
                                    Preview
                                  </button>
                                </div>
                              ) : (
                                <div className="mb-3 flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-100 px-3 py-2.5">
                                  <svg className="h-4 w-4 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                  </svg>
                                  <p className="text-xs text-amber-700">
                                    <a href="/dashboard/email" className="font-medium underline hover:text-amber-900">Set up your reward email template</a>{" "}
                                    to customize what customers receive
                                  </p>
                                </div>
                              )}

                              {/* Collapsible personal note */}
                              <div className="mb-4">
                                <button
                                  type="button"
                                  onClick={() => setPersonalNoteOpen(!personalNoteOpen)}
                                  className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-700"
                                >
                                  <ChevronDown
                                    className={`h-3.5 w-3.5 transition-transform duration-200 ${
                                      personalNoteOpen ? "rotate-180" : ""
                                    }`}
                                  />
                                  Add a personal note{" "}
                                  <span className="font-normal text-gray-400">
                                    (optional)
                                  </span>
                                </button>
                                <AnimatePresence>
                                  {personalNoteOpen && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.2 }}
                                      className="overflow-hidden"
                                    >
                                      <textarea
                                        id={`comment-${sub.id}`}
                                        value={commentValue}
                                        onChange={(e) =>
                                          setCommentValue(e.target.value)
                                        }
                                        placeholder="Add a personal message to include in the reward email..."
                                        rows={2}
                                        className="mt-2 w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20"
                                      />
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>

                              {/* Action buttons */}
                              <div className="flex gap-2">
                                <button
                                  onClick={() =>
                                    handleReview(sub.id, "approved")
                                  }
                                  disabled={isUpdating}
                                  className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {isUpdating ? (
                                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
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
                                  Approve
                                </button>
                                <button
                                  onClick={() =>
                                    handleReview(sub.id, "rejected")
                                  }
                                  disabled={isUpdating}
                                  className="flex items-center gap-1.5 rounded-lg bg-white border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {isUpdating ? (
                                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-red-300/30 border-t-red-500" />
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
                                        d="M6 18L18 6M6 6l12 12"
                                      />
                                    </svg>
                                  )}
                                  Reject
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Email Preview Modal */}
      <AnimatePresence>
        {previewModalOpen && previewSub && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
              onClick={() => setPreviewModalOpen(false)}
            />
            {/* Modal content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl"
            >
              {/* Modal header */}
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
                <h3 className="text-base font-semibold text-gray-900">
                  Email Preview
                </h3>
                <button
                  onClick={() => setPreviewModalOpen(false)}
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Email preview */}
              <div style={{ backgroundColor: "#f9fafb", padding: "20px 16px" }}>
                <div style={{ maxWidth: "520px", margin: "0 auto", backgroundColor: "#ffffff", borderRadius: "12px", overflow: "hidden", border: "1px solid #e5e7eb" }}>
                  {/* Header */}
                  <div style={{ backgroundColor: brandColor, padding: "24px 24px 20px" }}>
                    {et.logoUrl && (
                      <img src={et.logoUrl} alt={et.businessName} style={{ width: "40px", height: "40px", borderRadius: "10px", marginBottom: "10px", objectFit: "cover" }} />
                    )}
                    <p style={{ margin: 0, color: "#ffffff", fontSize: "18px", fontWeight: 600 }}>
                      {et.header || "Thank you for your post!"}
                    </p>
                    <p style={{ margin: "6px 0 0", color: "rgba(255,255,255,0.85)", fontSize: "13px" }}>
                      Your post has been approved
                    </p>
                  </div>

                  {/* Body */}
                  <div style={{ padding: "24px" }}>
                    <p style={{ margin: "0 0 12px", color: "#111827", fontSize: "13px", lineHeight: 1.6 }}>
                      Hi {previewSub.customer_name},
                    </p>
                    <p style={{ margin: "0 0 16px", color: "#374151", fontSize: "13px", lineHeight: 1.6 }}>
                      {et.body || "We appreciate you sharing your experience. Here's your reward as a thank you!"}
                    </p>

                    {/* Reward */}
                    {rewardValue && (
                      <div style={{ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "10px", padding: "16px", marginBottom: "16px" }}>
                        <p style={{ margin: "0 0 4px", color: "#15803d", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Your Reward</p>
                        <p style={{ margin: 0, color: "#166534", fontSize: "15px", fontWeight: 600 }}>{rewardValue}</p>
                      </div>
                    )}

                    {/* Personal note */}
                    {commentValue && (
                      <div style={{ backgroundColor: "#f9fafb", borderRadius: "10px", padding: "12px 16px", marginBottom: "16px" }}>
                        <p style={{ margin: "0 0 4px", color: "#6b7280", fontSize: "11px", fontWeight: 500 }}>Personal note from {et.businessName}</p>
                        <p style={{ margin: 0, color: "#374151", fontSize: "12px", lineHeight: 1.5, fontStyle: "italic" }}>&ldquo;{commentValue}&rdquo;</p>
                      </div>
                    )}

                    {/* Attachment */}
                    {et.rewardFileName && (
                      <div style={{ backgroundColor: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "10px", padding: "12px 14px", marginBottom: "16px" }}>
                        <p style={{ margin: 0, color: "#1e40af", fontSize: "12px" }}>
                          &#128206; {et.rewardFileName}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div style={{ borderTop: "1px solid #f3f4f6", padding: "16px 24px", textAlign: "center" }}>
                    <p style={{ margin: 0, color: "#6b7280", fontSize: "11px" }}>
                      {et.footer || `Thanks for being a valued customer of ${et.businessName}`}
                    </p>
                    <p style={{ margin: "6px 0 0", color: "#9ca3af", fontSize: "10px" }}>Sent via Astrevix</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
