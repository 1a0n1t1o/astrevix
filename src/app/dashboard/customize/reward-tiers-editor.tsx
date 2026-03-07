"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { RewardTier } from "@/types/database";
import {
  PLATFORM_CONTENT_TYPES,
  VERIFICATION_WINDOW_OPTIONS,
  TIER_PLATFORM_LABELS,
} from "@/lib/data";
import {
  Instagram,
  Music,
  Facebook,
  Star,
  Plus,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  Clock,
  X,
  Check,
  AlertTriangle,
} from "lucide-react";

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  instagram: <Instagram className="h-4.5 w-4.5" />,
  tiktok: <Music className="h-4.5 w-4.5" />,
  facebook: <Facebook className="h-4.5 w-4.5" />,
  google: <Star className="h-4.5 w-4.5" />,
};

const PLATFORM_COLORS: Record<string, string> = {
  instagram: "#E4405F",
  tiktok: "#000000",
  facebook: "#1877F2",
  google: "#FBBC05",
};

interface TierFormData {
  tier_name: string;
  platform: string;
  content_type: string;
  reward_description: string;
  reward_value: string;
  verification_hours: number;
}

const EMPTY_FORM: TierFormData = {
  tier_name: "",
  platform: "instagram",
  content_type: "Story",
  reward_description: "",
  reward_value: "",
  verification_hours: 72,
};

function formatVerificationHours(hours: number): string {
  if (hours <= 48) return `${hours}h`;
  return `${Math.round(hours / 24)}d`;
}

interface RewardTiersEditorProps {
  readonly businessId: string;
  readonly initialTiers: RewardTier[];
  readonly onToast: (message: string) => void;
}

export default function RewardTiersEditor({
  businessId,
  initialTiers,
  onToast,
}: RewardTiersEditorProps) {
  void businessId;

  const [tiers, setTiers] = useState<RewardTier[]>(initialTiers);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<TierFormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const inputClasses =
    "w-full rounded-xl border-[1.5px] border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#d97706] focus:ring-1 focus:ring-[#d97706]/20";

  function autoTierName(platform: string, contentType: string): string {
    const label = TIER_PLATFORM_LABELS[platform] || platform;
    return `${label} ${contentType}`;
  }

  function handlePlatformChange(platform: string) {
    const types = PLATFORM_CONTENT_TYPES[platform] || [];
    const firstType = types[0] || "";
    const newName = autoTierName(platform, firstType);
    setForm((f) => ({
      ...f,
      platform,
      content_type: firstType,
      tier_name: f.tier_name === autoTierName(f.platform, f.content_type) ? newName : f.tier_name,
    }));
  }

  function handleContentTypeChange(contentType: string) {
    const newName = autoTierName(form.platform, contentType);
    setForm((f) => ({
      ...f,
      content_type: contentType,
      tier_name: f.tier_name === autoTierName(f.platform, f.content_type) ? newName : f.tier_name,
    }));
  }

  function openAddForm() {
    setEditingId(null);
    setForm({
      ...EMPTY_FORM,
      tier_name: autoTierName("instagram", "Story"),
    });
    setIsAdding(true);
  }

  function openEditForm(tier: RewardTier) {
    setIsAdding(false);
    setEditingId(tier.id);
    setForm({
      tier_name: tier.tier_name,
      platform: tier.platform,
      content_type: tier.content_type,
      reward_description: tier.reward_description,
      reward_value: tier.reward_value || "",
      verification_hours: tier.verification_hours,
    });
  }

  function cancelForm() {
    setIsAdding(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  async function handleSaveTier() {
    if (!form.tier_name || !form.reward_description) {
      onToast("Tier name and reward description are required.");
      return;
    }

    setSaving(true);

    try {
      if (editingId) {
        // Update existing tier
        const res = await fetch(`/api/business/reward-tiers/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tier_name: form.tier_name,
            platform: form.platform,
            content_type: form.content_type,
            reward_description: form.reward_description,
            reward_value: form.reward_value || null,
            verification_hours: form.verification_hours,
          }),
        });

        if (!res.ok) throw new Error("Failed to update tier");

        setTiers((prev) =>
          prev.map((t) =>
            t.id === editingId
              ? {
                  ...t,
                  tier_name: form.tier_name,
                  platform: form.platform as RewardTier["platform"],
                  content_type: form.content_type,
                  reward_description: form.reward_description,
                  reward_value: form.reward_value || null,
                  verification_hours: form.verification_hours,
                }
              : t
          )
        );
        onToast("Tier updated!");
      } else {
        // Create new tier
        const res = await fetch("/api/business/reward-tiers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tier_name: form.tier_name,
            platform: form.platform,
            content_type: form.content_type,
            reward_description: form.reward_description,
            reward_value: form.reward_value || null,
            verification_hours: form.verification_hours,
          }),
        });

        if (!res.ok) throw new Error("Failed to create tier");

        const data = await res.json();
        setTiers((prev) => [...prev, data.tier]);
        onToast("Tier created!");
      }

      cancelForm();
    } catch {
      onToast("Failed to save tier.");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleActive(tier: RewardTier) {
    const newActive = !tier.is_active;
    // Optimistic update
    setTiers((prev) =>
      prev.map((t) => (t.id === tier.id ? { ...t, is_active: newActive } : t))
    );

    try {
      const res = await fetch(`/api/business/reward-tiers/${tier.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: newActive }),
      });
      if (!res.ok) throw new Error();
    } catch {
      // Revert
      setTiers((prev) =>
        prev.map((t) => (t.id === tier.id ? { ...t, is_active: !newActive } : t))
      );
      onToast("Failed to update tier.");
    }
  }

  async function handleDelete(tierId: string) {
    const prev = tiers;
    setTiers((t) => t.filter((tier) => tier.id !== tierId));
    setDeletingId(null);

    try {
      const res = await fetch(`/api/business/reward-tiers/${tierId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      onToast("Tier deleted.");
    } catch {
      setTiers(prev);
      onToast("Failed to delete tier.");
    }
  }

  async function handleReorder(tierId: string, direction: "up" | "down") {
    const idx = tiers.findIndex((t) => t.id === tierId);
    if (idx === -1) return;
    if (direction === "up" && idx === 0) return;
    if (direction === "down" && idx === tiers.length - 1) return;

    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    const newTiers = [...tiers];
    const tempOrder = newTiers[idx].sort_order;
    newTiers[idx] = { ...newTiers[idx], sort_order: newTiers[swapIdx].sort_order };
    newTiers[swapIdx] = { ...newTiers[swapIdx], sort_order: tempOrder };
    [newTiers[idx], newTiers[swapIdx]] = [newTiers[swapIdx], newTiers[idx]];
    setTiers(newTiers);

    try {
      await Promise.all([
        fetch(`/api/business/reward-tiers/${newTiers[idx].id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sort_order: newTiers[idx].sort_order }),
        }),
        fetch(`/api/business/reward-tiers/${newTiers[swapIdx].id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sort_order: newTiers[swapIdx].sort_order }),
        }),
      ]);
    } catch {
      onToast("Failed to reorder tiers.");
    }
  }

  const availableContentTypes = PLATFORM_CONTENT_TYPES[form.platform] || [];

  return (
    <div className="space-y-4">
      {/* Tier list */}
      {tiers.length === 0 && !isAdding && (
        <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 px-6 py-10 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-50">
            <Star className="h-6 w-6 text-amber-500" />
          </div>
          <p className="text-sm font-medium text-gray-700">
            No reward tiers yet
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Create tiers to offer different rewards for different types of content.
          </p>
        </div>
      )}

      <AnimatePresence mode="popLayout">
        {tiers.map((tier, index) => (
          <motion.div
            key={tier.id}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={`relative rounded-xl border bg-white p-4 transition-all ${
              tier.is_active
                ? "border-gray-200 shadow-sm"
                : "border-gray-100 bg-gray-50/50 opacity-60"
            }`}
          >
            {/* Editing this tier inline */}
            {editingId === tier.id ? (
              <TierForm
                form={form}
                setForm={setForm}
                availableContentTypes={availableContentTypes}
                onPlatformChange={handlePlatformChange}
                onContentTypeChange={handleContentTypeChange}
                onSave={handleSaveTier}
                onCancel={cancelForm}
                saving={saving}
                inputClasses={inputClasses}
                isEdit
              />
            ) : (
              <div className="flex items-start gap-3">
                {/* Platform icon */}
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white"
                  style={{ backgroundColor: PLATFORM_COLORS[tier.platform] || "#6B7280" }}
                >
                  {PLATFORM_ICONS[tier.platform]}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900">
                      {tier.tier_name}
                    </p>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">
                      {tier.content_type}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm text-gray-600">
                    {tier.reward_description}
                    {tier.reward_value && (
                      <span className="ml-1.5 font-semibold text-gray-900">
                        ({tier.reward_value})
                      </span>
                    )}
                  </p>
                  <div className="mt-1.5 flex items-center gap-3 text-xs text-gray-400">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatVerificationHours(tier.verification_hours)} verification
                    </span>
                    {!tier.is_active && (
                      <span className="text-amber-500 font-medium">Inactive</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-1">
                  {/* Reorder */}
                  <button
                    type="button"
                    onClick={() => handleReorder(tier.id, "up")}
                    disabled={index === 0}
                    className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:opacity-30"
                    title="Move up"
                  >
                    <ChevronUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReorder(tier.id, "down")}
                    disabled={index === tiers.length - 1}
                    className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:opacity-30"
                    title="Move down"
                  >
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>

                  {/* Active toggle */}
                  <button
                    type="button"
                    onClick={() => handleToggleActive(tier)}
                    className={`relative ml-1 inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors ${
                      tier.is_active ? "bg-green-500" : "bg-gray-300"
                    }`}
                    title={tier.is_active ? "Deactivate" : "Activate"}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                        tier.is_active ? "translate-x-4" : "translate-x-0.5"
                      } mt-0.5`}
                    />
                  </button>

                  {/* Edit */}
                  <button
                    type="button"
                    onClick={() => openEditForm(tier)}
                    className="ml-1 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                    title="Edit"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => setDeletingId(tier.id)}
                    className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Delete confirmation */}
            <AnimatePresence>
              {deletingId === tier.id && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="mt-3 flex items-center gap-3 rounded-lg border border-red-100 bg-red-50 px-3 py-2"
                >
                  <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
                  <p className="flex-1 text-xs text-red-700">
                    Delete this tier? This cannot be undone.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleDelete(tier.id)}
                    className="rounded-lg bg-red-500 px-3 py-1 text-xs font-medium text-white hover:bg-red-600"
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingId(null)}
                    className="rounded-lg bg-white px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Add form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-xl border border-amber-200 bg-amber-50/30 p-4">
              <p className="mb-4 text-sm font-semibold text-gray-900">
                New Reward Tier
              </p>
              <TierForm
                form={form}
                setForm={setForm}
                availableContentTypes={availableContentTypes}
                onPlatformChange={handlePlatformChange}
                onContentTypeChange={handleContentTypeChange}
                onSave={handleSaveTier}
                onCancel={cancelForm}
                saving={saving}
                inputClasses={inputClasses}
                isEdit={false}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add button */}
      {!isAdding && editingId === null && (
        <motion.button
          type="button"
          onClick={openAddForm}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-white py-3 text-sm font-medium text-gray-600 transition-colors hover:border-amber-300 hover:bg-amber-50/50 hover:text-amber-700"
        >
          <Plus className="h-4 w-4" />
          Add Reward Tier
        </motion.button>
      )}
    </div>
  );
}

/* ----- Inline Form Component ----- */

interface TierFormProps {
  readonly form: TierFormData;
  readonly setForm: React.Dispatch<React.SetStateAction<TierFormData>>;
  readonly availableContentTypes: string[];
  readonly onPlatformChange: (platform: string) => void;
  readonly onContentTypeChange: (contentType: string) => void;
  readonly onSave: () => void;
  readonly onCancel: () => void;
  readonly saving: boolean;
  readonly inputClasses: string;
  readonly isEdit: boolean;
}

function TierForm({
  form,
  setForm,
  availableContentTypes,
  onPlatformChange,
  onContentTypeChange,
  onSave,
  onCancel,
  saving,
  inputClasses,
  isEdit,
}: TierFormProps) {
  return (
    <div className="space-y-3">
      {/* Row 1: Platform + Content Type */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Platform
          </label>
          <select
            value={form.platform}
            onChange={(e) => onPlatformChange(e.target.value)}
            className={inputClasses}
          >
            <option value="instagram">Instagram</option>
            <option value="tiktok">TikTok</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Content Type
          </label>
          <select
            value={form.content_type}
            onChange={(e) => onContentTypeChange(e.target.value)}
            className={inputClasses}
          >
            {availableContentTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 2: Tier name */}
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">
          Tier Name
        </label>
        <input
          type="text"
          value={form.tier_name}
          onChange={(e) => setForm((f) => ({ ...f, tier_name: e.target.value }))}
          placeholder="e.g. Instagram Reel"
          className={inputClasses}
        />
      </div>

      {/* Row 3: Reward description + value */}
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2">
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Reward Description
          </label>
          <input
            type="text"
            value={form.reward_description}
            onChange={(e) =>
              setForm((f) => ({ ...f, reward_description: e.target.value }))
            }
            placeholder="e.g. Free coffee on your next visit"
            className={inputClasses}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Value
          </label>
          <input
            type="text"
            value={form.reward_value}
            onChange={(e) =>
              setForm((f) => ({ ...f, reward_value: e.target.value }))
            }
            placeholder="e.g. FREE, 20%"
            className={inputClasses}
          />
        </div>
      </div>

      {/* Row 4: Verification window */}
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">
          Verification Window
        </label>
        <select
          value={form.verification_hours}
          onChange={(e) =>
            setForm((f) => ({ ...f, verification_hours: parseInt(e.target.value) }))
          }
          className={inputClasses}
        >
          {VERIFICATION_WINDOW_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <p className="mt-1.5 text-[11px] text-gray-400">
          The post must stay live for this duration before you can approve the reward.
          For stories, we recommend 24 hours. For reels and TikToks, 3 days.
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={onSave}
          disabled={saving || !form.tier_name || !form.reward_description}
          className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-600 disabled:opacity-50"
        >
          {saving ? (
            <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <Check className="h-3.5 w-3.5" />
          )}
          {isEdit ? "Update" : "Save"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          <X className="h-3.5 w-3.5" />
          Cancel
        </button>
      </div>
    </div>
  );
}
