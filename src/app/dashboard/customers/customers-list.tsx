"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { CouponCode } from "@/types/database";
import {
  formatPhoneForDisplay,
  maskPhoneForDisplay,
} from "@/lib/phone-utils";
import {
  Instagram,
  Music,
  Youtube,
  Twitter,
  Facebook,
  Link,
  Users,
  Search,
  X,
  ChevronDown,
  Gift,
  Ticket,
  Clock,
  CheckCircle,
  RotateCcw,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  ShieldX,
  Shield,
  AlertTriangle,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types & Constants
// ---------------------------------------------------------------------------

interface SubmissionInfo {
  id: string;
  post_url: string;
  detected_platform: string | null;
  verification_status: string | null;
  verified_at: string | null;
  verification_deadline: string | null;
  created_at: string;
  reviewed_at: string | null;
}

type FilterTab = "active" | "redeemed";

const TABS: { label: string; value: FilterTab; color: string }[] = [
  { label: "Active Rewards", value: "active", color: "#059669" },
  { label: "Redeemed", value: "redeemed", color: "#2563EB" },
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

const PLATFORM_COLORS: Record<string, { bg: string; text: string }> = {
  instagram: { bg: "#fce7f3", text: "#db2777" },
  tiktok: { bg: "#ede9fe", text: "#7c3aed" },
  youtube: { bg: "#fee2e2", text: "#dc2626" },
  x: { bg: "#f3f4f6", text: "#1f2937" },
  facebook: { bg: "#dbeafe", text: "#2563eb" },
};

const STATS = [
  {
    key: "customers",
    label: "Total Customers",
    color: "#2563EB",
    bgColor: "#eff6ff",
    borderColor: "#bfdbfe",
  },
  {
    key: "active",
    label: "Active Coupons",
    color: "#059669",
    bgColor: "#ecfdf5",
    borderColor: "#a7f3d0",
  },
  {
    key: "redeemed",
    label: "Redeemed",
    color: "#2563EB",
    bgColor: "#eff6ff",
    borderColor: "#bfdbfe",
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getExpiryInfo(expiresAt: string | null) {
  if (!expiresAt) return null;
  const now = new Date();
  const expiry = new Date(expiresAt);
  const diffMs = expiry.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return {
    isExpired: diffDays <= 0,
    isWarning: diffDays > 0 && diffDays <= 3,
    daysLeft: diffDays,
    formatted: expiry.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  };
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface CustomersListProps {
  readonly coupons: CouponCode[];
  readonly submissions: SubmissionInfo[];
  readonly businessId: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function CustomersList({
  coupons,
  submissions,
  businessId,
}: CustomersListProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [isExpiring, setIsExpiring] = useState(false);
  const [showExpired, setShowExpired] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const router = useRouter();

  // Suppress unused variable warning
  void businessId;

  // ---- Lookup maps ----
  const submissionMap = new Map(submissions.map((s) => [s.id, s]));

  const couponsByPhone = new Map<string, CouponCode[]>();
  coupons.forEach((c) => {
    if (!couponsByPhone.has(c.customer_phone)) {
      couponsByPhone.set(c.customer_phone, []);
    }
    couponsByPhone.get(c.customer_phone)!.push(c);
  });

  // ---- Stats ----
  const uniquePhones = new Set(coupons.map((c) => c.customer_phone));
  const totalCustomers = uniquePhones.size;
  const activeCoupons = coupons.filter((c) => c.status === "active").length;
  const redeemedCoupons = coupons.filter((c) => c.status === "used").length;

  const statValues: Record<string, string> = {
    customers: String(totalCustomers),
    active: String(activeCoupons),
    redeemed: String(redeemedCoupons),
  };

  // ---- Search & Filter ----
  const query = searchQuery.toLowerCase().trim();

  const searched = query
    ? coupons.filter(
        (c) =>
          c.customer_name.toLowerCase().includes(query) ||
          c.customer_phone.includes(query) ||
          c.code.toLowerCase().includes(query)
      )
    : coupons;

  const activeFiltered = searched
    .filter((c) => c.status === "active")
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  const usedFiltered = searched
    .filter((c) => c.status === "used")
    .sort(
      (a, b) =>
        new Date(b.used_at || b.created_at).getTime() -
        new Date(a.used_at || a.created_at).getTime()
    );
  const expiredFiltered = searched.filter((c) => c.status === "expired");

  const displayed = activeTab === "active" ? activeFiltered : usedFiltered;

  // ---- Handlers ----
  function showToastMessage(message: string, type: "success" | "error") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  function toggleExpand(id: string) {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      setConfirmingId(null);
    }
  }

  async function handleMarkAsUsed(couponId: string, customerName: string) {
    setUpdatingId(couponId);
    try {
      const res = await fetch(`/api/coupons/${couponId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "used" }),
      });
      if (!res.ok) throw new Error();
      showToastMessage(
        `Coupon redeemed! ${customerName}'s reward has been marked as used.`,
        "success"
      );
      setConfirmingId(null);
      setExpandedId(null);
      router.refresh();
    } catch {
      showToastMessage("Failed to update coupon", "error");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleUndo(couponId: string) {
    setUpdatingId(couponId);
    try {
      const res = await fetch(`/api/coupons/${couponId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "active" }),
      });
      if (!res.ok) throw new Error();
      showToastMessage("Coupon reactivated", "success");
      router.refresh();
    } catch {
      showToastMessage("Failed to revert coupon", "error");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleExpireCoupons() {
    setIsExpiring(true);
    try {
      const res = await fetch("/api/coupons/expire", { method: "POST" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      showToastMessage(
        data.expired > 0
          ? `${data.expired} coupon${data.expired !== 1 ? "s" : ""} expired`
          : "No coupons to expire",
        "success"
      );
      router.refresh();
    } catch {
      showToastMessage("Failed to expire coupons", "error");
    } finally {
      setIsExpiring(false);
    }
  }

  // ---- Render helpers ----
  function getPlatformInfo(coupon: CouponCode) {
    const sub = submissionMap.get(coupon.submission_id);
    if (!sub?.detected_platform) return null;
    return {
      platform: sub.detected_platform,
      icon: PLATFORM_ICONS[sub.detected_platform] || null,
      label: PLATFORM_LABELS[sub.detected_platform] || null,
      colors: PLATFORM_COLORS[sub.detected_platform] || {
        bg: "#f3f4f6",
        text: "#6b7280",
      },
    };
  }

  // ---- Render coupon card ----
  function renderCouponCard(
    coupon: CouponCode,
    index: number,
    variant: "active" | "used" | "expired"
  ) {
    const isExpanded = expandedId === coupon.id;
    const isUpdating = updatingId === coupon.id;
    const platformInfo = getPlatformInfo(coupon);
    const expiryInfo = getExpiryInfo(coupon.expires_at);
    const sub = submissionMap.get(coupon.submission_id);
    const phoneHistory = couponsByPhone.get(coupon.customer_phone) || [];
    const isExpiredVariant = variant === "expired";

    return (
      <motion.div
        key={coupon.id}
        layout
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8, scale: 0.98 }}
        transition={{
          delay: index * 0.04,
          duration: 0.3,
          ease: "easeOut",
        }}
        whileHover={
          !isExpanded && !isExpiredVariant
            ? {
                y: -2,
                boxShadow: "0 8px 24px -4px rgba(37, 99, 235, 0.08)",
              }
            : undefined
        }
        className={`rounded-2xl border transition-colors duration-200 ${
          isExpiredVariant
            ? "opacity-50"
            : isExpanded
              ? "border-[#2563EB]/20"
              : ""
        }`}
        style={{
          backgroundColor: "var(--dash-card-bg)",
          borderColor: isExpiredVariant
            ? "var(--dash-card-border)"
            : isExpanded
              ? undefined
              : "var(--dash-card-border)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          boxShadow: isExpanded
            ? "0 8px 32px -4px rgba(37, 99, 235, 0.12)"
            : "0 2px 12px -2px rgba(0, 0, 0, 0.04)",
        }}
      >
        {/* Card Header */}
        <button
          onClick={() => toggleExpand(coupon.id)}
          className="flex w-full items-center gap-4 p-5 text-left"
        >
          {/* Platform avatar */}
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
            style={{
              backgroundColor: platformInfo?.colors.bg || "#f3f4f6",
              color: platformInfo?.colors.text || "#6b7280",
            }}
          >
            {platformInfo?.icon || <Link className="h-5 w-5" />}
          </div>

          {/* Customer info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-medium" style={{ color: "var(--dash-text)" }}>
                {coupon.customer_name}
              </p>
              {platformInfo?.label && (
                <span
                  className="rounded-lg px-2 py-0.5 text-xs font-medium"
                  style={{
                    backgroundColor: "var(--dash-hover)",
                    color: "var(--dash-text-secondary)",
                  }}
                >
                  {platformInfo.label}
                </span>
              )}
            </div>
            <div className="mt-0.5 flex items-center gap-2 text-sm" style={{ color: "var(--dash-text-secondary)" }}>
              <span>{maskPhoneForDisplay(coupon.customer_phone)}</span>
              <span style={{ color: "var(--dash-text-muted)" }}>&middot;</span>
              <span className="truncate max-w-[200px]">
                {coupon.reward_description}
              </span>
            </div>
          </div>

          {/* Coupon code badge */}
          <span
            className={`shrink-0 rounded-lg px-3 py-1.5 font-mono text-xs font-bold tracking-wider ${
              variant === "used"
                ? "line-through"
                : variant === "expired"
                  ? "line-through"
                  : "bg-purple-50 text-purple-700 border border-purple-200"
            }`}
            style={
              variant === "used" || variant === "expired"
                ? {
                    backgroundColor: "var(--dash-hover)",
                    color: "var(--dash-text-muted)",
                  }
                : undefined
            }
          >
            {coupon.code}
          </span>

          {/* Date / Expiry info */}
          <div className="hidden sm:flex shrink-0 flex-col items-end gap-0.5">
            {variant === "used" && coupon.used_at ? (
              <>
                <span className="text-xs" style={{ color: "var(--dash-text-secondary)" }}>Redeemed</span>
                <span className="text-xs font-medium" style={{ color: "var(--dash-text)" }}>
                  {formatDate(coupon.used_at)}
                </span>
              </>
            ) : variant === "active" && expiryInfo ? (
              <>
                <span
                  className={`text-xs ${expiryInfo.isWarning ? "font-medium text-amber-600" : ""}`}
                  style={!expiryInfo.isWarning ? { color: "var(--dash-text-secondary)" } : undefined}
                >
                  {expiryInfo.isWarning
                    ? `Expires in ${expiryInfo.daysLeft}d`
                    : `Expires ${expiryInfo.formatted}`}
                </span>
              </>
            ) : (
              <span className="text-xs" style={{ color: "var(--dash-text-secondary)" }}>
                {formatDate(coupon.created_at)}
              </span>
            )}
          </div>

          {/* Action button (stop propagation) */}
          {variant === "active" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirmingId === coupon.id) {
                  handleMarkAsUsed(coupon.id, coupon.customer_name);
                } else {
                  setConfirmingId(coupon.id);
                }
              }}
              disabled={isUpdating}
              className={`shrink-0 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                confirmingId === coupon.id
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isUpdating ? (
                <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : confirmingId === coupon.id ? (
                "Confirm?"
              ) : (
                <>
                  <CheckCircle className="h-3.5 w-3.5" />
                  Mark as Used
                </>
              )}
            </button>
          )}

          {variant === "used" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleUndo(coupon.id);
              }}
              disabled={isUpdating}
              className="shrink-0 flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                borderColor: "var(--dash-card-border)",
                backgroundColor: "var(--dash-card-bg)",
                color: "var(--dash-text-secondary)",
              }}
            >
              {isUpdating ? (
                <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-gray-300/30 border-t-gray-500" />
              ) : (
                <>
                  <RotateCcw className="h-3 w-3" />
                  Undo
                </>
              )}
            </button>
          )}

          {/* Expand chevron */}
          {!isExpiredVariant && (
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
          )}
        </button>

        {/* Expanded Panel */}
        <AnimatePresence>
          {isExpanded && !isExpiredVariant && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="border-t px-5 pb-5 pt-4" style={{ borderColor: "var(--dash-divider)" }}>
                {/* Details grid */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--dash-text-muted)" }}>
                      Phone
                    </p>
                    <p className="mt-1 text-sm" style={{ color: "var(--dash-text)" }}>
                      {formatPhoneForDisplay(coupon.customer_phone)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--dash-text-muted)" }}>
                      Post URL
                    </p>
                    {sub ? (
                      <a
                        href={sub.post_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 flex items-center gap-1 text-sm text-[#2563EB] hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">
                          {sub.post_url
                            .replace(/^https?:\/\//, "")
                            .substring(0, 40)}
                          {sub.post_url.replace(/^https?:\/\//, "").length > 40
                            ? "..."
                            : ""}
                        </span>
                      </a>
                    ) : (
                      <p className="mt-1 text-sm" style={{ color: "var(--dash-text-muted)" }}>—</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--dash-text-muted)" }}>
                      Date Earned
                    </p>
                    <p className="mt-1 text-sm" style={{ color: "var(--dash-text)" }}>
                      {formatDateTime(coupon.created_at)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--dash-text-muted)" }}>
                      Reward
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-sm font-medium" style={{ color: "var(--dash-text)" }}>
                      <Gift className="h-4 w-4 text-emerald-500" />
                      {coupon.reward_description}
                    </p>
                  </div>
                </div>

                {/* Verification & SMS status */}
                <div
                  className="mt-4 rounded-xl border p-4"
                  style={{
                    borderColor: "var(--dash-card-border)",
                    backgroundColor: "var(--dash-card-bg)",
                  }}
                >
                  <div className="grid gap-3 sm:grid-cols-2">
                    {/* Verification */}
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: "var(--dash-text-muted)" }}>
                        Verification
                      </p>
                      {sub?.verification_status ? (
                        <div className="flex items-center gap-2">
                          {sub.verification_status === "verified" ? (
                            <ShieldCheck className="h-4 w-4 text-emerald-500" />
                          ) : sub.verification_status === "failed" ? (
                            <ShieldX className="h-4 w-4 text-red-500" />
                          ) : sub.verification_status === "expired" ? (
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                          ) : (
                            <Shield className="h-4 w-4 text-blue-500" />
                          )}
                          <span
                            className={`text-sm font-medium capitalize ${
                              sub.verification_status === "verified"
                                ? "text-emerald-600"
                                : sub.verification_status === "failed"
                                  ? "text-red-600"
                                  : sub.verification_status === "expired"
                                    ? "text-amber-600"
                                    : "text-blue-600"
                            }`}
                          >
                            {sub.verification_status}
                          </span>
                          {sub.verified_at && (
                            <span className="text-xs" style={{ color: "var(--dash-text-secondary)" }}>
                              · {formatDate(sub.verified_at)}
                            </span>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm" style={{ color: "var(--dash-text-muted)" }}>No verification required</p>
                      )}
                    </div>

                    {/* SMS Status */}
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: "var(--dash-text-muted)" }}>
                        SMS Delivery
                      </p>
                      <div className="flex items-center gap-2">
                        {coupon.sms_sent ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                            <span className="text-sm font-medium text-emerald-600">
                              Sent
                            </span>
                            {coupon.sms_sent_at && (
                              <span className="text-xs" style={{ color: "var(--dash-text-secondary)" }}>
                                · {formatDateTime(coupon.sms_sent_at)}
                              </span>
                            )}
                          </>
                        ) : (
                          <>
                            <Clock className="h-4 w-4" style={{ color: "var(--dash-text-muted)" }} />
                            <span className="text-sm" style={{ color: "var(--dash-text-secondary)" }}>
                              Not sent
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  {sub && (
                    <div className="mt-3 border-t pt-3" style={{ borderColor: "var(--dash-divider)" }}>
                      <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "var(--dash-text-muted)" }}>
                        Timeline
                      </p>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs" style={{ color: "var(--dash-text-secondary)" }}>
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0" />
                          Submitted {formatDateTime(sub.created_at)}
                        </div>
                        {sub.reviewed_at && (
                          <div className="flex items-center gap-2 text-xs" style={{ color: "var(--dash-text-secondary)" }}>
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                            Approved {formatDateTime(sub.reviewed_at)}
                          </div>
                        )}
                        {sub.verified_at && (
                          <div className="flex items-center gap-2 text-xs" style={{ color: "var(--dash-text-secondary)" }}>
                            <span className="h-1.5 w-1.5 rounded-full bg-purple-400 shrink-0" />
                            Verified {formatDateTime(sub.verified_at)}
                          </div>
                        )}
                        {coupon.sms_sent_at && (
                          <div className="flex items-center gap-2 text-xs" style={{ color: "var(--dash-text-secondary)" }}>
                            <span className="h-1.5 w-1.5 rounded-full bg-green-400 shrink-0" />
                            Coupon SMS sent {formatDateTime(coupon.sms_sent_at)}
                          </div>
                        )}
                        {coupon.used_at && (
                          <div className="flex items-center gap-2 text-xs" style={{ color: "var(--dash-text-secondary)" }}>
                            <span className="h-1.5 w-1.5 rounded-full bg-gray-400 shrink-0" />
                            Redeemed {formatDateTime(coupon.used_at)}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Coupon history for this phone */}
                {phoneHistory.length > 1 && (
                  <div
                    className="mt-4 rounded-xl border p-4"
                    style={{
                      borderColor: "var(--dash-card-border)",
                      backgroundColor: "var(--dash-card-bg)",
                    }}
                  >
                    <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "var(--dash-text-muted)" }}>
                      Coupon History ({phoneHistory.length} total)
                    </p>
                    <div className="space-y-2">
                      {phoneHistory.map((h) => (
                        <div
                          key={h.id}
                          className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${
                            h.id === coupon.id
                              ? "bg-blue-50 border border-blue-100"
                              : ""
                          }`}
                          style={
                            h.id !== coupon.id
                              ? { backgroundColor: "var(--dash-hover)" }
                              : undefined
                          }
                        >
                          <div className="flex items-center gap-2">
                            <Ticket className="h-3.5 w-3.5" style={{ color: "var(--dash-text-muted)" }} />
                            <span
                              className={`font-mono text-xs font-bold tracking-wider ${
                                h.status === "active"
                                  ? "text-purple-700"
                                  : "line-through"
                              }`}
                              style={
                                h.status !== "active"
                                  ? { color: "var(--dash-text-muted)" }
                                  : undefined
                              }
                            >
                              {h.code}
                            </span>
                            <span className="truncate max-w-[150px]" style={{ color: "var(--dash-text-secondary)" }}>
                              {h.reward_description}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                                h.status === "active"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : h.status === "used"
                                    ? "bg-gray-100 text-gray-600"
                                    : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              {h.status}
                            </span>
                            <span className="text-xs" style={{ color: "var(--dash-text-muted)" }}>
                              {formatDate(h.created_at)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  // ---- Main Render ----
  return (
    <div>
      {/* Stats Bar */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {STATS.map((stat, i) => (
          <div
            key={stat.key}
            className={`dash-animate-fade-in-up dash-stagger-${i + 1} relative overflow-hidden rounded-2xl border p-4`}
            style={{
              borderColor: stat.borderColor,
              backgroundColor: "var(--dash-card-bg)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              boxShadow: "0 4px 24px -4px rgba(37, 99, 235, 0.06)",
            }}
          >
            {/* Left accent bar */}
            <div
              className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full"
              style={{ backgroundColor: stat.color }}
            />
            <div className="pl-3">
              <p
                className="dash-animate-number-roll text-2xl font-bold"
                style={{ color: stat.color }}
              >
                {statValues[stat.key]}
              </p>
              <p className="mt-0.5 text-xs font-medium" style={{ color: "var(--dash-text-secondary)" }}>
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Tab Bar + Refresh */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-2">
          {TABS.map((tab) => {
            const count =
              tab.value === "active"
                ? activeFiltered.length
                : usedFiltered.length;
            const isActive = activeTab === tab.value;

            return (
              <button
                key={tab.value}
                onClick={() => {
                  setActiveTab(tab.value);
                  setExpandedId(null);
                  setConfirmingId(null);
                }}
                className={`relative rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? ""
                    : ""
                }`}
                style={
                  isActive
                    ? { color: tab.color }
                    : { color: "var(--dash-text-secondary)" }
                }
              >
                {isActive && (
                  <motion.div
                    layoutId="customers-tab-indicator"
                    className="absolute inset-0 rounded-xl"
                    style={{
                      zIndex: -1,
                      backgroundColor: `${tab.color}15`,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}
                {tab.label}
                <span
                  className={`ml-1.5 rounded-full px-1.5 py-0.5 text-xs ${
                    isActive
                      ? "bg-white/20 text-white"
                      : ""
                  }`}
                  style={
                    !isActive
                      ? {
                          backgroundColor: "var(--dash-hover)",
                          color: "var(--dash-text-secondary)",
                        }
                      : undefined
                  }
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={handleExpireCoupons}
          disabled={isExpiring}
          className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            borderColor: "var(--dash-card-border)",
            backgroundColor: "var(--dash-card-bg)",
            color: "var(--dash-text-secondary)",
          }}
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${isExpiring ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      {/* Search Bar */}
      {coupons.length > 0 && (
        <div className="relative mb-5">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "var(--dash-text-muted)" }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, phone, or coupon code..."
            className="w-full rounded-xl border py-2.5 pl-10 pr-9 text-sm outline-none transition-all focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10"
            style={{
              borderColor: "var(--dash-card-border)",
              backgroundColor: "var(--dash-card-bg)",
              color: "var(--dash-text)",
              backdropFilter: "blur(8px)",
            }}
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

      {/* Main List */}
      {coupons.length === 0 ? (
        /* Global empty state — no customers at all */
        <div
          className="dash-animate-scale-in rounded-2xl border p-12 text-center shadow-[0_4px_24px_-4px_rgba(37,99,235,0.06)]"
          style={{
            borderColor: "var(--dash-card-border)",
            backgroundColor: "var(--dash-card-bg)",
          }}
        >
          <div className="mx-auto mb-4">
            <Users className="mx-auto h-10 w-10" style={{ color: "var(--dash-text-muted)" }} />
          </div>
          <p className="font-medium" style={{ color: "var(--dash-text)" }}>No customers yet</p>
          <p className="mt-1 text-sm" style={{ color: "var(--dash-text-secondary)" }}>
            Once you approve submissions, your customers and their rewards will
            appear here.
          </p>
        </div>
      ) : displayed.length === 0 && !query ? (
        /* Tab-specific empty state */
        <div
          className="dash-animate-scale-in rounded-2xl border p-12 text-center shadow-[0_4px_24px_-4px_rgba(37,99,235,0.06)]"
          style={{
            borderColor: "var(--dash-card-border)",
            backgroundColor: "var(--dash-card-bg)",
          }}
        >
          <div className="mx-auto mb-4">
            {activeTab === "active" ? (
              <Gift className="mx-auto h-10 w-10" style={{ color: "var(--dash-text-muted)" }} />
            ) : (
              <CheckCircle className="mx-auto h-10 w-10" style={{ color: "var(--dash-text-muted)" }} />
            )}
          </div>
          <p className="font-medium" style={{ color: "var(--dash-text)" }}>
            {activeTab === "active"
              ? "All caught up!"
              : "No coupons have been redeemed yet"}
          </p>
          <p className="mt-1 text-sm" style={{ color: "var(--dash-text-secondary)" }}>
            {activeTab === "active"
              ? "No active rewards pending redemption."
              : "Coupons will appear here once customers use them."}
          </p>
        </div>
      ) : displayed.length === 0 && query ? (
        /* Search empty state */
        <div
          className="dash-animate-scale-in rounded-2xl border p-12 text-center shadow-[0_4px_24px_-4px_rgba(37,99,235,0.06)]"
          style={{
            borderColor: "var(--dash-card-border)",
            backgroundColor: "var(--dash-card-bg)",
          }}
        >
          <div className="mx-auto mb-4">
            <Search className="mx-auto h-10 w-10" style={{ color: "var(--dash-text-muted)" }} />
          </div>
          <p className="font-medium" style={{ color: "var(--dash-text)" }}>No results found</p>
          <p className="mt-1 text-sm" style={{ color: "var(--dash-text-secondary)" }}>
            No customers found matching &ldquo;{searchQuery}&rdquo;
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {displayed.map((coupon, index) =>
              renderCouponCard(
                coupon,
                index,
                coupon.status === "used" ? "used" : "active"
              )
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Expired section — shown in Redeemed tab */}
      {activeTab === "redeemed" && expiredFiltered.length > 0 && (
        <div className="mt-6">
          <button
            onClick={() => setShowExpired(!showExpired)}
            className="flex w-full items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-colors"
            style={{
              borderColor: "var(--dash-card-border)",
              backgroundColor: "var(--dash-card-bg)",
              color: "var(--dash-text-secondary)",
            }}
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                showExpired ? "rotate-180" : ""
              }`}
            />
            Expired Coupons ({expiredFiltered.length})
          </button>
          <AnimatePresence>
            {showExpired && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="mt-3 space-y-3">
                  {expiredFiltered.map((coupon, index) =>
                    renderCouponCard(coupon, index, "expired")
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium text-white shadow-lg"
            style={{
              backgroundColor:
                toast.type === "error" ? "#e11d48" : "#059669",
            }}
          >
            {toast.type === "error" ? (
              <X className="h-4 w-4" />
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
