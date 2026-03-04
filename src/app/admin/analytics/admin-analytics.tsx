"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, FileText, Gift, TrendingUp } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface AnalyticsData {
  readonly total_businesses: number;
  readonly total_submissions: number;
  readonly total_rewards: number;
  readonly new_signups_this_month: number;
  readonly signups_by_month: ReadonlyArray<{
    readonly month: string;
    readonly count: number;
  }>;
}

interface StatCard {
  readonly label: string;
  readonly value: number;
  readonly icon: React.ElementType;
  readonly color: string;
  readonly bgColor: string;
}

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatMonth(monthStr: string): string {
  const [year, month] = monthStr.split("-");
  const monthIndex = parseInt(month, 10) - 1;
  if (monthIndex < 0 || monthIndex > 11) return monthStr;
  return `${MONTH_NAMES[monthIndex]} ${year}`;
}

function formatMonthShort(monthStr: string): string {
  const parts = monthStr.split("-");
  const monthIndex = parseInt(parts[1], 10) - 1;
  if (monthIndex < 0 || monthIndex > 11) return monthStr;
  return MONTH_NAMES[monthIndex];
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut" as const,
    },
  }),
};

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string; color: string }>;
  label?: string;
}) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm shadow-lg">
      <p className="mb-1.5 text-xs font-semibold text-gray-400">
        {label ? formatMonth(label) : ""}
      </p>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center gap-2">
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-gray-500">Signups:</span>
          <span className="font-semibold text-gray-900">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div
      className="rounded-2xl border border-gray-100 bg-white/70 p-6"
      style={{
        backdropFilter: "blur(12px)",
        boxShadow: "0 4px 24px -4px rgba(37, 99, 235, 0.06)",
      }}
    >
      <div className="mb-3 h-10 w-10 animate-pulse rounded-full bg-gray-100" />
      <div className="mb-2 h-4 w-24 animate-pulse rounded bg-gray-100" />
      <div className="h-7 w-16 animate-pulse rounded bg-gray-100" />
    </div>
  );
}

function SkeletonChart() {
  return (
    <div
      className="rounded-2xl border border-gray-100 bg-white/70 p-6"
      style={{
        backdropFilter: "blur(12px)",
        boxShadow: "0 4px 24px -4px rgba(37, 99, 235, 0.06)",
      }}
    >
      <div className="mb-6 h-5 w-32 animate-pulse rounded bg-gray-100" />
      <div className="h-[320px] w-full animate-pulse rounded-xl bg-gray-50" />
    </div>
  );
}

export default function AdminAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch("/api/admin/analytics");
        if (!res.ok) {
          throw new Error("Failed to fetch analytics");
        }
        const json: AnalyticsData = await res.json();
        setData(json);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch analytics"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <SkeletonChart />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div
        className="rounded-2xl border border-red-100 bg-red-50/50 p-8 text-center"
        style={{
          backdropFilter: "blur(12px)",
          boxShadow: "0 4px 24px -4px rgba(239, 68, 68, 0.06)",
        }}
      >
        <p className="text-sm font-medium text-red-600">
          {error || "No data available"}
        </p>
      </div>
    );
  }

  const stats: readonly StatCard[] = [
    {
      label: "Total Business Owners",
      value: data.total_businesses,
      icon: Users,
      color: "#2563EB",
      bgColor: "rgba(37, 99, 235, 0.1)",
    },
    {
      label: "Total Submissions",
      value: data.total_submissions,
      icon: FileText,
      color: "#7C3AED",
      bgColor: "rgba(124, 58, 237, 0.1)",
    },
    {
      label: "Total Rewards Sent",
      value: data.total_rewards,
      icon: Gift,
      color: "#059669",
      bgColor: "rgba(5, 150, 105, 0.1)",
    },
    {
      label: "New Signups This Month",
      value: data.new_signups_this_month,
      icon: TrendingUp,
      color: "#D97706",
      bgColor: "rgba(217, 119, 6, 0.1)",
    },
  ];

  const chartData = data.signups_by_month.map((item) => ({
    month: item.month,
    signups: item.count,
  }));

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              className="rounded-2xl border border-gray-100 bg-white/70 p-6"
              style={{
                backdropFilter: "blur(12px)",
                boxShadow: "0 4px 24px -4px rgba(37, 99, 235, 0.06)",
              }}
            >
              <div
                className="mb-3 flex h-10 w-10 items-center justify-center rounded-full"
                style={{ backgroundColor: stat.bgColor }}
              >
                <Icon className="h-5 w-5" style={{ color: stat.color }} />
              </div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                {stat.value.toLocaleString()}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Signups Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
        className="overflow-hidden rounded-2xl border border-gray-100 bg-white/70"
        style={{
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          boxShadow: "0 4px 24px -4px rgba(37, 99, 235, 0.06)",
        }}
      >
        <div className="p-6 pb-2">
          <div className="flex items-center gap-3">
            <div className="h-5 w-1 rounded-full bg-[#2563EB]" />
            <h3 className="text-base font-semibold text-gray-900">
              New Signups
            </h3>
          </div>
        </div>

        <div className="px-2 pb-4" style={{ height: "320px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 8, right: 16, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="gradSignups"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#2563EB" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(0,0,0,0.04)"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#9CA3AF" }}
                dy={8}
                tickFormatter={formatMonthShort}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#9CA3AF" }}
                dx={-4}
                allowDecimals={false}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  stroke: "rgba(37, 99, 235, 0.12)",
                  strokeWidth: 1,
                  strokeDasharray: "4 4",
                }}
              />
              <Area
                type="monotone"
                dataKey="signups"
                stroke="#2563EB"
                strokeWidth={2}
                fill="url(#gradSignups)"
                dot={{
                  r: 3,
                  fill: "#2563EB",
                  stroke: "white",
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 5,
                  stroke: "#2563EB",
                  strokeWidth: 2,
                  fill: "white",
                }}
                animationDuration={1400}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 border-t border-gray-100 px-6 py-3">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-[#2563EB]" />
            <span className="text-xs font-medium text-gray-500">Signups</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
