import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import type { Submission } from "@/types/database";
import ActivityChart from "./activity-chart";

function PlatformIcon({ platform, className = "h-5 w-5" }: { platform: string; className?: string }) {
  switch (platform) {
    case "instagram":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <circle cx="12" cy="12" r="5" />
          <path d="M17.5 6.5h.01" />
        </svg>
      );
    case "tiktok":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
        </svg>
      );
    case "youtube":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
          <path d="m10 15 5-3-5-3z" />
        </svg>
      );
    case "x":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
        </svg>
      );
    case "facebook":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      );
    default:
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      );
  }
}

function StatIcon({ type, className = "h-6 w-6" }: { type: string; className?: string }) {
  switch (type) {
    case "total":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3v18h18" />
          <path d="m19 9-5 5-4-4-3 3" />
        </svg>
      );
    case "pending":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      );
    case "approved":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      );
    default:
      return null;
  }
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function StatusBadge({ status }: Readonly<{ status: string }>) {
  const styles: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${styles[status] || styles.pending}`}
    >
      {status}
    </span>
  );
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: business } = await supabase
    .from("businesses")
    .select("id, name")
    .eq("owner_id", user.id)
    .single();

  if (!business) return null;

  // Fetch submission counts in parallel
  const [totalResult, pendingResult, approvedResult, recentResult] =
    await Promise.all([
      supabase
        .from("submissions")
        .select("*", { count: "exact", head: true })
        .eq("business_id", business.id),
      supabase
        .from("submissions")
        .select("*", { count: "exact", head: true })
        .eq("business_id", business.id)
        .eq("status", "pending"),
      supabase
        .from("submissions")
        .select("*", { count: "exact", head: true })
        .eq("business_id", business.id)
        .eq("status", "approved"),
      supabase
        .from("submissions")
        .select("*")
        .eq("business_id", business.id)
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

  const totalCount = totalResult.count ?? 0;
  const pendingCount = pendingResult.count ?? 0;
  const approvedCount = approvedResult.count ?? 0;
  const recentSubmissions = (recentResult.data as Submission[]) || [];

  const stats = [
    {
      label: "Total Submissions",
      value: totalCount,
      iconType: "total",
      iconColor: "#2563EB",
      bgColor: "#eff6ff",
      borderColor: "#bfdbfe",
      shadowColor: "rgba(37, 99, 235, 0.08)",
    },
    {
      label: "Pending Review",
      value: pendingCount,
      iconType: "pending",
      iconColor: "#D97706",
      bgColor: "#fffbeb",
      borderColor: "#fde68a",
      shadowColor: "rgba(217, 119, 6, 0.08)",
      highlight: pendingCount > 0,
    },
    {
      label: "Approved",
      value: approvedCount,
      iconType: "approved",
      iconColor: "#059669",
      bgColor: "#ecfdf5",
      borderColor: "#a7f3d0",
      shadowColor: "rgba(5, 150, 105, 0.08)",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="dash-animate-fade-in-up mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          {getGreeting()}, {business.name}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Here&apos;s what&apos;s happening with your submissions
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className={`dash-animate-fade-in-up dash-stagger-${index + 1} dash-card-hover relative overflow-hidden rounded-2xl p-6`}
            style={{
              backgroundColor: stat.bgColor,
              border: `1px solid ${stat.borderColor}`,
              boxShadow: `0 4px 24px -4px ${stat.shadowColor}`,
            }}
          >
            {/* Left accent bar */}
            <div
              className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full"
              style={{ backgroundColor: stat.iconColor }}
            />

            <div
              className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl"
              style={{
                backgroundColor: `${stat.iconColor}18`,
                color: stat.iconColor,
              }}
            >
              <StatIcon type={stat.iconType} />
            </div>
            <p
              className="dash-animate-number text-4xl font-bold tracking-tight text-gray-900"
              style={{ animationDelay: `${index * 100 + 200}ms` }}
            >
              {stat.value}
            </p>
            <p className="mt-1 text-sm font-medium text-gray-500">
              {stat.label}
            </p>
            {stat.highlight && (
              <p className="mt-2 text-xs font-medium text-amber-600">
                Needs attention
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Activity Chart */}
      <div
        className="dash-animate-fade-in-up mt-8"
        style={{ animationDelay: "250ms" }}
      >
        <ActivityChart
          totalSubmissions={totalCount}
          totalScans={0}
        />
      </div>

      {/* Recent Submissions */}
      <div
        className="dash-animate-fade-in-up mt-10"
        style={{ animationDelay: "400ms" }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            Recent Submissions
          </h2>
          {recentSubmissions.length > 0 && (
            <Link
              href="/dashboard/submissions"
              className="text-sm font-medium text-[#2563EB] hover:underline"
            >
              View all
            </Link>
          )}
        </div>

        {recentSubmissions.length === 0 ? (
          <div
            className="dash-animate-scale-in mt-6 rounded-2xl border border-gray-100 p-12 text-center"
            style={{
              animationDelay: "300ms",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              boxShadow: "0 4px 24px -4px rgba(37, 99, 235, 0.06)",
            }}
          >
            <div className="mx-auto mb-4 text-gray-300">
              <svg className="mx-auto h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-6l-2 3h-4l-2-3H2" />
                <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
              </svg>
            </div>
            <p className="font-medium text-gray-900">No submissions yet</p>
            <p className="mt-1 text-sm text-gray-500">
              Share your QR code to start getting customer content!
            </p>
          </div>
        ) : (
          <div
            className="dash-animate-fade-in-up mt-4 overflow-hidden rounded-2xl border border-gray-100"
            style={{
              animationDelay: "400ms",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              boxShadow: "0 4px 24px -4px rgba(37, 99, 235, 0.06)",
            }}
          >
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Platform</th>
                  <th className="hidden px-6 py-4 md:table-cell">Post</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="hidden px-6 py-4 sm:table-cell">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentSubmissions.map((sub, index) => (
                  <tr
                    key={sub.id}
                    className="dash-animate-fade-in-up hover:bg-blue-50/30"
                    style={{ animationDelay: `${500 + index * 80}ms` }}
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">
                        {sub.customer_name}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex h-5 w-5 text-gray-500">
                        <PlatformIcon platform={sub.detected_platform || ""} />
                      </span>
                    </td>
                    <td className="hidden px-6 py-4 md:table-cell">
                      <a
                        href={sub.post_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="max-w-[200px] truncate text-sm text-[#2563EB] hover:underline"
                      >
                        {sub.post_url.replace(/^https?:\/\//, "").substring(0, 40)}
                        {sub.post_url.length > 40 ? "..." : ""}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={sub.status} />
                    </td>
                    <td className="hidden px-6 py-4 sm:table-cell">
                      <span className="text-sm text-gray-500">
                        {formatDate(sub.created_at)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
