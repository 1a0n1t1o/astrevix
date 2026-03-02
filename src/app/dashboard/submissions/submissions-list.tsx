"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Submission } from "@/types/database";

type FilterTab = "all" | "pending" | "approved" | "rejected";

const TABS: { label: string; value: FilterTab }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

const PLATFORM_INFO: Record<string, { label: string; emoji: string }> = {
  instagram: { label: "Instagram", emoji: "📸" },
  tiktok: { label: "TikTok", emoji: "🎵" },
  youtube: { label: "YouTube", emoji: "▶️" },
  x: { label: "X", emoji: "🐦" },
  facebook: { label: "Facebook", emoji: "📘" },
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
}

export default function SubmissionsList({
  submissions,
  businessId,
}: SubmissionsListProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const router = useRouter();

  // Suppress unused variable warning - businessId available for future use
  void businessId;

  const filtered =
    activeTab === "all"
      ? submissions
      : submissions.filter((s) => s.status === activeTab);

  async function updateStatus(id: string, status: "approved" | "rejected") {
    setUpdatingId(id);
    try {
      await fetch(`/api/submissions/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      router.refresh();
    } catch {
      // silently fail, could add toast notification later
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
          <div className="mx-auto mb-4 text-4xl">
            {activeTab === "all" ? "📭" : activeTab === "pending" ? "⏳" : activeTab === "approved" ? "✅" : "❌"}
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
            const platform = sub.detected_platform
              ? PLATFORM_INFO[sub.detected_platform]
              : null;
            const isUpdating = updatingId === sub.id;

            return (
              <div
                key={sub.id}
                className="rounded-2xl border border-gray-100 bg-white/70 p-5 transition-shadow hover:shadow-sm"
                style={{
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                }}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  {/* Left side: customer info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-lg">
                        {platform?.emoji || "🔗"}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900">
                          {sub.customer_name}
                        </p>
                        <p className="truncate text-sm text-gray-500">
                          {sub.customer_email}
                        </p>
                      </div>
                    </div>

                    {/* Post URL */}
                    <div className="mt-3 flex items-center gap-2">
                      {platform && (
                        <span className="rounded-lg bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                          {platform.label}
                        </span>
                      )}
                      <a
                        href={sub.post_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="truncate text-sm text-[#2563EB] hover:underline"
                      >
                        {sub.post_url.replace(/^https?:\/\//, "").substring(0, 60)}
                      </a>
                    </div>

                    {/* Date */}
                    <p className="mt-2 text-xs text-gray-400">
                      Submitted {formatDate(sub.created_at)} at{" "}
                      {formatTime(sub.created_at)}
                      {sub.reviewed_at && (
                        <> · Reviewed {formatDate(sub.reviewed_at)}</>
                      )}
                    </p>
                  </div>

                  {/* Right side: status + actions */}
                  <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                    {/* Status badge */}
                    <span
                      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium capitalize ${
                        sub.status === "pending"
                          ? "border-amber-200 bg-amber-50 text-amber-700"
                          : sub.status === "approved"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-red-200 bg-red-50 text-red-700"
                      }`}
                    >
                      {sub.status}
                    </span>

                    {/* Action buttons (pending only) */}
                    {sub.status === "pending" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateStatus(sub.id, "approved")}
                          disabled={isUpdating}
                          className="rounded-lg bg-emerald-500 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-600 disabled:opacity-50"
                        >
                          {isUpdating ? "..." : "Approve"}
                        </button>
                        <button
                          onClick={() => updateStatus(sub.id, "rejected")}
                          disabled={isUpdating}
                          className="rounded-lg bg-red-500 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-red-600 disabled:opacity-50"
                        >
                          {isUpdating ? "..." : "Reject"}
                        </button>
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
