"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

const CALENDLY_URL = "https://calendly.com/contact-astrevix/new-meeting";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 50);
}

function SignupForm() {
  const searchParams = useSearchParams();
  const [inviteCode, setInviteCode] = useState(
    searchParams.get("code")?.toUpperCase() || ""
  );
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Step 1: Validate invite code
    let finalBusinessName = businessName;
    try {
      const validateRes = await fetch("/api/auth/validate-invite-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: inviteCode, email }),
      });
      const validateData = await validateRes.json();
      if (!validateRes.ok) {
        setError(validateData.error || "Invalid invite code");
        setLoading(false);
        return;
      }
      // If invite code has a pre-set business name, use it
      if (validateData.business_name) {
        finalBusinessName = validateData.business_name;
      }
    } catch {
      setError("Could not validate invite code. Please try again.");
      setLoading(false);
      return;
    }

    const supabase = createClient();

    // Step 2: Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError || !authData.user) {
      setError(authError?.message || "Signup failed. Please try again.");
      setLoading(false);
      return;
    }

    // Step 3: Insert business row
    const slug = generateSlug(finalBusinessName);
    const { error: bizError } = await supabase.from("businesses").insert({
      name: finalBusinessName,
      slug,
      owner_id: authData.user.id,
      reward_description: "10% off your next visit",
    });

    if (bizError) {
      // Handle slug collision (unique constraint violation)
      if (bizError.code === "23505") {
        const slugWithSuffix = `${slug}-${Math.random().toString(36).substring(2, 6)}`;
        const { error: retryError } = await supabase.from("businesses").insert({
          name: finalBusinessName,
          slug: slugWithSuffix,
          owner_id: authData.user.id,
          reward_description: "10% off your next visit",
        });
        if (retryError) {
          setError("Could not create your business. Please try again.");
          setLoading(false);
          return;
        }
      } else {
        setError("Could not create your business. Please try again.");
        setLoading(false);
        return;
      }
    }

    // Step 4: Claim the invite code (fire-and-forget)
    fetch("/api/auth/claim-invite-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: inviteCode,
        user_id: authData.user.id,
      }),
    }).catch(() => {
      // Non-blocking — account was already created successfully
    });

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div>
      {/* Logo */}
      <div className="mb-8 flex justify-center">
        <Image
          src="/logo-text.png"
          alt="Astrevix"
          width={140}
          height={28}
          style={{ filter: "brightness(0)" }}
        />
      </div>

      {/* Card */}
      <div
        className="rounded-2xl border border-white/30 p-8 shadow-xl"
        style={{
          background: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <h2 className="text-xl font-semibold text-gray-900">
          Create your account
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Set up your business in seconds
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Invite Code */}
          <div>
            <label
              htmlFor="inviteCode"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Invite code
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
                  />
                </svg>
              </div>
              <input
                id="inviteCode"
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                placeholder="e.g. ABCD1234"
                required
                className="w-full rounded-xl border-[1.5px] border-gray-200 bg-white py-3 pl-11 pr-4 font-mono text-sm font-semibold tracking-[0.15em] text-gray-900 outline-none transition-colors placeholder:font-sans placeholder:font-normal placeholder:tracking-normal placeholder:text-gray-400 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20"
              />
            </div>
            <p className="mt-1.5 text-xs text-gray-400">
              Don&apos;t have an invite code?{" "}
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[#2563EB] hover:underline"
              >
                Book a call to get started
              </a>
            </p>
          </div>

          {/* Business Name */}
          <div>
            <label
              htmlFor="businessName"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Business name
            </label>
            <input
              id="businessName"
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="e.g. Sunrise Café"
              required
              className="w-full rounded-xl border-[1.5px] border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20"
            />
          </div>

          {/* Email */}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full rounded-xl border-[1.5px] border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="w-full rounded-xl border-[1.5px] border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20"
            />
            <p className="mt-1 text-xs text-gray-400">
              Must be at least 6 characters
            </p>
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-[#2563EB] to-[#7C3AED] py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        {/* Link to login */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-[#2563EB] hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div />}>
      <SignupForm />
    </Suspense>
  );
}
