"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, ChevronDown, ChevronUp, Lock } from "lucide-react";
import type { UserProfile } from "@/types/database";

const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" as const },
  }),
};

const SECTION_COLORS = ["#2563EB", "#7c3aed", "#059669"];

interface AccountProfileProps {
  readonly userProfile: UserProfile;
  readonly userEmail: string;
  readonly onToast: (message: string) => void;
}

export default function AccountProfile({
  userProfile,
  userEmail,
  onToast,
}: AccountProfileProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile state
  const [firstName, setFirstName] = useState(userProfile.first_name);
  const [lastName, setLastName] = useState(userProfile.last_name);
  const [avatarUrl, setAvatarUrl] = useState(userProfile.avatar_url || "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Password state
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const inputClasses =
    "w-full rounded-xl border-[1.5px] border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20";

  // Avatar initial fallback
  const avatarInitial = (
    userProfile.first_name || userEmail || "U"
  )
    .charAt(0)
    .toUpperCase();

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      onToast("Failed: File too large. Maximum size is 5MB.");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await fetch("/api/settings/profile/avatar", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.avatarUrl) {
        setAvatarUrl(data.avatarUrl + "?t=" + Date.now());
        onToast("Profile photo updated!");
        router.refresh();
      } else {
        onToast(data.error || "Failed to upload photo.");
      }
    } catch {
      onToast("Failed to upload photo.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleSaveProfile() {
    setSaving(true);
    try {
      const res = await fetch("/api/settings/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
        }),
      });

      if (res.ok) {
        onToast("Profile updated!");
        router.refresh();
      } else {
        const data = await res.json();
        onToast(data.error || "Failed to save profile.");
      }
    } catch {
      onToast("Failed to save profile.");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdatePassword() {
    if (newPassword !== confirmPassword) {
      onToast("Failed: Passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      onToast("Failed: Password must be at least 6 characters.");
      return;
    }

    setUpdatingPassword(true);
    try {
      const res = await fetch("/api/settings/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        onToast("Password updated successfully!");
        setPasswordOpen(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        onToast(data.error || "Failed to update password.");
      }
    } catch {
      onToast("Failed to update password.");
    } finally {
      setUpdatingPassword(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Section 0: Profile Photo */}
      <motion.section
        custom={0}
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="rounded-2xl border border-gray-100 bg-white/70 p-6"
        style={{
          backdropFilter: "blur(12px)",
          boxShadow: "0 4px 24px -4px rgba(37, 99, 235, 0.06)",
        }}
      >
        <h2
          className="text-base font-semibold text-gray-900"
          style={{ paddingLeft: "12px", borderLeft: `3px solid ${SECTION_COLORS[0]}` }}
        >
          Profile Photo
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Upload a profile photo (max 5MB)
        </p>

        <div className="mt-5 flex items-center gap-5">
          {/* Avatar circle with hover overlay */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="group relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:ring-offset-2"
            style={
              avatarUrl
                ? {}
                : {
                    background: "linear-gradient(135deg, #2563EB, #7C3AED)",
                  }
            }
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold text-white">
                {avatarInitial}
              </span>
            )}

            {/* Hover overlay with camera icon */}
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              {uploading ? (
                <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <Camera className="h-5 w-5 text-white" />
              )}
            </div>
          </button>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleAvatarUpload}
            className="hidden"
          />

          <div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="rounded-xl border-[1.5px] border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50 disabled:opacity-50"
            >
              {uploading ? (
                <span className="flex items-center gap-2">
                  <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                  Uploading...
                </span>
              ) : (
                "Change photo"
              )}
            </button>
            <p className="mt-2 text-xs text-gray-400">PNG, JPG, or WebP</p>
          </div>
        </div>
      </motion.section>

      {/* Section 1: Personal Information */}
      <motion.section
        custom={1}
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="rounded-2xl border border-gray-100 bg-white/70 p-6"
        style={{
          backdropFilter: "blur(12px)",
          boxShadow: "0 4px 24px -4px rgba(37, 99, 235, 0.06)",
        }}
      >
        <h2
          className="text-base font-semibold text-gray-900"
          style={{ paddingLeft: "12px", borderLeft: `3px solid ${SECTION_COLORS[1]}` }}
        >
          Personal Information
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Your name and contact details
        </p>

        <div className="mt-5 space-y-4">
          {/* Name fields side by side */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="first-name"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                First name
              </label>
              <input
                id="first-name"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
                className={inputClasses}
              />
            </div>
            <div>
              <label
                htmlFor="last-name"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Last name
              </label>
              <input
                id="last-name"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
                className={inputClasses}
              />
            </div>
          </div>

          {/* Email (read-only) */}
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={userEmail}
              disabled
              className="w-full rounded-xl border-[1.5px] border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500 outline-none"
            />
            <p className="mt-1.5 text-xs text-gray-400">
              To change your email, update it through your account provider
            </p>
          </div>
        </div>
      </motion.section>

      {/* Section 2: Security */}
      <motion.section
        custom={2}
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="rounded-2xl border border-gray-100 bg-white/70 p-6"
        style={{
          backdropFilter: "blur(12px)",
          boxShadow: "0 4px 24px -4px rgba(37, 99, 235, 0.06)",
        }}
      >
        <h2
          className="text-base font-semibold text-gray-900"
          style={{ paddingLeft: "12px", borderLeft: `3px solid ${SECTION_COLORS[2]}` }}
        >
          Security
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Manage your password and account security
        </p>

        <div className="mt-5">
          {/* Toggle button */}
          <button
            type="button"
            onClick={() => setPasswordOpen(!passwordOpen)}
            className="flex w-full items-center justify-between rounded-xl border-[1.5px] border-gray-200 bg-white px-4 py-3 text-left text-sm font-medium text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50"
          >
            <span className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-gray-400" />
              Change password
            </span>
            {passwordOpen ? (
              <ChevronUp className="h-4 w-4 text-gray-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-400" />
            )}
          </button>

          {/* Collapsible password fields */}
          <AnimatePresence>
            {passwordOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <div className="mt-4 space-y-4">
                  <div>
                    <label
                      htmlFor="current-password"
                      className="mb-1.5 block text-sm font-medium text-gray-700"
                    >
                      Current password
                    </label>
                    <input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      className={inputClasses}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="new-password"
                      className="mb-1.5 block text-sm font-medium text-gray-700"
                    >
                      New password
                    </label>
                    <input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className={inputClasses}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="confirm-password"
                      className="mb-1.5 block text-sm font-medium text-gray-700"
                    >
                      Confirm new password
                    </label>
                    <input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className={inputClasses}
                    />
                  </div>

                  <motion.button
                    type="button"
                    onClick={handleUpdatePassword}
                    disabled={
                      updatingPassword ||
                      !currentPassword ||
                      !newPassword ||
                      !confirmPassword
                    }
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full rounded-xl bg-gray-900 py-3 text-sm font-semibold text-white transition-all hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {updatingPassword ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Updating...
                      </span>
                    ) : (
                      "Update Password"
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.section>

      {/* Save profile button */}
      <motion.button
        type="button"
        onClick={handleSaveProfile}
        disabled={saving || !firstName.trim()}
        whileHover={{
          scale: 1.01,
          boxShadow: "0 12px 28px -4px rgba(37, 99, 235, 0.35)",
        }}
        whileTap={{ scale: 0.99 }}
        className="w-full rounded-xl bg-gradient-to-r from-[#2563EB] to-[#7C3AED] py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving ? (
          <span className="flex items-center justify-center gap-2">
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Saving...
          </span>
        ) : (
          "Save changes"
        )}
      </motion.button>
    </div>
  );
}
