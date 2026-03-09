"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react";

type StatusFilter = "all" | "active" | "suspended";

interface Owner {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  plan: string;
  status: string;
  created_at: string;
  owner_id: string;
  owner_email: string;
  owner_name: string;
  owner_avatar: string | null;
  submission_count: number;
  auto_approve_requested: boolean;
}

interface OwnersResponse {
  owners: Owner[];
  total: number;
  page: number;
  limit: number;
}

const TABS: { label: string; value: StatusFilter; color: string }[] = [
  { label: "All", value: "all", color: "#2563EB" },
  { label: "Active", value: "active", color: "#059669" },
  { label: "Suspended", value: "suspended", color: "#e11d48" },
];

const PLAN_BADGE_CLASSES: Record<string, string> = {
  free: "bg-gray-100 text-gray-600 ring-gray-500/10",
  pro: "bg-blue-50 text-blue-700 ring-blue-600/20",
};

const STATUS_BADGE_CLASSES: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  suspended: "bg-red-50 text-red-700 ring-red-600/20",
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const LIMIT = 20;

export default function OwnersList() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [owners, setOwners] = useState<Owner[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [tabCounts, setTabCounts] = useState<Record<StatusFilter, number>>({
    all: 0,
    active: 0,
    suspended: 0,
  });

  const fetchOwners = useCallback(
    async (
      currentSearch: string,
      currentStatus: StatusFilter,
      currentPage: number
    ) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          search: currentSearch,
          status: currentStatus,
          page: String(currentPage),
          limit: String(LIMIT),
        });
        const res = await fetch(`/api/admin/owners?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data: OwnersResponse = await res.json();
        setOwners(data.owners);
        setTotal(data.total);
      } catch {
        setOwners([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchTabCounts = useCallback(async (currentSearch: string) => {
    try {
      const statuses: StatusFilter[] = ["all", "active", "suspended"];
      const results = await Promise.all(
        statuses.map(async (s) => {
          const params = new URLSearchParams({
            search: currentSearch,
            status: s,
            page: "1",
            limit: "1",
          });
          const res = await fetch(`/api/admin/owners?${params.toString()}`);
          if (!res.ok) return { status: s, count: 0 };
          const data: OwnersResponse = await res.json();
          return { status: s, count: data.total };
        })
      );
      const counts: Record<StatusFilter, number> = {
        all: 0,
        active: 0,
        suspended: 0,
      };
      results.forEach((r) => {
        counts[r.status] = r.count;
      });
      setTabCounts(counts);
    } catch {
      // Keep existing counts on error
    }
  }, []);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchOwners(search, statusFilter, 1);
      fetchTabCounts(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, statusFilter, fetchOwners, fetchTabCounts]);

  // Page change effect (no debounce)
  useEffect(() => {
    fetchOwners(search, statusFilter, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));
  const startItem = total === 0 ? 0 : (page - 1) * LIMIT + 1;
  const endItem = Math.min(page * LIMIT, total);

  return (
    <div>
      {/* Filter Tabs */}
      <div className="mb-6 flex gap-2">
        {TABS.map((tab) => {
          const count = tabCounts[tab.value];
          const isActive = statusFilter === tab.value;

          return (
            <button
              key={tab.value}
              onClick={() => {
                setStatusFilter(tab.value);
                setPage(1);
              }}
              className={`relative rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? ""
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
              style={isActive ? { color: tab.color } : undefined}
            >
              {isActive && (
                <>
                  <motion.div
                    layoutId="owners-tab-indicator"
                    className="absolute inset-0 rounded-xl"
                    style={{ zIndex: -1, backgroundColor: `${tab.color}15` }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                  <motion.div
                    layoutId="owners-tab-bar"
                    className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
                    style={{ backgroundColor: tab.color }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                </>
              )}
              {tab.label}
              <span
                className={`ml-1.5 rounded-full px-1.5 py-0.5 text-xs ${
                  isActive ? "" : "bg-gray-100 text-gray-500"
                }`}
                style={
                  isActive
                    ? { backgroundColor: `${tab.color}20`, color: tab.color }
                    : undefined
                }
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="relative mb-5">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or business..."
          className="w-full rounded-xl border border-gray-200 bg-white/80 py-2.5 pl-10 pr-9 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10"
          style={{ backdropFilter: "blur(8px)" }}
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Table */}
      <div
        className="overflow-hidden rounded-2xl border border-gray-100 bg-white/70"
        style={{
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          boxShadow: "0 4px 24px -4px rgba(37, 99, 235, 0.06)",
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Owner
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Business
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Email
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Plan
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Submissions
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                // Skeleton rows
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={`skeleton-${i}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
                        <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-36 animate-pulse rounded bg-gray-200" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-5 w-14 animate-pulse rounded-full bg-gray-200" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-5 w-16 animate-pulse rounded-full bg-gray-200" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-8 animate-pulse rounded bg-gray-200" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                    </td>
                  </tr>
                ))
              ) : owners.length === 0 ? (
                // Empty state
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <Search className="mx-auto mb-3 h-10 w-10 text-gray-300" />
                    <p className="font-medium text-gray-900">
                      No owners found
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {search
                        ? `No results match "${search}"`
                        : "There are no business owners to display."}
                    </p>
                  </td>
                </tr>
              ) : (
                // Data rows
                owners.map((owner) => {
                  const avatarLetter = (
                    owner.owner_name.charAt(0) || "?"
                  ).toUpperCase();
                  const planClass =
                    PLAN_BADGE_CLASSES[owner.plan] || PLAN_BADGE_CLASSES.free;
                  const statusClass =
                    STATUS_BADGE_CLASSES[owner.status] ||
                    STATUS_BADGE_CLASSES.active;
                  const truncatedEmail =
                    owner.owner_email.length > 28
                      ? owner.owner_email.substring(0, 28) + "..."
                      : owner.owner_email;

                  return (
                    <tr
                      key={owner.id}
                      onClick={() => router.push(`/admin/owners/${owner.id}`)}
                      className="cursor-pointer transition-colors hover:bg-gray-50/50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {owner.owner_avatar ? (
                            <img
                              src={owner.owner_avatar}
                              alt={owner.owner_name}
                              className="h-8 w-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2563EB] text-xs font-semibold text-white">
                              {avatarLetter}
                            </div>
                          )}
                          <span className="text-sm font-medium text-gray-900">
                            {owner.owner_name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {owner.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {truncatedEmail}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ring-1 ring-inset ${planClass}`}
                        >
                          {owner.plan}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ring-1 ring-inset ${statusClass}`}
                          >
                            {owner.status}
                          </span>
                          {owner.auto_approve_requested && (
                            <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
                              Team Review
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {owner.submission_count}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(owner.created_at)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && total > 0 && (
          <div className="flex items-center justify-between border-t border-gray-100 px-6 py-3.5">
            <p className="text-sm text-gray-500">
              Showing {startItem}-{endItem} of {total} owners
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
