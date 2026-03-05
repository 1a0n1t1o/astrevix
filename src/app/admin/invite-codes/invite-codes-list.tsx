"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Copy,
  RefreshCw,
  ExternalLink,
  Trash2,
  Ban,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  Ticket,
} from "lucide-react";

type StatusFilter = "all" | "active" | "used" | "expired" | "revoked";

interface InviteCodeRow {
  id: string;
  code: string;
  business_name: string | null;
  business_email: string | null;
  max_uses: number;
  times_used: number;
  status: string;
  display_status: string;
  created_at: string;
  expires_at: string | null;
  claimed_by: string | null;
  claimed_at: string | null;
}

const TABS: { label: string; value: StatusFilter }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Used", value: "used" },
  { label: "Expired", value: "expired" },
  { label: "Revoked", value: "revoked" },
];

const STATUS_COLORS: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  used: "bg-blue-50 text-blue-700 ring-blue-600/20",
  expired: "bg-gray-50 text-gray-600 ring-gray-500/20",
  revoked: "bg-red-50 text-red-700 ring-red-600/20",
};

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const LIMIT = 20;

function generateCode(length: number = 8): string {
  let code = "";
  for (let i = 0; i < length; i++) {
    code += CODE_CHARS.charAt(Math.floor(Math.random() * CODE_CHARS.length));
  }
  return code;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const glassCard = "rounded-2xl border border-gray-100 bg-white/70 p-6";
const glassStyle = {
  backdropFilter: "blur(12px)",
  boxShadow: "0 4px 24px -4px rgba(37, 99, 235, 0.06)",
};

export default function InviteCodesList() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [inviteCodes, setInviteCodes] = useState<InviteCodeRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState<Record<string, number>>({
    all: 0,
    active: 0,
    used: 0,
    expired: 0,
    revoked: 0,
  });

  // Generate modal
  const [showGenerate, setShowGenerate] = useState(false);
  const [genCode, setGenCode] = useState(generateCode());
  const [genCustom, setGenCustom] = useState(false);
  const [genBusinessName, setGenBusinessName] = useState("");
  const [genBusinessEmail, setGenBusinessEmail] = useState("");
  const [genMaxUses, setGenMaxUses] = useState(1);
  const [genExpiresEnabled, setGenExpiresEnabled] = useState(false);
  const [genExpiresAt, setGenExpiresAt] = useState("");
  const [genStep, setGenStep] = useState<"form" | "confirmation">("form");
  const [genLoading, setGenLoading] = useState(false);
  const [createdCode, setCreatedCode] = useState<InviteCodeRow | null>(null);

  // Action modals
  const [showRevoke, setShowRevoke] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedCode, setSelectedCode] = useState<InviteCodeRow | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Toast
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  function showToast(message: string, type: "success" | "error" = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  const fetchCodes = useCallback(
    async (s: string, st: StatusFilter, p: number) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          search: s,
          status: st,
          page: p.toString(),
          limit: LIMIT.toString(),
        });
        const res = await fetch(`/api/admin/invite-codes?${params}`);
        const data = await res.json();
        if (res.ok) {
          setInviteCodes(data.invite_codes || []);
          setTotal(data.total || 0);
          setCounts(data.counts || counts);
        }
      } catch {
        showToast("Failed to fetch invite codes", "error");
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Debounced search
  useEffect(() => {
    setPage(1);
    const timeout = setTimeout(() => {
      fetchCodes(search, statusFilter, 1);
    }, 300);
    return () => clearTimeout(timeout);
  }, [search, statusFilter, fetchCodes]);

  // Page change
  useEffect(() => {
    if (page > 1) fetchCodes(search, statusFilter, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  async function handleGenerate() {
    setGenLoading(true);
    try {
      const res = await fetch("/api/admin/invite-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: genCode,
          business_name: genBusinessName || undefined,
          business_email: genBusinessEmail || undefined,
          max_uses: genMaxUses,
          expires_at: genExpiresEnabled && genExpiresAt
            ? new Date(genExpiresAt).toISOString()
            : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Failed to create code", "error");
        return;
      }
      setCreatedCode(data.invite_code);
      setGenStep("confirmation");
      fetchCodes(search, statusFilter, page);
    } catch {
      showToast("Failed to create invite code", "error");
    } finally {
      setGenLoading(false);
    }
  }

  async function handleRevoke() {
    if (!selectedCode) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/invite-codes/${selectedCode.id}`, {
        method: "PATCH",
      });
      if (res.ok) {
        showToast("Invite code revoked");
        fetchCodes(search, statusFilter, page);
      } else {
        const data = await res.json();
        showToast(data.error || "Failed to revoke", "error");
      }
    } catch {
      showToast("Failed to revoke code", "error");
    } finally {
      setActionLoading(false);
      setShowRevoke(false);
      setSelectedCode(null);
    }
  }

  async function handleDelete() {
    if (!selectedCode) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/invite-codes/${selectedCode.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showToast("Invite code deleted");
        fetchCodes(search, statusFilter, page);
      } else {
        const data = await res.json();
        showToast(data.error || "Failed to delete", "error");
      }
    } catch {
      showToast("Failed to delete code", "error");
    } finally {
      setActionLoading(false);
      setShowDelete(false);
      setSelectedCode(null);
    }
  }

  async function copyToClipboard(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text);
      showToast(`${label} copied`);
    } catch {
      showToast("Failed to copy", "error");
    }
  }

  function resetGenerateModal() {
    setGenCode(generateCode());
    setGenCustom(false);
    setGenBusinessName("");
    setGenBusinessEmail("");
    setGenMaxUses(1);
    setGenExpiresEnabled(false);
    setGenExpiresAt("");
    setGenStep("form");
    setCreatedCode(null);
    setGenLoading(false);
  }

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div>
      {/* Header with generate button */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Filter tabs */}
        <div className="flex gap-1 rounded-xl bg-gray-100/80 p-1">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => {
                setStatusFilter(tab.value);
                setPage(1);
              }}
              className={`relative rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                statusFilter === tab.value
                  ? "text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {statusFilter === tab.value && (
                <motion.div
                  layoutId="invite-tab-bg"
                  className="absolute inset-0 rounded-lg bg-white shadow-sm"
                  style={{ zIndex: -1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              {tab.label}
              <span className="ml-1.5 text-[10px] text-gray-400">
                {counts[tab.value] ?? 0}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            resetGenerateModal();
            setShowGenerate(true);
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#7C3AED] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/30"
        >
          <Plus className="h-4 w-4" />
          Generate Invite Code
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by code, business name, or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20"
        />
      </div>

      {/* Table */}
      <div className={glassCard} style={glassStyle}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Code
                </th>
                <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Business
                </th>
                <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Uses
                </th>
                <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Created
                </th>
                <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Expires
                </th>
                <th className="pb-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="py-4 pr-4">
                        <div className="h-4 w-24 rounded bg-gray-100" />
                      </td>
                      <td className="py-4 pr-4">
                        <div className="h-4 w-32 rounded bg-gray-100" />
                      </td>
                      <td className="py-4 pr-4">
                        <div className="h-5 w-16 rounded-full bg-gray-100" />
                      </td>
                      <td className="py-4 pr-4">
                        <div className="h-4 w-10 rounded bg-gray-100" />
                      </td>
                      <td className="py-4 pr-4">
                        <div className="h-4 w-20 rounded bg-gray-100" />
                      </td>
                      <td className="py-4 pr-4">
                        <div className="h-4 w-20 rounded bg-gray-100" />
                      </td>
                      <td className="py-4">
                        <div className="h-4 w-20 rounded bg-gray-100 ml-auto" />
                      </td>
                    </tr>
                  ))
                : inviteCodes.length === 0
                  ? (
                    <tr>
                      <td colSpan={7} className="py-16 text-center">
                        <Ticket className="mx-auto h-10 w-10 text-gray-300" />
                        <p className="mt-3 text-sm font-medium text-gray-500">
                          No invite codes found
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          Generate a code to get started
                        </p>
                      </td>
                    </tr>
                  )
                  : inviteCodes.map((code) => {
                      const displayStatus = code.display_status || code.status;
                      return (
                        <tr
                          key={code.id}
                          className="group transition-colors hover:bg-gray-50/50"
                        >
                          <td className="py-4 pr-4">
                            <span className="font-mono text-sm font-semibold text-gray-900 tracking-wider">
                              {code.code}
                            </span>
                          </td>
                          <td className="py-4 pr-4">
                            <div>
                              <p className="text-sm text-gray-900">
                                {code.business_name || "—"}
                              </p>
                              {code.business_email && (
                                <p className="text-xs text-gray-500">
                                  {code.business_email}
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="py-4 pr-4">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1 ring-inset ${
                                STATUS_COLORS[displayStatus] || STATUS_COLORS.active
                              }`}
                            >
                              {displayStatus}
                            </span>
                          </td>
                          <td className="py-4 pr-4">
                            <span className="text-sm text-gray-600">
                              {code.times_used} / {code.max_uses}
                            </span>
                          </td>
                          <td className="py-4 pr-4">
                            <span className="text-sm text-gray-500">
                              {formatDate(code.created_at)}
                            </span>
                          </td>
                          <td className="py-4 pr-4">
                            <span className="text-sm text-gray-500">
                              {code.expires_at
                                ? formatDate(code.expires_at)
                                : "Never"}
                            </span>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() =>
                                  copyToClipboard(code.code, "Code")
                                }
                                className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                                title="Copy code"
                              >
                                <Copy className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() =>
                                  copyToClipboard(
                                    `https://astrevix.com/signup?code=${code.code}`,
                                    "Signup link"
                                  )
                                }
                                className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                                title="Copy signup link"
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                              </button>
                              {displayStatus === "active" && (
                                <button
                                  onClick={() => {
                                    setSelectedCode(code);
                                    setShowRevoke(true);
                                  }}
                                  className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-orange-50 hover:text-orange-600"
                                  title="Revoke"
                                >
                                  <Ban className="h-3.5 w-3.5" />
                                </button>
                              )}
                              {code.times_used === 0 && (
                                <button
                                  onClick={() => {
                                    setSelectedCode(code);
                                    setShowDelete(true);
                                  }}
                                  className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                                  title="Delete"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
            <p className="text-xs text-gray-500">
              Showing {(page - 1) * LIMIT + 1}–
              {Math.min(page * LIMIT, total)} of {total}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-40"
              >
                <ChevronLeft className="h-3 w-3" /> Previous
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-40"
              >
                Next <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ====== GENERATE MODAL ====== */}
      <AnimatePresence>
        {showGenerate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            style={{ backdropFilter: "blur(4px)" }}
            onClick={() => setShowGenerate(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-lg rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {genStep === "form" ? (
                <>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Generate Invite Code
                    </h3>
                    <button
                      onClick={() => setShowGenerate(false)}
                      className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="mt-6 space-y-5">
                    {/* Code */}
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">
                        Invite Code
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={genCode}
                          onChange={(e) =>
                            setGenCode(e.target.value.toUpperCase())
                          }
                          readOnly={!genCustom}
                          className={`flex-1 rounded-xl border-[1.5px] border-gray-200 bg-white px-4 py-3 font-mono text-lg font-bold tracking-[0.2em] text-gray-900 outline-none transition-colors ${
                            genCustom
                              ? "focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20"
                              : "bg-gray-50"
                          }`}
                        />
                        {!genCustom && (
                          <button
                            onClick={() => setGenCode(generateCode())}
                            className="rounded-xl border border-gray-200 p-3 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
                            title="Regenerate"
                          >
                            <RefreshCw className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                      <label className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                        <input
                          type="checkbox"
                          checked={genCustom}
                          onChange={(e) => {
                            setGenCustom(e.target.checked);
                            if (!e.target.checked)
                              setGenCode(generateCode());
                          }}
                          className="rounded border-gray-300"
                        />
                        Use custom code
                      </label>
                    </div>

                    {/* Business Name */}
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">
                        Business name{" "}
                        <span className="font-normal text-gray-400">
                          (optional)
                        </span>
                      </label>
                      <input
                        type="text"
                        value={genBusinessName}
                        onChange={(e) => setGenBusinessName(e.target.value)}
                        placeholder="Pre-fill for the invitee"
                        className="w-full rounded-xl border-[1.5px] border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20"
                      />
                    </div>

                    {/* Business Email */}
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">
                        Business email{" "}
                        <span className="font-normal text-gray-400">
                          (optional)
                        </span>
                      </label>
                      <input
                        type="email"
                        value={genBusinessEmail}
                        onChange={(e) => setGenBusinessEmail(e.target.value)}
                        placeholder="Lock code to this email"
                        className="w-full rounded-xl border-[1.5px] border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20"
                      />
                    </div>

                    {/* Max Uses */}
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">
                        Max uses
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={genMaxUses}
                        onChange={(e) =>
                          setGenMaxUses(parseInt(e.target.value) || 1)
                        }
                        className="w-32 rounded-xl border-[1.5px] border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20"
                      />
                    </div>

                    {/* Expiration */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <input
                          type="checkbox"
                          checked={genExpiresEnabled}
                          onChange={(e) =>
                            setGenExpiresEnabled(e.target.checked)
                          }
                          className="rounded border-gray-300"
                        />
                        Set expiration date
                      </label>
                      {genExpiresEnabled && (
                        <input
                          type="date"
                          value={genExpiresAt}
                          onChange={(e) => setGenExpiresAt(e.target.value)}
                          min={new Date().toISOString().split("T")[0]}
                          className="mt-2 rounded-xl border-[1.5px] border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20"
                        />
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => setShowGenerate(false)}
                      className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleGenerate}
                      disabled={genLoading || !genCode.trim()}
                      className="flex-1 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#7C3AED] py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl disabled:opacity-60"
                    >
                      {genLoading ? "Creating..." : "Generate"}
                    </button>
                  </div>
                </>
              ) : (
                /* Confirmation step */
                <>
                  <div className="text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
                      <Check className="h-7 w-7 text-emerald-600" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-gray-900">
                      Invite Code Created
                    </h3>
                    <div className="mt-4 rounded-xl bg-gray-50 px-6 py-4">
                      <p className="font-mono text-2xl font-bold tracking-[0.25em] text-gray-900">
                        {createdCode?.code}
                      </p>
                    </div>

                    <div className="mt-6 flex flex-col gap-3">
                      <button
                        onClick={() =>
                          copyToClipboard(createdCode?.code || "", "Code")
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                      >
                        <Copy className="h-4 w-4" />
                        Copy Code
                      </button>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            `https://astrevix.com/signup?code=${createdCode?.code}`,
                            "Signup link"
                          )
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#7C3AED] py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Copy Signup Link
                      </button>
                    </div>

                    <button
                      onClick={() => setShowGenerate(false)}
                      className="mt-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                    >
                      Done
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====== REVOKE MODAL ====== */}
      <AnimatePresence>
        {showRevoke && selectedCode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            style={{ backdropFilter: "blur(4px)" }}
            onClick={() => setShowRevoke(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-sm rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-900">
                Revoke Invite Code
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Are you sure you want to revoke{" "}
                <span className="font-mono font-semibold text-gray-900">
                  {selectedCode.code}
                </span>
                ? It will no longer be usable for signups.
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    setShowRevoke(false);
                    setSelectedCode(null);
                  }}
                  className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRevoke}
                  disabled={actionLoading}
                  className="flex-1 rounded-xl bg-orange-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600 disabled:opacity-60"
                >
                  {actionLoading ? "Revoking..." : "Revoke"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====== DELETE MODAL ====== */}
      <AnimatePresence>
        {showDelete && selectedCode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            style={{ backdropFilter: "blur(4px)" }}
            onClick={() => setShowDelete(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-sm rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-900">
                Delete Invite Code
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Are you sure you want to delete{" "}
                <span className="font-mono font-semibold text-gray-900">
                  {selectedCode.code}
                </span>
                ? This action cannot be undone.
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    setShowDelete(false);
                    setSelectedCode(null);
                  }}
                  className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={actionLoading}
                  className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-600 disabled:opacity-60"
                >
                  {actionLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====== TOAST ====== */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-6 right-6 z-50 rounded-xl px-5 py-3 text-sm font-medium shadow-lg ${
              toast.type === "success"
                ? "bg-emerald-600 text-white"
                : "bg-red-600 text-white"
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
