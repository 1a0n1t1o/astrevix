"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { Submission, RewardTier, CouponCode } from "@/types/database";
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
  Ticket,
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
  all: <Inbox className="mx-auto h-10 w-10" style={{ color: "var(--dash-text-muted)" }} />,
  pending: <Clock className="mx-auto h-10 w-10" style={{ color: "var(--dash-text-muted)" }} />,
  approved: <CheckCircle className="mx-auto h-10 w-10" style={{ color: "var(--dash-text-muted)" }} />,
  rejected: <XCircle className="mx-auto h-10 w-10" style={{ color: "var(--dash-text-muted)" }} />,
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
  readonly couponCodes: CouponCode[];
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
    .replace(/\[Reward Link\]/g, "")
    .replace(/\[Coupon Code\]/g, "AX7K2M");
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
  couponCodes,
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
  const [earlyApprovalSub, setEarlyApprovalSub] = useState<Submission | null>(null);
  const router = useRouter();

  // Suppress unused variable warning
  void businessId;

  // Build a lookup map for reward tiers
  const tierMap = new Map(rewardTiers.map((t) => [t.id, t]));

  // Build a lookup map for coupon codes by submission_id
  const couponMap = new Map(couponCodes.map((c) => [c.submission_id, c]));

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

  function handleApproveClick(sub: Submission) {
    // Check if this submission has a verification deadline that hasn't passed
    const vInfo = getVerificationInfo(sub);
    if (vInfo && vInfo.status === "pending" && !vInfo.isPast) {
      // Show early approval confirmation modal
      setEarlyApprovalSub(sub);
    } else {
      // Approve normally
      handleReview(sub.id, "approved");
    }
  }

  function getEarlyApprovalTimeInfo(sub: Submission) {
    const created = new Date(sub.created_at);
    const now = new Date();
    const elapsedMs = now.getTime() - created.getTime();
    const elapsedHours = Math.floor(elapsedMs / (1000 * 60 * 60));
    const elapsedMinutes = Math.floor((elapsedMs % (1000 * 60 * 60)) / (1000 * 60));

    const vInfo = getVerificationInfo(sub);
    const remainingHours = vInfo ? Math.floor(vInfo.diffHours) : 0;
    const remainingMs = vInfo ? new Date(sub.verification_deadline!).getTime() - now.getTime() : 0;
    const remainingMinutes = Math.max(0, Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60)));

    return {
      elapsed: elapsedHours > 0
        ? `${elapsedHours} hour${elapsedHours !== 1 ? "s" : ""}${elapsedMinutes > 0 ? `, ${elapsedMinutes} minute${elapsedMinutes !== 1 ? "s" : ""}` : ""}`
        : `${elapsedMinutes} minute${elapsedMinutes !== 1 ? "s" : ""}`,
      remaining: remainingHours > 0
        ? `${remainingHours} hour${remainingHours !== 1 ? "s" : ""}${remainingMinutes > 0 ? `, ${remainingMinutes} minute${remainingMinutes !== 1 ? "s" : ""}` : ""}`
        : `${remainingMinutes} minute${remainingMinutes !== 1 ? "s" : ""}`,
    };
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
              className={`relative rounded-xl px-4 py-2 text-sm font-medium transition-colors`}
              style={isActive ? { color: tab.color } : { color: "var(--dash-text-secondary)" }}
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
                className="ml-1.5 rounded-full px-1.5 py-0.5 text-xs"
                style={isActive
                  ? { backgroundColor: "rgba(255,255,255,0.2)", color: "white" }
                  : { backgroundColor: "var(--dash-hover)", color: "var(--dash-text-secondary)" }
                }
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
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "var(--dash-text-muted)" }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, phone, or link..."
            className="w-full rounded-xl border py-2.5 pl-10 pr-9 text-sm outline-none transition-all focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10"
            style={{ backdropFilter: "blur(8px)", backgroundColor: "var(--dash-card-bg)", borderColor: "var(--dash-card-border)", color: "var(--dash-text)" }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-0.5"
              style={{ color: "var(--dash-text-muted)" }}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {/* Submissions List */}
      {filtered.length === 0 ? (
        <div className="dash-animate-scale-in rounded-2xl border p-12 text-center shadow-[0_4px_24px_-4px_rgba(37,99,235,0.06)]" style={{ borderColor: "var(--dash-card-border)", backgroundColor: "var(--dash-card-bg)" }}>
          <div className="mx-auto mb-4">
            {query ? (
              <Search className="mx-auto h-10 w-10" style={{ color: "var(--dash-text-muted)" }} />
            ) : (
              EMPTY_STATE_ICONS[activeTab]
            )}
          </div>
          <p className="font-medium" style={{ color: "var(--dash-text)" }}>
            {query
              ? "No results found"
              : activeTab === "all"
                ? "No submissions yet"
                : `No ${activeTab} submissions`}
          </p>
          <p className="mt-1 text-sm" style={{ color: "var(--dash-text-secondary)" }}>
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
                      : ""
                  }`}
                  style={{
                    backgroundColor: "var(--dash-card-bg)",
                    borderColor: isExpanded ? undefined : "var(--dash-card-border)",
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
                        <p className="font-medium" style={{ color: "var(--dash-text)" }}>
                          {sub.customer_name}
                        </p>
                        {platformLabel && (
                          <span className="rounded-lg px-2 py-0.5 text-xs font-medium" style={{ backgroundColor: "var(--dash-hover)", color: "var(--dash-text-secondary)" }}>
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
                            {tierMap.get(sub.reward_tier_id)!.reward_value || tierMap.get(sub.reward_tier_id)!.reward_description}
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-sm" style={{ color: "var(--dash-text-secondary)" }}>
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
                      className={`h-5 w-5 shrink-0 transition-transform duration-200 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                      style={{ color: "var(--dash-text-muted)" }}
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
                        <div className="border-t px-5 pb-5 pt-4" style={{ borderColor: "var(--dash-divider)" }}>
                          {/* Submission details */}
                          <div className="grid gap-3 sm:grid-cols-2">
                            <div>
                              <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--dash-text-muted)" }}>
                                Phone
                              </p>
                              <p className="mt-1 text-sm" style={{ color: "var(--dash-text)" }}>
                                {formatPhoneForDisplay(sub.customer_phone)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--dash-text-muted)" }}>
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
                              <div className="mt-4 rounded-xl border p-4" style={{ borderColor: "var(--dash-card-border)", backgroundColor: "var(--dash-card-bg)" }}>
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
                                      <p className="text-xs font-medium" style={{ color: "var(--dash-text-secondary)" }}>{tier.tier_name}</p>
                                      <p className="text-sm font-semibold" style={{ color: "var(--dash-text)" }}>{tier.reward_description}</p>
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
                                  <div className={`${tier ? "mt-3 border-t pt-3" : ""}`} style={tier ? { borderColor: "var(--dash-divider)" } : undefined}>
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        {vInfo.status === "verified" ? (
                                          <ShieldCheck className="h-4 w-4 text-emerald-500" />
                                        ) : vInfo.status === "failed" ? (
                                          <ShieldX className="h-4 w-4 text-red-500" />
                                        ) : vInfo.status === "expired" ? (
                                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                                        ) : vInfo.isPast ? (
                                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                                        ) : (
                                          <Shield className="h-4 w-4 text-blue-500" />
                                        )}
                                        <span className="text-xs font-medium" style={{ color: "var(--dash-text-secondary)" }}>
                                          {vInfo.status === "pending" && vInfo.isPast ? (
                                            <span className="font-semibold text-emerald-600">
                                              Verification period complete
                                            </span>
                                          ) : (
                                            <>
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
                                            </>
                                          )}
                                        </span>
                                      </div>
                                      <span className="text-xs" style={{ color: "var(--dash-text-secondary)" }}>
                                        {vInfo.status === "pending" && vInfo.isPast
                                          ? ""
                                          : vInfo.status === "pending"
                                            ? vInfo.timeLabel
                                            : `Deadline: ${vInfo.deadline}`}
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
                                          className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                          style={{ backgroundColor: "var(--dash-card-bg)" }}
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
                            <div className="mt-4 rounded-xl p-4" style={{ backgroundColor: "var(--dash-hover)" }}>
                              <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "var(--dash-text-muted)" }}>
                                Review Details
                              </p>
                              <div className="grid gap-3 sm:grid-cols-2">
                                {sub.reward_given && (
                                  <div>
                                    <p className="text-xs" style={{ color: "var(--dash-text-secondary)" }}>
                                      Reward given
                                    </p>
                                    <p className="mt-0.5 flex items-center gap-1.5 text-sm font-medium" style={{ color: "var(--dash-text)" }}>
                                      <Gift className="h-4 w-4 text-emerald-500" />{" "}
                                      {sub.reward_given}
                                    </p>
                                  </div>
                                )}
                                {sub.reviewed_at && (
                                  <div>
                                    <p className="text-xs" style={{ color: "var(--dash-text-secondary)" }}>
                                      Reviewed on
                                    </p>
                                    <p className="mt-0.5 text-sm" style={{ color: "var(--dash-text)" }}>
                                      {formatDate(sub.reviewed_at)}
                                    </p>
                                  </div>
                                )}
                              </div>
                              {sub.review_comment && (
                                <div className="mt-3">
                                  <p className="text-xs" style={{ color: "var(--dash-text-secondary)" }}>
                                    Personal note
                                  </p>
                                  <p className="mt-0.5 text-sm" style={{ color: "var(--dash-text-secondary)" }}>
                                    {sub.review_comment}
                                  </p>
                                </div>
                              )}

                              {/* Coupon code display for approved submissions */}
                              {sub.status === "approved" && couponMap.has(sub.id) && (() => {
                                const coupon = couponMap.get(sub.id)!;
                                return (
                                  <div className="mt-3 rounded-lg border border-purple-100 bg-purple-50/50 p-3">
                                    <div className="flex items-center gap-3">
                                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100">
                                        <Ticket className="h-4 w-4 text-purple-600" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-xs" style={{ color: "var(--dash-text-secondary)" }}>Coupon Code</p>
                                        <p className="mt-0.5 font-mono text-sm font-bold tracking-wider text-purple-700">
                                          {coupon.code}
                                        </p>
                                      </div>
                                      <div className="flex flex-col items-end gap-1">
                                        <span
                                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                                            coupon.status === "active"
                                              ? "bg-emerald-100 text-emerald-700"
                                              : coupon.status === "used"
                                                ? ""
                                                : "bg-amber-100 text-amber-700"
                                          }`}
                                          style={coupon.status === "used" ? { backgroundColor: "var(--dash-hover)", color: "var(--dash-text-secondary)" } : undefined}
                                        >
                                          {coupon.status}
                                        </span>
                                        {coupon.sms_sent && (
                                          <span className="text-[10px] text-emerald-600 font-medium">
                                            SMS sent
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    {coupon.expires_at && (
                                      <p className="mt-2 text-[11px]" style={{ color: "var(--dash-text-secondary)" }}>
                                        Expires {formatDate(coupon.expires_at)}
                                      </p>
                                    )}
                                  </div>
                                );
                              })()}
                            </div>
                          )}

                          {/* Review panel — pending only */}
                          {!isReviewed && (
                            <div className="mt-4 rounded-xl border p-4" style={{ borderColor: "var(--dash-card-border)", backgroundColor: "var(--dash-hover)" }}>
                              <p className="text-sm font-medium mb-3" style={{ color: "var(--dash-text)" }}>
                                Review this submission
                              </p>

                              {/* Reward selector */}
                              <div className="mb-3">
                                <label
                                  htmlFor={`reward-${sub.id}`}
                                  className="mb-1.5 block text-xs font-medium"
                                  style={{ color: "var(--dash-text-secondary)" }}
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
                                  className="w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20"
                                  style={{ borderColor: "var(--dash-card-border)", backgroundColor: "var(--dash-card-bg)", color: "var(--dash-text)" }}
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
                                  className="flex items-center gap-1.5 text-xs font-medium"
                                  style={{ color: "var(--dash-text-secondary)" }}
                                >
                                  <ChevronDown
                                    className={`h-3.5 w-3.5 transition-transform duration-200 ${
                                      personalNoteOpen ? "rotate-180" : ""
                                    }`}
                                  />
                                  Add a personal note{" "}
                                  <span className="font-normal" style={{ color: "var(--dash-text-muted)" }}>
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
                                        className="mt-2 w-full resize-none rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20"
                                        style={{ borderColor: "var(--dash-card-border)", backgroundColor: "var(--dash-card-bg)", color: "var(--dash-text)" }}
                                      />
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>

                              {/* Action buttons */}
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleApproveClick(sub)}
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
                                  className="flex items-center gap-1.5 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                  style={{ backgroundColor: "var(--dash-card-bg)" }}
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

      {/* Early Approval Confirmation Modal */}
      <AnimatePresence>
        {earlyApprovalSub && (() => {
          const timeInfo = getEarlyApprovalTimeInfo(earlyApprovalSub);
          return (
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
                onClick={() => setEarlyApprovalSub(null)}
              />
              {/* Modal content */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2 }}
                className="relative w-full max-w-sm overflow-hidden rounded-2xl shadow-2xl"
                style={{ backgroundColor: "var(--dash-surface)" }}
              >
                <div className="p-6">
                  {/* Warning icon */}
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-50">
                    <AlertTriangle className="h-6 w-6 text-amber-500" />
                  </div>

                  <h3 className="text-center text-base font-semibold" style={{ color: "var(--dash-text)" }}>
                    Early Approval
                  </h3>

                  <p className="mt-3 text-center text-sm" style={{ color: "var(--dash-text-secondary)" }}>
                    This submission was submitted {timeInfo.elapsed} ago and hasn&apos;t completed the verification period. The post may still be removed by the customer after receiving their reward.
                  </p>

                  <div className="mt-4 rounded-lg bg-amber-50 border border-amber-100 px-3 py-2.5 text-center">
                    <p className="text-xs font-medium text-amber-700">
                      Time remaining: {timeInfo.remaining}
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="mt-5 flex gap-3">
                    <button
                      onClick={() => setEarlyApprovalSub(null)}
                      className="flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors"
                      style={{ borderColor: "var(--dash-card-border)", backgroundColor: "var(--dash-card-bg)", color: "var(--dash-text-secondary)" }}
                    >
                      Wait
                    </button>
                    <button
                      onClick={() => {
                        const subId = earlyApprovalSub.id;
                        setEarlyApprovalSub(null);
                        handleReview(subId, "approved");
                      }}
                      disabled={updatingId === earlyApprovalSub.id}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-amber-600 disabled:opacity-50"
                    >
                      {updatingId === earlyApprovalSub.id ? (
                        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      ) : (
                        <>
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                          Approve Anyway
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

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
              className="relative w-full max-w-sm overflow-hidden rounded-2xl shadow-2xl"
              style={{ backgroundColor: "var(--dash-surface)" }}
            >
              {/* Modal header */}
              <div className="flex items-center justify-between border-b px-6 py-4" style={{ borderColor: "var(--dash-divider)" }}>
                <h3 className="text-base font-semibold" style={{ color: "var(--dash-text)" }}>
                  SMS Preview
                </h3>
                <button
                  onClick={() => setPreviewModalOpen(false)}
                  className="rounded-lg p-1.5"
                  style={{ color: "var(--dash-text-muted)" }}
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* SMS preview */}
              <div className="bg-[#F2F2F7] px-4 py-6">
                <p className="text-center text-[10px] mb-3" style={{ color: "var(--dash-text-muted)" }}>
                  Text Message from {st.businessName}
                </p>
                <div className="flex justify-start">
                  <div
                    className="max-w-[90%] rounded-2xl rounded-tl-md px-4 py-3"
                    style={{ backgroundColor: "#E9E9EB" }}
                  >
                    <p className="text-[13px] leading-relaxed whitespace-pre-wrap" style={{ color: "var(--dash-text)" }}>
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
                <p className="text-right text-[10px] pr-1 mt-2" style={{ color: "var(--dash-text-muted)" }}>
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
