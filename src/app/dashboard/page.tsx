import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import type { Submission } from "@/types/database";

const PLATFORM_ICONS: Record<string, string> = {
  instagram: "📸",
  tiktok: "🎵",
  youtube: "▶️",
  x: "🐦",
  facebook: "📘",
};

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
      icon: "📊",
    },
    {
      label: "Pending Review",
      value: pendingCount,
      icon: "⏳",
      highlight: pendingCount > 0,
    },
    {
      label: "Approved",
      value: approvedCount,
      icon: "✅",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          {getGreeting()}, {business.name}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Here&apos;s what&apos;s happening with your submissions
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`rounded-2xl border p-6 ${
              stat.highlight
                ? "border-amber-200 bg-amber-50/50"
                : "border-gray-100 bg-white/70"
            }`}
            style={{
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          >
            <div className="mb-3 text-2xl">{stat.icon}</div>
            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
            <p className="mt-1 text-3xl font-semibold text-gray-900">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Submissions */}
      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
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
          <div className="mt-6 rounded-2xl border border-gray-100 bg-white/70 p-12 text-center">
            <div className="mx-auto mb-4 text-4xl">📭</div>
            <p className="font-medium text-gray-900">No submissions yet</p>
            <p className="mt-1 text-sm text-gray-500">
              Share your QR code to start getting customer content!
            </p>
          </div>
        ) : (
          <div className="mt-4 overflow-hidden rounded-2xl border border-gray-100 bg-white/70">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Platform</th>
                  <th className="hidden px-5 py-3 md:table-cell">Post</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="hidden px-5 py-3 sm:table-cell">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentSubmissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50/50">
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-medium text-gray-900">
                        {sub.customer_name}
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-lg">
                        {sub.detected_platform
                          ? PLATFORM_ICONS[sub.detected_platform] || "🔗"
                          : "🔗"}
                      </span>
                    </td>
                    <td className="hidden px-5 py-3.5 md:table-cell">
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
                    <td className="px-5 py-3.5">
                      <StatusBadge status={sub.status} />
                    </td>
                    <td className="hidden px-5 py-3.5 sm:table-cell">
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
