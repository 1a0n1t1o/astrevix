# CLAUDE.md

## Project Overview

**Astrevix** is a QR code/NFC-powered SaaS platform that helps local businesses (restaurants, cafes, barbershops, gyms, spas) turn real customers into content creators by incentivizing them with rewards. Customers scan a QR code, see the business's branded landing page, post content on TikTok/Instagram, submit their post link, and receive a reward.

## User Types

- **Business Owners**: Sign up, customize branded landing page (Stan Store-style), create campaigns, review submissions, issue rewards
- **Customers**: No account needed. Scan QR code → see landing page → post content → submit link via 3-field form (post link with auto-platform-detection, name, email/phone) → receive reward

## MVP Priority

1. Customer landing page at `/b/[slug]`
2. Submission form at `/b/[slug]/submit`

## Commands

- `npm run dev` — Start dev server (localhost:3000)
- `npm run build` — Production build
- `npm run start` — Start production server
- `npm run lint` — Run ESLint

## Tech Stack

- **Framework**: Next.js 16 (App Router, `src/app/`)
- **Language**: TypeScript 5 (strict mode)
- **Styling**: Tailwind CSS 4 via PostCSS (`@tailwindcss/postcss`)
- **Auth/Database/Storage**: Supabase
- **Payments**: Stripe (subscriptions)
- **Deployment**: Vercel
- **Linting**: ESLint 9 (flat config) with `next/core-web-vitals` and `next/typescript`

## Project Structure

```
src/
  app/
    layout.tsx              # Root layout (fonts, metadata)
    page.tsx                # Marketing home page
    globals.css             # Tailwind imports, CSS variables
    b/[slug]/               # Customer-facing (MVP)
      page.tsx              # Business landing page
      submit/page.tsx       # Submission form
  lib/                      # Shared utilities
    supabase/               # Supabase client helpers
  components/               # Reusable UI components
  types/                    # Shared TypeScript types
public/                     # Static assets
```

## Design System

- **Background**: Warm off-white `#FEFCFA`
- **Headings font**: Fraunces (serif, via `next/font/google`)
- **Body font**: DM Sans (sans-serif, via `next/font/google`)
- **Accent color**: Business's own brand color (dynamic per business)
- **Approach**: Mobile-first, rounded corners (`rounded-2xl`, `rounded-xl`), clean and inviting
- **No dark mode** — single warm light theme

## Code Conventions

- **App Router**: Server Components by default; add `"use client"` only when needed
- **Path alias**: `@/*` maps to `./src/*`
- **TypeScript**: Strict mode, `Readonly<>` for component props, `React.ReactNode` for children
- **Styling**: Tailwind utility classes; use CSS custom properties for dynamic brand colors
- **Data fetching**: Server Components fetch from Supabase directly; client components use Supabase client
- **No customer auth**: Submission flow is anonymous (name + email/phone + post link)
