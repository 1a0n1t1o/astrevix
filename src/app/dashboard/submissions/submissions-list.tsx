"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { Submission, RewardTier } from "@/types/database";
import { formatPhoneForDisplay } from "@/lib/phone-utils";
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
  Shield,
  ShieldCheck,
  ShieldX,
  Star,
  AlertTriangle,
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

const TIER_PLATFORM_ICONS: Record<string, React.ReactNode> = {
  instagram: <Instagram className="h-4 w-4" />,
  tiktok: <Music className="h-4 w-4" />,
  facebook: <Facebook className="h-4 w-4" />,
  google: <Star className="h-4 w-4" />,
};

const TIER_PLATFORM_COLORS: Record<string, { bg: string; text: string }> = {
  instagram: { bg: "#fce7f3", text: "#db2777" },
  tiktok: { bg: "#ede9fe", text: "#7c3aed" },
  facebook: { bg: "#dbeafe", text: "#2563eb" },
  google: { bg: "#fef3c7", text: "#d97706" },
};

function getVerificationInfo(sub: Submission) {
  if (!sub.verification_deadline || !sub.verification_status) return null;

  const deadline = new Date(sub.verification_deadline);
  const now = new Date();
  const isPast = now >= deadline;
  const diffMs = deadline.getTime() - now.getTime();
  const diffHours = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60)));

  let timeLabel = "";
  if (isPast) {
    timeLabel = "Deadline passed";
  } else if (diffHours > 24) {
    const days = Math.ceil(diffHours / 24);
    timeLabel = `${days} day${days > 1 ? "s" : ""} remaining`;
  } else {
    timeLabel = `${diffHours} hour${diffHours !== 1 ? "s" : ""} remaining`;
  }

  return {
    status: sub.verification_status,
    isPast,
    diffHours,
    timeLabel,
    deadline: deadline.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }),
  };
}

interface SmsTemplateData {
  approvalTemplate: string | null;
  rejectionTemplate: string | null;
  businessName: string;
  rewardDescription: string;
}

interface SubmissionsListProps {
  readonly submissions: Submission[];
  readonly businessId: string;
  readonly rewardDescription: string;
  readonly rewardTiers: RewardTier[];
  readonly hasSmsTemplate: boolean;
  readonly smsTemplateData: SmsTemplateData;
}

function renderSmsPreview(
  template: string,
  customerName: string,
  businessName: string,
  reward: string,
  note: string
): string {
  let result = template
    .replace(/\[Business Name\]/g, businessName)
    .replace(/\[Customer Name\]/g, customerName)
    .replace(/\[Reward Details\]/g, reward)
    .replace(/\[Reward Link\]/g, "");
  if (note) {
    result += `\n\n${note}`;
  }
  return result;
}

export default function SubmissionsList({
  submissions,
  businessId,
  rewardDescription,
  rewardTiers,
  hasSmsTemplate,
  smsTemplateData,
}: SubmissionsListProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [rewardValue, setRewardValue] = useState<string>("");
  const [commentValue, setCommentValue] = useState<string>("");
  const [personalNoteOpen, setPersonalNoteOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewSub, setPreviewSub] = useState<Submission | null>(null);
  const router = useRouter();

  // Suppress unused variable warning
  void businessId;

  // Build a lookup map for reward tiers
  const tierMap = new Map(rewardTiers.map((t) => [t.id, t]));

  const query = searchQuery.toLowerCase().trim();

  const searched = query
    ? submissions.filter(
        (s) =>
          s.customer_name.toLowerCase().includes(query) ||
          (s.customer_phone || "").includes(query) ||
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
      // Pre-fill reward with tier-specific value if available
      const sub = submissions.find((s) => s.id === id);
      const tier = sub?.reward_tier_id ? tierMap.get(sub.reward_tier_id) : null;
      setRewardValue(tier?.reward_description || rewardDescription);
      setCommentValue("");
      setPersonalNoteOpen(false);
    }
  }

  async function handleVerify(id: string, action: "verify" | "fail") {
    setVerifyingId(id);
    try {
      await fetch(`/api/submissions/${id}/verify?action=${action}`, {
        method: "PATCH",
      });
      router.refresh();
    } catch {
      // silently fail
    } finally {
      setVerifyingId(null);
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

  const st = smsTemplateData;

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
            placeholder="Search by name, phone, or link..."
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
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-gray-900">
                          {sub.customer_name}
                        </p>
                        {platformLabel && (
                          <span className="rounded-lg bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                            {platformLabel}
                          </span>
                        )}
                        {sub.reward_tier_id && tierMap.get(sub.reward_tier_id) && (
                          <span
                            className="rounded-lg px-2 py-0.5 text-xs font-medium"
                            style={{
                              backgroundColor: TIER_PLATFORM_COLORS[tierMap.get(sub.reward_tier_id)!.platform]?.bg || "#f3f4f6",
                              color: TIER_PLATFORM_COLORS[tierMap.get(sub.reward_tier_id)!.platform]?.text || "#6b7280",
                            }}
                          >
                            {tierMap.get(sub.reward_tier_id)!.tier_name}
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
                                Phone
                              </p>
                              <p className="mt-1 text-sm text-gray-900">
                                {formatPhoneForDisplay(sub.customer_phone)}
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

                          {/* Tier info + Verification status */}
                          {(() => {
                            const tier = sub.reward_tier_id ? tierMap.get(sub.reward_tier_id) : null;
                            const vInfo = getVerificationInfo(sub);
                            if (!tier && !vInfo) return null;

                            return (
                              <div className="mt-4 rounded-xl border border-gray-100 bg-white p-4">
                                {/* Tier info */}
                                {tier && (
                                  <div className="flex items-center gap-3">
                                    <div
                                      className="flex h-8 w-8 items-center justify-center rounded-lg"
                                      style={{
                                        backgroundColor: TIER_PLATFORM_COLORS[tier.platform]?.bg || "#f3f4f6",
                                        color: TIER_PLATFORM_COLORS[tier.platform]?.text || "#6b7280",
                                      }}
                                    >
                                      {TIER_PLATFORM_ICONS[tier.platform] || <Gift className="h-4 w-4" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-medium text-gray-500">{tier.tier_name}</p>
                                      <p className="text-sm font-semibold text-gray-900">{tier.reward_description}</p>
                                    </div>
                                    {tier.reward_value && (
                                      <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                                        {tier.reward_value}
                                      </span>
                                    )}
                                  </div>
                                )}

                                {/* Verification status */}
                                {vInfo && (
                                  <div className={`${tier ? "mt-3 border-t border-gray-100 pt-3" : ""}`}>
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        {vInfo.status === "verified" ? (
                                          <ShieldCheck className="h-4 w-4 text-emerald-500" />
                                        ) : vInfo.status === "failed" ? (
                                          <ShieldX className="h-4 w-4 text-red-500" />
                                        ) : vInfo.status === "expired" ? (
                                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                                        ) : (
                                          <Shield className="h-4 w-4 text-blue-500" />
                                        )}
                                        <span className="text-xs font-medium text-gray-600">
                                          Verification:{" "}
                                          <span
                                            className={`font-semibold capitalize ${
                                              vInfo.status === "verified"
                                                ? "text-emerald-600"
                                                : vInfo.status === "failed"
                                                  ? "text-red-600"
                                                  : vInfo.status === "expired"
                                                    ? "text-amber-600"
                                                    : "text-blue-600"
                                            }`}
                                          >
                                            {vInfo.status}
                                          </span>
                                        </span>
                                      </div>
                                      <span className="text-xs text-gray-500">
                                        {vInfo.status === "pending" ? vInfo.timeLabel : `Deadline: ${vInfo.deadline}`}
                                      </span>
                                    </div>

                                    {/* Verify/Fail buttons — only show for pending submissions */}
                                    {vInfo.status === "pending" && !isReviewed && (
                                      <div className="mt-3 flex gap-2">
                                        <button
                                          onClick={() => handleVerify(sub.id, "verify")}
                                          disabled={!vInfo.isPast || verifyingId === sub.id}
                                          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                          style={{
                                            backgroundColor: vInfo.isPast ? "#ecfdf5" : "#f3f4f6",
                                            color: vInfo.isPast ? "#059669" : "#9ca3af",
                                            border: `1px solid ${vInfo.isPast ? "#a7f3d0" : "#e5e7eb"}`,
                                          }}
                                          title={!vInfo.isPast ? "Wait until the verification deadline passes" : "Mark the post as verified"}
                                        >
                                          {verifyingId === sub.id ? (
                                            <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-emerald-300/30 border-t-emerald-500" />
                                          ) : (
                                            <ShieldCheck className="h-3.5 w-3.5" />
                                          )}
                                          {vInfo.isPast ? "Verify Post" : `Verify in ${vInfo.diffHours}h`}
                                        </button>
                                        <button
                                          onClick={() => handleVerify(sub.id, "fail")}
                                          disabled={verifyingId === sub.id}
                                          className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                          <ShieldX className="h-3.5 w-3.5" />
                                          Post Removed
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })()}

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

                              {/* SMS template notice */}
                              {hasSmsTemplate ? (
                                <div className="mb-3 flex items-center justify-between rounded-lg bg-blue-50 border border-blue-100 px-3 py-2.5">
                                  <div className="flex items-center gap-2">
                                    <svg className="h-4 w-4 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                                    </svg>
                                    <p className="text-xs text-blue-700">
                                      Reward SMS will be sent using your template
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
                                    <a href="/dashboard/sms" className="font-medium underline hover:text-amber-900">Set up your SMS templates</a>{" "}
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
                                        placeholder="Add a personal note to include in the SMS..."
                                        rows={2}
                                        className="mt-2 w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20"
                                      />
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>

                              {/* Action buttons — approval gated by verification for tiered submissions */}
                              <div className="flex gap-2">
                                <button
                                  onClick={() =>
                                    handleReview(sub.id, "approved")
                                  }
                                  disabled={
                                    isUpdating ||
                                    (!!sub.reward_tier_id &&
                                      !!sub.verification_status &&
                                      sub.verification_status !== "verified")
                                  }
                                  title={
                                    sub.reward_tier_id &&
                                    sub.verification_status &&
                                    sub.verification_status !== "verified"
                                      ? "Post must be verified before approval"
                                      : undefined
                                  }
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

      {/* SMS Preview Modal */}
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
              className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                <h3 className="text-base font-semibold text-gray-900">
                  SMS Preview
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

              {/* SMS preview */}
              <div className="bg-[#F2F2F7] px-4 py-6">
                <p className="text-center text-[10px] text-gray-400 mb-3">
                  Text Message from {st.businessName}
                </p>
                <div className="flex justify-start">
                  <div
                    className="max-w-[90%] rounded-2xl rounded-tl-md px-4 py-3"
                    style={{ backgroundColor: "#E9E9EB" }}
                  >
                    <p className="text-[13px] leading-relaxed text-gray-900 whitespace-pre-wrap">
                      {renderSmsPreview(
                        st.approvalTemplate ||
                          "Great news! Your post for [Business Name] has been approved! Here's your reward: [Reward Details]. Thank you for your support!",
                        previewSub.customer_name,
                        st.businessName,
                        rewardValue || st.rewardDescription,
                        commentValue
                      )}
                    </p>
                  </div>
                </div>
                <p className="text-right text-[10px] text-gray-400 pr-1 mt-2">
                  Delivered
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
