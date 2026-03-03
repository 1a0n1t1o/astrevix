"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
} from "lucide-react";

type FilterTab = "all" | "pending" | "approved" | "rejected";

const TABS: { label: string; value: FilterTab }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
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

interface SubmissionsListProps {
  readonly submissions: Submission[];
  readonly businessId: string;
  readonly rewardDescription: string;
}

export default function SubmissionsList({
  submissions,
  businessId,
  rewardDescription,
}: SubmissionsListProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [rewardValue, setRewardValue] = useState<string>("");
  const [commentValue, setCommentValue] = useState<string>("");
  const router = useRouter();

  // Suppress unused variable warning
  void businessId;

  const filtered =
    activeTab === "all"
      ? submissions
      : submissions.filter((s) => s.status === activeTab);

  function toggleExpand(id: string) {
    if (expandedId === id) {
      setExpandedId(null);
      setRewardValue("");
      setCommentValue("");
    } else {
      setExpandedId(id);
      // Pre-fill reward with business default
      setRewardValue(rewardDescription);
      setCommentValue("");
    }
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
      router.refresh();
    } catch {
      // silently fail
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div>
      {/* Filter Tabs */}
      <div className="mb-6 flex gap-2">
        {TABS.map((tab) => {
          const count =
            tab.value === "all"
              ? submissions.length
              : submissions.filter((s) => s.status === tab.value).length;

          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.value
                  ? "bg-[#2563EB] text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {tab.label}
              <span
                className={`ml-1.5 rounded-full px-1.5 py-0.5 text-xs ${
                  activeTab === tab.value
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

      {/* Submissions List */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white/70 p-12 text-center">
          <div className="mx-auto mb-4">
            {EMPTY_STATE_ICONS[activeTab]}
          </div>
          <p className="font-medium text-gray-900">
            {activeTab === "all"
              ? "No submissions yet"
              : `No ${activeTab} submissions`}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            {activeTab === "all"
              ? "Share your QR code to start getting customer content!"
              : `You don't have any ${activeTab} submissions right now.`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((sub) => {
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
              <div
                key={sub.id}
                className={`rounded-2xl border bg-white/70 transition-all duration-200 ${
                  isExpanded
                    ? "border-[#2563EB]/20 shadow-md"
                    : "border-gray-100 hover:shadow-sm"
                }`}
                style={{
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                }}
              >
                {/* Card Header — always visible, clickable */}
                <button
                  onClick={() => toggleExpand(sub.id)}
                  className="flex w-full items-center gap-4 p-5 text-left"
                >
                  {/* Platform avatar */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500">
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
                <div
                  className={`overflow-hidden transition-all duration-200 ${
                    isExpanded ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
                  }`}
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
                          {sub.post_url.replace(/^https?:\/\//, "").substring(0, 50)}
                          {sub.post_url.replace(/^https?:\/\//, "").length > 50
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
                              <p className="text-xs text-gray-500">Reward given</p>
                              <p className="mt-0.5 flex items-center gap-1.5 text-sm font-medium text-gray-900">
                                <Gift className="h-4 w-4 text-emerald-500" /> {sub.reward_given}
                              </p>
                            </div>
                          )}
                          {sub.reviewed_at && (
                            <div>
                              <p className="text-xs text-gray-500">Reviewed on</p>
                              <p className="mt-0.5 text-sm text-gray-900">
                                {formatDate(sub.reviewed_at)}
                              </p>
                            </div>
                          )}
                        </div>
                        {sub.review_comment && (
                          <div className="mt-3">
                            <p className="text-xs text-gray-500">Comment</p>
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
                            onChange={(e) => setRewardValue(e.target.value)}
                            placeholder="e.g. 10% off your next visit"
                            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20"
                          />
                        </div>

                        {/* Comment textarea */}
                        <div className="mb-4">
                          <label
                            htmlFor={`comment-${sub.id}`}
                            className="mb-1.5 block text-xs font-medium text-gray-500"
                          >
                            Comment{" "}
                            <span className="font-normal text-gray-400">
                              (optional)
                            </span>
                          </label>
                          <textarea
                            id={`comment-${sub.id}`}
                            value={commentValue}
                            onChange={(e) => setCommentValue(e.target.value)}
                            placeholder="Add a note about this submission..."
                            rows={2}
                            className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20"
                          />
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleReview(sub.id, "approved")}
                            disabled={isUpdating}
                            className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isUpdating ? (
                              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            ) : (
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                              </svg>
                            )}
                            Approve
                          </button>
                          <button
                            onClick={() => handleReview(sub.id, "rejected")}
                            disabled={isUpdating}
                            className="flex items-center gap-1.5 rounded-lg bg-white border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isUpdating ? (
                              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-red-300/30 border-t-red-500" />
                            ) : (
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            )}
                            Reject
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
