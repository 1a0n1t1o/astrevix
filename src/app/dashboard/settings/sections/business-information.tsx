"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { Business, OperatingHours, DayOfWeek, DayHours } from "@/types/database";

interface BusinessInformationProps {
  readonly business: Business;
  readonly onToast: (message: string) => void;
}

const CATEGORIES = [
  "",
  "Restaurant",
  "Cafe",
  "Barbershop",
  "Gym",
  "Spa",
  "Salon",
  "Retail",
  "Other",
];

const DAYS_OF_WEEK: { key: DayOfWeek; label: string }[] = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
];

const DEFAULT_HOURS: OperatingHours = {
  monday: { open: "09:00", close: "17:00", closed: false },
  tuesday: { open: "09:00", close: "17:00", closed: false },
  wednesday: { open: "09:00", close: "17:00", closed: false },
  thursday: { open: "09:00", close: "17:00", closed: false },
  friday: { open: "09:00", close: "17:00", closed: false },
  saturday: { open: "09:00", close: "17:00", closed: true },
  sunday: { open: "09:00", close: "17:00", closed: true },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" as const },
  }),
};

const SECTION_COLORS = ["#2563EB", "#7c3aed", "#059669"];

const INPUT_CLASS =
  "w-full rounded-xl border-[1.5px] border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20";

const glassCard = {
  className: "rounded-2xl border border-gray-100 bg-white/70 p-6",
  style: {
    backdropFilter: "blur(12px)",
    boxShadow: "0 4px 24px -4px rgba(37, 99, 235, 0.06)",
  },
};

function initHours(business: Business): OperatingHours {
  if (business.operating_hours && Object.keys(business.operating_hours).length > 0) {
    const merged: OperatingHours = {};
    for (const { key } of DAYS_OF_WEEK) {
      const existing = business.operating_hours[key];
      if (existing) {
        merged[key] = { ...existing };
      } else {
        merged[key] = { ...(DEFAULT_HOURS[key] as DayHours) };
      }
    }
    return merged;
  }
  return JSON.parse(JSON.stringify(DEFAULT_HOURS)) as OperatingHours;
}

export default function BusinessInformation({
  business,
  onToast,
}: BusinessInformationProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  // Basic info
  const [name, setName] = useState(business.name ?? "");
  const [category, setCategory] = useState(business.category ?? "");
  const [phone, setPhone] = useState(business.phone ?? "");
  const [website, setWebsite] = useState(business.website ?? "");

  // Address
  const [street, setStreet] = useState(business.address_street ?? "");
  const [city, setCity] = useState(business.address_city ?? "");
  const [state, setState] = useState(business.address_state ?? "");
  const [zip, setZip] = useState(business.address_zip ?? "");

  // Operating hours
  const [hours, setHours] = useState<OperatingHours>(() => initHours(business));

  function updateDay(day: DayOfWeek, field: keyof DayHours, value: string | boolean) {
    setHours((prev) => ({
      ...prev,
      [day]: {
        ...(prev[day] as DayHours),
        [field]: value,
      },
    }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/settings/business-info", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          category: category || null,
          phone: phone || null,
          website: website || null,
          address_street: street || null,
          address_city: city || null,
          address_state: state || null,
          address_zip: zip || null,
          operating_hours: hours,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Failed to save");
      }

      onToast("Business information saved");
      router.refresh();
    } catch (err) {
      onToast(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Section 0: Basic Information */}
      <motion.section
        custom={0}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className={glassCard.className}
        style={glassCard.style}
      >
        <h3
          className="text-base font-semibold text-gray-900"
          style={{ paddingLeft: "12px", borderLeft: `3px solid ${SECTION_COLORS[0]}` }}
        >
          Basic Information
        </h3>

        <div className="mt-5 space-y-4">
          {/* Business Name */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Business Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your business name"
              className={INPUT_CLASS}
            />
          </div>

          {/* Category */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={INPUT_CLASS}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "" ? "Select a category" : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Phone */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(555) 123-4567"
              className={INPUT_CLASS}
            />
          </div>

          {/* Website URL */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Website URL
            </label>
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://yourbusiness.com"
              className={INPUT_CLASS}
            />
          </div>
        </div>
      </motion.section>

      {/* Section 1: Business Address */}
      <motion.section
        custom={1}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className={glassCard.className}
        style={glassCard.style}
      >
        <h3
          className="text-base font-semibold text-gray-900"
          style={{ paddingLeft: "12px", borderLeft: `3px solid ${SECTION_COLORS[1]}` }}
        >
          Business Address
        </h3>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Street Address */}
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Street Address
            </label>
            <input
              type="text"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="123 Main St"
              className={INPUT_CLASS}
            />
          </div>

          {/* City */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              City
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
              className={INPUT_CLASS}
            />
          </div>

          {/* State */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              State
            </label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="State"
              className={INPUT_CLASS}
            />
          </div>

          {/* ZIP Code */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              ZIP Code
            </label>
            <input
              type="text"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              placeholder="12345"
              className={INPUT_CLASS}
            />
          </div>
        </div>
      </motion.section>

      {/* Section 2: Operating Hours */}
      <motion.section
        custom={2}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className={glassCard.className}
        style={glassCard.style}
      >
        <h3
          className="text-base font-semibold text-gray-900"
          style={{ paddingLeft: "12px", borderLeft: `3px solid ${SECTION_COLORS[2]}` }}
        >
          Operating Hours
        </h3>

        <div className="mt-5 space-y-3">
          {DAYS_OF_WEEK.map(({ key, label }) => {
            const day = hours[key] as DayHours;
            return (
              <div
                key={key}
                className="grid grid-cols-[100px_1fr_1fr_auto] items-center gap-3 sm:grid-cols-[120px_1fr_1fr_auto]"
              >
                <span className="text-sm font-medium text-gray-700">{label}</span>

                <input
                  type="time"
                  value={day.open}
                  onChange={(e) => updateDay(key, "open", e.target.value)}
                  disabled={day.closed}
                  className={`${INPUT_CLASS} ${day.closed ? "cursor-not-allowed opacity-40" : ""}`}
                />

                <input
                  type="time"
                  value={day.close}
                  onChange={(e) => updateDay(key, "close", e.target.value)}
                  disabled={day.closed}
                  className={`${INPUT_CLASS} ${day.closed ? "cursor-not-allowed opacity-40" : ""}`}
                />

                {/* Closed toggle */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={day.closed}
                  aria-label={`${label} closed`}
                  onClick={() => updateDay(key, "closed", !day.closed)}
                  className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                    day.closed ? "bg-green-500" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                      day.closed ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>

                <span className="hidden text-xs text-gray-500 sm:inline">
                  {day.closed ? "Closed" : "Open"}
                </span>
              </div>
            );
          })}
        </div>
      </motion.section>

      {/* Save Button */}
      <motion.button
        whileHover={{
          scale: 1.01,
          boxShadow: "0 12px 28px -4px rgba(37, 99, 235, 0.35)",
        }}
        whileTap={{ scale: 0.99 }}
        disabled={saving}
        onClick={handleSave}
        className="w-full rounded-xl bg-gradient-to-r from-[#2563EB] to-[#7C3AED] py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save Business Information"}
      </motion.button>
    </div>
  );
}
