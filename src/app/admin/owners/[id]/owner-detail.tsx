"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Shield, Trash2, Mail, Crown, Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import { formatPhoneForDisplay } from "@/lib/phone-utils";

interface Business {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  brand_color: string;
  plan: string;
  status: string;
  created_at: string;
}

interface Owner {
  email: string;
  name: string;
  avatar_url: string | null;
}

interface Stats {
  total_submissions: number;
  pending: number;
  approved: number;
  rejected: number;
  approval_rate: number;
  rewards_sent: number;
}

interface Submission {
  id: string;
  customer_name: string;
  customer_email?: string;
  customer_phone: string;
  post_url: string;
  detected_platform: string;
  status: string;
  created_at: string;
}

interface OwnerData {
  business: Business;
  owner: Owner;
  stats: Stats;
  submissions: Submission[];
  submissions_total: number;
  submissions_page: number;
  submissions_limit: number;
}

interface Toast {
  message: string;
  type: "success" | "error";
}

const glassCard =
  "rounded-2xl border border-gray-100 bg-white/70 p-6";
const glassStyle = {
  backdropFilter: "blur(12px)",
  boxShadow: "0 4px 24px -4px rgba(37, 99, 235, 0.06)",
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function monthsAgo(dateStr: string): string {
  const created = new Date(dateStr);
  const now = new Date();
  const months =
    (now.getFullYear() - created.getFullYear()) * 12 +
    (now.getMonth() - created.getMonth());
  if (months < 1) return "Less than a month ago";
  if (months === 1) return "1 month ago";
  return `${months} months ago`;
}

function truncate(str: string, max: number): string {
  return str.length > max ? str.slice(0, max) + "..." : str;
}

function PlanBadge({ plan }: Readonly<{ plan: string }>) {
  const colors: Record<string, string> = {
    free: "bg-gray-100 text-gray-600",
    pro: "bg-blue-100 text-blue-700",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold capitalize ${colors[plan] ?? colors.free}`}
    >
      <Crown className="h-3 w-3" />
      {plan}
    </span>
  );
}

function StatusBadge({ status }: Readonly<{ status: string }>) {
  const colors: Record<string, string> = {
    active: "bg-emerald-100 text-emerald-700",
    suspended: "bg-red-100 text-red-700",
    inactive: "bg-gray-100 text-gray-600",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold capitalize ${colors[status] ?? colors.inactive}`}
    >
      <Shield className="h-3 w-3" />
      {status}
    </span>
  );
}

function SubmissionStatusBadge({ status }: Readonly<{ status: string }>) {
  const colors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-emerald-100 text-emerald-700",
    rejected: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${colors[status] ?? "bg-gray-100 text-gray-600"}`}
    >
      {status}
    </span>
  );
}

const modalOverlay =
  "fixed inset-0 z-50 flex items-center justify-center bg-black/50";
const modalOverlayStyle = { backdropFilter: "blur(4px)" };

function ModalWrapper({
  children,
  onClose,
}: Readonly<{ children: React.ReactNode; onClose: () => void }>) {
  return (
    <AnimatePresence>
      <motion.div
        className={modalOverlay}
        style={modalOverlayStyle}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="mx-4 w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6"
          style={glassStyle}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function OwnerDetail({
  businessId,
}: Readonly<{ businessId: string }>) {
  const router = useRouter();
  const [data, setData] = useState<OwnerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);

  // Modal states
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Form states
  const [selectedPlan, setSelectedPlan] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [deleteConfirmName, setDeleteConfirmName] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Submissions search & pagination
  const [subSearch, setSubSearch] = useState("");
  const [subPage, setSubPage] = useState(1);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [subTotal, setSubTotal] = useState(0);
  const [subLoading, setSubLoading] = useState(false);
  const SUB_LIMIT = 20;

  function showToast(message: string, type: "success" | "error") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  const fetchSubmissions = useCallback(
    async (search: string, page: number) => {
      setSubLoading(true);
      try {
        const params = new URLSearchParams({
          sub_search: search,
          sub_page: String(page),
          sub_limit: String(SUB_LIMIT),
        });
        const res = await fetch(`/api/admin/owners/${businessId}?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json();
        setSubmissions(json.submissions);
        setSubTotal(json.submissions_total);
      } catch {
        // keep existing submissions on error
      } finally {
        setSubLoading(false);
      }
    },
    [businessId]
  );

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/admin/owners/${businessId}`);
        if (!res.ok) throw new Error("Failed to fetch owner data");
        const json = await res.json();
        setData(json);
        setSelectedPlan(json.business.plan);
        setSubmissions(json.submissions);
        setSubTotal(json.submissions_total);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [businessId]);

  // Debounced search for submissions
  useEffect(() => {
    if (loading) return;
    const timer = setTimeout(() => {
      setSubPage(1);
      fetchSubmissions(subSearch, 1);
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subSearch, fetchSubmissions]);

  // Page change for submissions (no debounce)
  useEffect(() => {
    if (loading || subPage === 1) return;
    fetchSubmissions(subSearch, subPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subPage]);

  async function handleChangePlan() {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/owners/${businessId}/plan`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selectedPlan }),
      });
      if (!res.ok) throw new Error("Failed to update plan");
      setData((prev) =>
        prev
          ? { ...prev, business: { ...prev.business, plan: selectedPlan } }
          : prev,
      );
      setShowPlanModal(false);
      showToast("Plan updated successfully", "success");
    } catch {
      showToast("Failed to update plan", "error");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleToggleStatus() {
    setActionLoading(true);
    const newStatus =
      data?.business.status === "suspended" ? "active" : "suspended";
    try {
      const res = await fetch(`/api/admin/owners/${businessId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      setData((prev) =>
        prev
          ? { ...prev, business: { ...prev.business, status: newStatus } }
          : prev,
      );
      setShowSuspendModal(false);
      showToast(
        newStatus === "suspended"
          ? "Account suspended"
          : "Account reactivated",
        "success",
      );
    } catch {
      showToast("Failed to update status", "error");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleSendEmail() {
    if (!emailSubject.trim() || !emailBody.trim()) {
      showToast("Subject and body are required", "error");
      return;
    }
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/owners/${businessId}/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: emailSubject, body: emailBody }),
      });
      if (!res.ok) throw new Error("Failed to send email");
      setShowEmailModal(false);
      setEmailSubject("");
      setEmailBody("");
      showToast("Email sent successfully", "success");
    } catch {
      showToast("Failed to send email", "error");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDeleteAccount() {
    if (deleteConfirmName !== data?.business.name) {
      showToast("Business name does not match", "error");
      return;
    }
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/owners/${businessId}/delete`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete account");
      showToast("Account deleted", "success");
      setTimeout(() => router.push("/admin"), 500);
    } catch {
      showToast("Failed to delete account", "error");
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FEFCFA]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#FEFCFA]">
        <p className="text-red-600">{error ?? "Owner not found"}</p>
        <Link
          href="/admin"
          className="text-sm text-blue-600 hover:underline"
        >
          Back to Owners
        </Link>
      </div>
    );
  }

  const { business, owner, stats } = data;
  const isSuspended = business.status === "suspended";

  return (
    <div className="min-h-screen bg-[#FEFCFA] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Back button */}
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Owners
        </Link>

        {/* Header card */}
        <div className={glassCard} style={glassStyle}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              {business.logo_url ? (
                <img
                  src={business.logo_url}
                  alt={business.name}
                  className="h-16 w-16 rounded-2xl object-cover"
                />
              ) : (
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-bold text-white"
                  style={{
                    backgroundColor: business.brand_color || "#2563eb",
                  }}
                >
                  {business.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {business.name}
                </h1>
                <p className="text-sm text-gray-600">{owner.name}</p>
                <p className="text-sm text-gray-400">{owner.email}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <PlanBadge plan={business.plan} />
              <StatusBadge status={business.status} />
              <span className="text-xs text-gray-400">
                Member since {formatDate(business.created_at)}
              </span>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {/* Total Submissions */}
          <div className={glassCard} style={glassStyle}>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
              Total Submissions
            </p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {stats.total_submissions}
            </p>
            <p className="mt-1 text-xs">
              <span className="text-yellow-600">{stats.pending} pending</span>
              {" · "}
              <span className="text-emerald-600">
                {stats.approved} approved
              </span>
              {" · "}
              <span className="text-red-500">{stats.rejected} rejected</span>
            </p>
          </div>

          {/* Approval Rate */}
          <div className={glassCard} style={glassStyle}>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
              Approval Rate
            </p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {stats.approval_rate}%
            </p>
            <span
              className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                stats.approval_rate >= 75
                  ? "bg-emerald-100 text-emerald-700"
                  : stats.approval_rate >= 50
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
              }`}
            >
              {stats.approval_rate >= 75
                ? "High"
                : stats.approval_rate >= 50
                  ? "Medium"
                  : "Low"}
            </span>
          </div>

          {/* Rewards Sent */}
          <div className={glassCard} style={glassStyle}>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
              Rewards Sent
            </p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {stats.rewards_sent}
            </p>
          </div>

          {/* Active Since */}
          <div className={glassCard} style={glassStyle}>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
              Active Since
            </p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {formatDate(business.created_at)}
            </p>
            <p className="mt-1 text-xs text-gray-400">
              {monthsAgo(business.created_at)}
            </p>
          </div>
        </div>

        {/* Admin Actions */}
        <div className={glassCard} style={glassStyle}>
          <div className="mb-4 flex items-center gap-3">
            <div className="h-6 w-1 rounded-full bg-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Admin Actions
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowPlanModal(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-50"
            >
              <Crown className="h-4 w-4" />
              Change Plan
            </button>
            <button
              onClick={() => setShowSuspendModal(true)}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${
                isSuspended
                  ? "border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50"
                  : "border-orange-200 bg-white text-orange-700 hover:bg-orange-50"
              }`}
            >
              <Shield className="h-4 w-4" />
              {isSuspended ? "Reactivate" : "Suspend"}
            </button>
            <button
              onClick={() => setShowEmailModal(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-50"
            >
              <Mail className="h-4 w-4" />
              Send Email
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              Delete Account
            </button>
          </div>
        </div>

        {/* Submissions */}
        <div className={glassCard} style={glassStyle}>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-6 w-1 rounded-full bg-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Submissions
              </h2>
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                {subTotal}
              </span>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative mb-4">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={subSearch}
              onChange={(e) => setSubSearch(e.target.value)}
              placeholder="Search by name, email, or link..."
              className="w-full rounded-xl border border-gray-200 bg-white/80 py-2.5 pl-10 pr-9 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
            />
            {subSearch && (
              <button
                onClick={() => setSubSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {subLoading && submissions.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
            </div>
          ) : submissions.length === 0 ? (
            <div className="py-12 text-center">
              <Search className="mx-auto mb-3 h-8 w-8 text-gray-300" />
              <p className="text-sm text-gray-400">
                {subSearch ? `No submissions match "${subSearch}"` : "No submissions yet"}
              </p>
            </div>
          ) : (
            <>
              <div className={`overflow-x-auto ${subLoading ? "opacity-50" : ""}`}>
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="pb-3 pr-4 font-medium text-gray-500">
                        Customer
                      </th>
                      <th className="pb-3 pr-4 font-medium text-gray-500">
                        Phone
                      </th>
                      <th className="pb-3 pr-4 font-medium text-gray-500">
                        Post Link
                      </th>
                      <th className="pb-3 pr-4 font-medium text-gray-500">
                        Status
                      </th>
                      <th className="pb-3 font-medium text-gray-500">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {submissions.map((sub) => (
                      <tr key={sub.id} className="group">
                        <td className="py-3 pr-4 text-gray-900">
                          {sub.customer_name}
                        </td>
                        <td className="py-3 pr-4 text-gray-500">
                          {formatPhoneForDisplay(sub.customer_phone)}
                        </td>
                        <td className="py-3 pr-4">
                          <a
                            href={sub.post_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {truncate(sub.post_url, 30)}
                          </a>
                        </td>
                        <td className="py-3 pr-4">
                          <SubmissionStatusBadge status={sub.status} />
                        </td>
                        <td className="py-3 text-gray-400">
                          {formatDate(sub.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {subTotal > SUB_LIMIT && (
                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                  <p className="text-sm text-gray-500">
                    Showing {(subPage - 1) * SUB_LIMIT + 1}-{Math.min(subPage * SUB_LIMIT, subTotal)} of {subTotal}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSubPage((p) => Math.max(1, p - 1))}
                      disabled={subPage <= 1}
                      className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </button>
                    <button
                      onClick={() => setSubPage((p) => Math.min(Math.ceil(subTotal / SUB_LIMIT), p + 1))}
                      disabled={subPage >= Math.ceil(subTotal / SUB_LIMIT)}
                      className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Change Plan Modal */}
      {showPlanModal && (
        <ModalWrapper onClose={() => setShowPlanModal(false)}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Change Plan
            </h3>
            <button
              onClick={() => setShowPlanModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="h-5 w-5"
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
          <div className="space-y-3">
            {["free", "pro"].map((plan) => (
              <label
                key={plan}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors ${
                  selectedPlan === plan
                    ? "border-blue-300 bg-blue-50"
                    : "border-gray-100 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="plan"
                  value={plan}
                  checked={selectedPlan === plan}
                  onChange={() => setSelectedPlan(plan)}
                  className="accent-blue-600"
                />
                <span className="text-sm font-medium capitalize text-gray-900">
                  {plan}
                </span>
              </label>
            ))}
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => setShowPlanModal(false)}
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleChangePlan}
              disabled={actionLoading}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              {actionLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </ModalWrapper>
      )}

      {/* Suspend / Reactivate Modal */}
      {showSuspendModal && (
        <ModalWrapper onClose={() => setShowSuspendModal(false)}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {isSuspended ? "Reactivate Account" : "Suspend Account"}
            </h3>
            <button
              onClick={() => setShowSuspendModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="h-5 w-5"
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
          <p className="text-sm text-gray-600">
            {isSuspended
              ? `Are you sure you want to reactivate "${business.name}"? They will regain full access to their account.`
              : `Are you sure you want to suspend "${business.name}"? They will lose access to their dashboard and their landing page will be disabled.`}
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => setShowSuspendModal(false)}
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleToggleStatus}
              disabled={actionLoading}
              className={`rounded-xl px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50 ${
                isSuspended
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-orange-600 hover:bg-orange-700"
              }`}
            >
              {actionLoading
                ? "Processing..."
                : isSuspended
                  ? "Reactivate"
                  : "Suspend"}
            </button>
          </div>
        </ModalWrapper>
      )}

      {/* Send Email Modal */}
      {showEmailModal && (
        <ModalWrapper onClose={() => setShowEmailModal(false)}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Send Email
            </h3>
            <button
              onClick={() => setShowEmailModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="h-5 w-5"
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
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Subject
              </label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Email subject"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-300 focus:outline-none focus:ring-1 focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Body
              </label>
              <textarea
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                placeholder="Write your message..."
                rows={5}
                className="w-full resize-none rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-300 focus:outline-none focus:ring-1 focus:ring-blue-300"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => setShowEmailModal(false)}
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSendEmail}
              disabled={actionLoading}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              {actionLoading ? "Sending..." : "Send"}
            </button>
          </div>
        </ModalWrapper>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <ModalWrapper onClose={() => setShowDeleteModal(false)}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-red-700">
              Delete Account
            </h3>
            <button
              onClick={() => setShowDeleteModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="h-5 w-5"
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
          <p className="text-sm text-gray-600">
            This action is permanent and cannot be undone. All data associated
            with <strong>{business.name}</strong> will be permanently deleted.
          </p>
          <div className="mt-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Type <strong>{business.name}</strong> to confirm
            </label>
            <input
              type="text"
              value={deleteConfirmName}
              onChange={(e) => setDeleteConfirmName(e.target.value)}
              placeholder={business.name}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-red-300 focus:outline-none focus:ring-1 focus:ring-red-300"
            />
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => {
                setShowDeleteModal(false);
                setDeleteConfirmName("");
              }}
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteAccount}
              disabled={
                actionLoading || deleteConfirmName !== business.name
              }
              className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
            >
              {actionLoading ? "Deleting..." : "Delete Forever"}
            </button>
          </div>
        </ModalWrapper>
      )}

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-6 right-6 z-[60] rounded-xl px-4 py-3 text-sm font-medium text-white shadow-lg ${
              toast.type === "success" ? "bg-emerald-600" : "bg-red-600"
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
