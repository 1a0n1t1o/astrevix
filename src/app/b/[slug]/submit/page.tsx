"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  getBusinessBySlug,
  detectPlatform,
  PLATFORM_INFO,
  type Platform,
} from "@/lib/data";

const LINK_EMOJI = "🔗";

function platformEmoji(platform: Platform | null): string {
  if (!platform) return LINK_EMOJI;
  return PLATFORM_INFO[platform].emoji;
}

export default function SubmitPage() {
  const { slug } = useParams<{ slug: string }>();
  const business = getBusinessBySlug(slug);

  const [postLink, setPostLink] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const detectedPlatform = detectPlatform(postLink);
  const isValid =
    postLink.trim() !== "" && name.trim() !== "" && contact.trim() !== "";

  if (!business) return null;

  if (submitted) {
    return (
      <div className="flex flex-col items-center pt-8 text-center">
        {/* Checkmark */}
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-8 w-8 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="mt-4 font-serif text-2xl font-bold">
          You&apos;re all set!
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Your submission is being reviewed
        </p>

        {/* Reward summary */}
        <div className="mt-6 w-full rounded-2xl bg-brand/5 p-5">
          <p className="text-sm text-gray-500">Your reward</p>
          <p className="mt-1 font-serif text-lg font-semibold">
            {business.reward}
          </p>
        </div>

        {/* Platform + truncated link */}
        {detectedPlatform && (
          <div className="mt-4 flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm">
            <span>{PLATFORM_INFO[detectedPlatform].emoji}</span>
            <span className="font-medium">
              {PLATFORM_INFO[detectedPlatform].label}
            </span>
            <span className="max-w-[150px] truncate text-gray-400">
              {postLink}
            </span>
          </div>
        )}

        <a
          href={`/b/${slug}`}
          className="mt-8 block w-full rounded-2xl bg-brand py-4 text-center text-base font-semibold text-white"
        >
          Done
        </a>
      </div>
    );
  }

  return (
    <>
      {/* Back link */}
      <a
        href={`/b/${slug}`}
        className="inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-foreground"
      >
        &larr; Back
      </a>

      {/* Header with business logo + name */}
      <div className="mt-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
          {business.logo}
        </div>
        <div>
          <h1 className="font-serif text-xl font-bold">Submit your post</h1>
          <p className="text-xs text-gray-500">{business.name}</p>
        </div>
      </div>

      {/* Reward reminder banner */}
      <div
        className="mt-5 flex items-center gap-3 rounded-2xl p-4"
        style={{ backgroundColor: `${business.brandColor}0D` }}
      >
        <span className="text-lg">🎁</span>
        <div>
          <p className="text-sm font-semibold text-brand">{business.reward}</p>
          <p className="text-xs text-gray-500">After your post is approved</p>
        </div>
      </div>

      {/* Form */}
      <div className="mt-6 space-y-4">
        {/* Post link */}
        <div>
          <label htmlFor="postLink" className="block text-sm font-medium">
            Post link
          </label>
          <div className="relative mt-1.5">
            <input
              id="postLink"
              type="url"
              value={postLink}
              onChange={(e) => setPostLink(e.target.value)}
              placeholder="https://www.instagram.com/reel/..."
              className="w-full rounded-[14px] border-[1.5px] border-gray-200 bg-white px-4 py-4 pr-12 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-brand"
            />
            {postLink.trim() && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-base">
                {platformEmoji(detectedPlatform)}
              </span>
            )}
          </div>
          <p className="mt-1.5 text-xs text-gray-400">
            We&apos;ll automatically detect which platform you posted on
          </p>
        </div>

        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            First name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your first name"
            className="mt-1.5 w-full rounded-[14px] border-[1.5px] border-gray-200 bg-white px-4 py-4 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-brand"
          />
        </div>

        {/* Email or phone */}
        <div>
          <label htmlFor="contact" className="block text-sm font-medium">
            Email or phone
          </label>
          <input
            id="contact"
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="Where should we send your reward?"
            className="mt-1.5 w-full rounded-[14px] border-[1.5px] border-gray-200 bg-white px-4 py-4 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-brand"
          />
          <p className="mt-1.5 text-xs text-gray-400">
            Only used to send your reward. We never spam.
          </p>
        </div>
      </div>

      {/* Submit button */}
      <button
        disabled={!isValid}
        onClick={() => setSubmitted(true)}
        className="mt-6 w-full rounded-2xl py-4 text-base font-semibold transition-all active:enabled:scale-[0.98]"
        style={
          isValid
            ? {
                backgroundColor: business.brandColor,
                color: "#fff",
                boxShadow: `0 8px 24px ${business.brandColor}66`,
              }
            : {
                backgroundColor: "#E0DDD8",
                color: "#9c9a97",
                cursor: "not-allowed",
              }
        }
      >
        Submit
      </button>

      {/* Trust signals */}
      <div className="mt-4 flex justify-center gap-6 text-xs text-gray-400">
        <span>🔒 Info stays private</span>
        <span>⏱ Usually approved in 24h</span>
      </div>
    </>
  );
}
