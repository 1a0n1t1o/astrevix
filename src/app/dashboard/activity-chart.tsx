"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type TimeRange = "7d" | "30d";

// TODO: Replace with real Supabase query data
// Query submissions grouped by date for the business:
// SELECT DATE(created_at) as date, COUNT(*) as submissions
// FROM submissions WHERE business_id = ? AND created_at >= NOW() - INTERVAL '30 days'
// GROUP BY DATE(created_at) ORDER BY date ASC;
function generateMockData(range: TimeRange) {
  const days = range === "7d" ? 7 : 30;
  const data = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    const dayOfWeek = date.getDay();
    // Simulate realistic patterns: higher on weekends, lower on weekdays
    const base = dayOfWeek === 0 || dayOfWeek === 6 ? 8 : 4;
    const variance = Math.floor(Math.random() * 6);
    const submissions = base + variance;
    const scans = submissions + Math.floor(Math.random() * 8) + 3;

    data.push({
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      submissions,
      scans,
    });
  }
  return data;
}

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
    <div
      className="rounded-xl border px-4 py-3 text-sm"
      style={{
        background: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderColor: "rgba(255, 255, 255, 0.6)",
        boxShadow:
          "0 8px 32px rgba(100, 80, 240, 0.12), 0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <p className="mb-1.5 text-xs font-semibold text-gray-400">{label}</p>
      {payload.map((entry) => (
        <div
          key={entry.dataKey}
          className="flex items-center gap-2"
        >
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-gray-500 capitalize">{entry.dataKey}:</span>
          <span className="font-semibold text-gray-900">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

function CustomDot(props: {
  cx?: number;
  cy?: number;
  index?: number;
  dataKey?: string;
}) {
  const { cx, cy, dataKey } = props;
  if (cx === undefined || cy === undefined) return null;

  const color = dataKey === "submissions" ? "#7C3AED" : "#06B6D4";

  return (
    <circle
      cx={cx}
      cy={cy}
      r={3.5}
      fill={color}
      stroke="white"
      strokeWidth={2}
      style={{
        filter: `drop-shadow(0 0 4px ${color}66)`,
      }}
    />
  );
}

interface ActivityChartProps {
  readonly totalSubmissions: number;
  readonly totalScans: number;
}

export default function ActivityChart({
  totalSubmissions,
  totalScans,
}: ActivityChartProps) {
  const [range, setRange] = useState<TimeRange>("7d");
  const data = generateMockData(range);

  // Calculate mock change percentages
  const changeSubmissions = range === "7d" ? 12 : 24;
  const changeScans = range === "7d" ? 8 : 18;

  // Suppress unused var (placeholder for future real data)
  void totalSubmissions;
  void totalScans;

  return (
    <div className="relative">
      {/* Background gradient blobs for glass effect visibility */}
      <div
        className="pointer-events-none absolute -left-8 -top-8 h-48 w-48 rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, #7C3AED 0%, transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-8 -right-8 h-48 w-48 rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, #06B6D4 0%, transparent 70%)" }}
      />

      {/* Glass card */}
      <div
        className="relative overflow-hidden"
        style={{
          background: "rgba(255, 255, 255, 0.4)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.5)",
          boxShadow:
            "0 8px 32px rgba(100, 80, 240, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.4)",
          borderRadius: "20px",
        }}
      >
        {/* Inner glow top edge */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.8) 50%, transparent)",
          }}
        />

        <div className="p-6 pb-2">
          {/* Header row: Stats + Toggle */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            {/* Stats row */}
            <div className="flex gap-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Submissions
                </p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-2xl font-bold tracking-tight text-gray-900">
                    {data.reduce((sum, d) => sum + d.submissions, 0)}
                  </span>
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-600">
                    <svg
                      className="h-3 w-3"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M7 17l5-5 5 5" />
                      <path d="M7 11l5-5 5 5" />
                    </svg>
                    {changeSubmissions}%
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  QR Scans
                </p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-2xl font-bold tracking-tight text-gray-900">
                    {data.reduce((sum, d) => sum + d.scans, 0)}
                  </span>
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-600">
                    <svg
                      className="h-3 w-3"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M7 17l5-5 5 5" />
                      <path d="M7 11l5-5 5 5" />
                    </svg>
                    {changeScans}%
                  </span>
                </div>
              </div>
            </div>

            {/* Timeframe toggle */}
            <div
              className="flex items-center gap-1 rounded-xl p-1"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              }}
            >
              <button
                onClick={() => setRange("7d")}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  range === "7d"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Last 7 days
              </button>
              <button
                onClick={() => setRange("30d")}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  range === "30d"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Last 30 days
              </button>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="px-2 pb-4" style={{ height: "280px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 8, right: 16, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="gradSubmissions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.3} />
                  <stop offset="60%" stopColor="#7C3AED" stopOpacity={0.08} />
                  <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradScans" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06B6D4" stopOpacity={0.2} />
                  <stop offset="60%" stopColor="#06B6D4" stopOpacity={0.05} />
                  <stop offset="100%" stopColor="#06B6D4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(0,0,0,0.04)"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#9CA3AF" }}
                dy={8}
                interval={range === "30d" ? 4 : 0}
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
                  stroke: "rgba(124, 58, 237, 0.15)",
                  strokeWidth: 1,
                  strokeDasharray: "4 4",
                }}
              />
              <Area
                type="monotone"
                dataKey="scans"
                stroke="#06B6D4"
                strokeWidth={2}
                fill="url(#gradScans)"
                dot={<CustomDot />}
                activeDot={{
                  r: 5,
                  stroke: "#06B6D4",
                  strokeWidth: 2,
                  fill: "white",
                  style: { filter: "drop-shadow(0 0 6px rgba(6, 182, 212, 0.4))" },
                }}
                animationDuration={1200}
                animationEasing="ease-out"
              />
              <Area
                type="monotone"
                dataKey="submissions"
                stroke="#7C3AED"
                strokeWidth={2.5}
                fill="url(#gradSubmissions)"
                dot={<CustomDot />}
                activeDot={{
                  r: 5,
                  stroke: "#7C3AED",
                  strokeWidth: 2,
                  fill: "white",
                  style: { filter: "drop-shadow(0 0 6px rgba(124, 58, 237, 0.5))" },
                }}
                animationDuration={1400}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 border-t border-white/30 px-6 py-3">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-[#7C3AED]" style={{ boxShadow: "0 0 6px rgba(124, 58, 237, 0.4)" }} />
            <span className="text-xs font-medium text-gray-500">Submissions</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-[#06B6D4]" style={{ boxShadow: "0 0 6px rgba(6, 182, 212, 0.4)" }} />
            <span className="text-xs font-medium text-gray-500">QR Scans</span>
          </div>
        </div>
      </div>
    </div>
  );
}
