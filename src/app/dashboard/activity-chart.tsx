"use client";

import { useState, useMemo } from "react";
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

interface ChartDataPoint {
  readonly date: string;
  readonly submissions: number;
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
      className="rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm shadow-lg"
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
  const { cx, cy } = props;
  if (cx === undefined || cy === undefined) return null;

  return (
    <circle
      cx={cx}
      cy={cy}
      r={3}
      fill="#2563EB"
      stroke="white"
      strokeWidth={2}
    />
  );
}

interface ActivityChartProps {
  readonly chartData: readonly ChartDataPoint[];
}

export default function ActivityChart({ chartData }: ActivityChartProps) {
  const [range, setRange] = useState<TimeRange>("7d");

  // Slice data based on selected range
  const data = useMemo(() => {
    if (range === "7d") {
      return chartData.slice(-7);
    }
    return chartData;
  }, [chartData, range]);

  // Calculate total for the selected range
  const totalInRange = useMemo(
    () => data.reduce((sum, d) => sum + d.submissions, 0),
    [data]
  );

  // Calculate percentage change compared to previous period
  const changePercent = useMemo(() => {
    const days = range === "7d" ? 7 : 30;
    const currentSlice = chartData.slice(-days);
    const previousSlice = chartData.slice(-days * 2, -days);

    const currentTotal = currentSlice.reduce((sum, d) => sum + d.submissions, 0);
    const previousTotal = previousSlice.reduce((sum, d) => sum + d.submissions, 0);

    if (previousTotal === 0) return currentTotal > 0 ? 100 : 0;
    return Math.round(((currentTotal - previousTotal) / previousTotal) * 100);
  }, [chartData, range]);

  const isPositiveChange = changePercent >= 0;

  return (
    <div
      className="overflow-hidden rounded-2xl border border-gray-100 bg-white/70"
      style={{
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        boxShadow: "0 4px 24px -4px rgba(37, 99, 235, 0.06)",
      }}
    >
      <div className="p-6 pb-2">
        {/* Header row: Stats + Toggle */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          {/* Stats */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Submissions
            </p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-gray-900">
                {totalInRange}
              </span>
              {changePercent !== 0 && (
                <span
                  className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold ${
                    isPositiveChange
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  <svg
                    className="h-3 w-3"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      transform: isPositiveChange ? "none" : "rotate(180deg)",
                    }}
                  >
                    <path d="M7 17l5-5 5 5" />
                    <path d="M7 11l5-5 5 5" />
                  </svg>
                  {Math.abs(changePercent)}%
                </span>
              )}
            </div>
          </div>

          {/* Timeframe toggle */}
          <div
            className="flex items-center gap-1 rounded-xl p-1"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.04)" }}
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
                stroke: "rgba(37, 99, 235, 0.12)",
                strokeWidth: 1,
                strokeDasharray: "4 4",
              }}
            />
            <Area
              type="monotone"
              dataKey="submissions"
              stroke="#2563EB"
              strokeWidth={2}
              fill="url(#gradSubmissions)"
              dot={<CustomDot />}
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
          <span className="text-xs font-medium text-gray-500">Submissions</span>
        </div>
      </div>
    </div>
  );
}
