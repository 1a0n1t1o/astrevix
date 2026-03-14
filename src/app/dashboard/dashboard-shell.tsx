"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useTheme } from "@/components/theme-provider";
import type { Business } from "@/types/database";

interface DashboardShellProps {
  readonly business: Business;
  readonly userEmail: string;
  readonly userMetadata?: {
    first_name: string;
    last_name: string;
    avatar_url: string | null;
  };
  readonly children: React.ReactNode;
}

const NAV_ITEMS = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
    exact: true,
  },
  {
    href: "/dashboard/submissions",
    label: "Submissions",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z" />
      </svg>
    ),
  },
  {
    href: "/dashboard/customers",
    label: "Customers",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
  },
  {
    href: "/dashboard/sms",
    label: "SMS",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
      </svg>
    ),
  },
  {
    href: "/dashboard/customize",
    label: "Customize",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z" />
      </svg>
    ),
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export default function DashboardShell({
  business,
  userEmail,
  userMetadata,
  children,
}: DashboardShellProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="px-5 pb-2 pt-4">
        <Image
          src="/logo-text.png"
          alt="Astrevix"
          width={130}
          height={26}
          style={{ filter: "var(--dash-logo-filter)" }}
        />
      </div>

      {/* Nav */}
      <nav className="space-y-1 px-3">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={true}
              onClick={() => setSidebarOpen(false)}
              onMouseEnter={() => router.prefetch(item.href)}
              onTouchStart={() => router.prefetch(item.href)}
              className="relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors"
              style={
                active
                  ? { color: "var(--dash-blue)" }
                  : { color: "var(--dash-text-secondary)" }
              }
            >
              {active && (
                <motion.div
                  layoutId="sidebar-active-indicator"
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background: "var(--dash-active-gradient)",
                    zIndex: -1,
                  }}
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              {active && (
                <motion.div
                  layoutId="sidebar-active-bar"
                  className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full"
                  style={{ backgroundColor: "var(--dash-blue)" }}
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* View Storefront link */}
      <div className="px-3 pt-4">
        <a
          href={`/b/${business.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors"
          style={{
            borderColor: "var(--dash-storefront-border)",
            backgroundColor: "var(--dash-storefront-bg)",
            color: "var(--dash-text-secondary)",
          }}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
          View Storefront
        </a>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom section */}
      <div className="border-t px-4 py-4" style={{ borderColor: "var(--dash-border)" }}>
        {/* Dark mode toggle */}
        <button
          onClick={toggleTheme}
          className="mb-3 flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors"
          style={{ color: "var(--dash-text-secondary)" }}
        >
          {theme === "light" ? (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
            </svg>
          ) : (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
            </svg>
          )}
          {theme === "light" ? "Dark mode" : "Light mode"}
          <div className="ml-auto">
            <div
              className="relative h-5 w-9 rounded-full transition-colors"
              style={{ backgroundColor: theme === "dark" ? "var(--dash-blue)" : "#d1d5db" }}
            >
              <div
                className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform"
                style={{ left: theme === "dark" ? "18px" : "2px" }}
              />
            </div>
          </div>
        </button>

        <div className="flex items-center gap-3">
          {userMetadata?.avatar_url ? (
            <img
              src={userMetadata.avatar_url}
              alt="Avatar"
              className="h-9 w-9 rounded-full object-cover"
            />
          ) : (
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white"
              style={{ backgroundColor: business.brand_color || "#2563EB" }}
            >
              {(userMetadata?.first_name || business.name)?.charAt(0)?.toUpperCase() || "B"}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium" style={{ color: "var(--dash-text)" }}>
              {userMetadata?.first_name && userMetadata?.last_name
                ? `${userMetadata.first_name} ${userMetadata.last_name}`
                : business.name}
            </p>
            <p className="truncate text-xs" style={{ color: "var(--dash-text-secondary)" }}>{userEmail}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="mt-3 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors"
          style={{ color: "var(--dash-text-secondary)" }}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
          </svg>
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--dash-gradient-main)" }}
    >
      {/* Mobile backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar - desktop: fixed, mobile: overlay */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ background: "var(--dash-sidebar-gradient)", borderColor: "var(--dash-border)" }}
      >
        {sidebar}
      </aside>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Mobile top bar */}
        <div
          className="sticky top-0 z-30 flex items-center gap-3 border-b px-4 py-3 backdrop-blur-md lg:hidden"
          style={{ borderColor: "var(--dash-border)", backgroundColor: "var(--dash-topbar-bg)" }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2"
            style={{ color: "var(--dash-text-secondary)" }}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <Image
            src="/logo-text.png"
            alt="Astrevix"
            width={120}
            height={24}
            style={{ filter: "var(--dash-logo-filter)" }}
          />
        </div>

        {/* Page content */}
        <main className="p-6 lg:p-8">
          {/* Suspended account banner */}
          {business.status === "suspended" && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4">
              <div className="flex items-center gap-3">
                <svg className="h-5 w-5 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-red-800">Account Suspended</p>
                  <p className="mt-0.5 text-xs text-red-600">
                    Your business page has been suspended. Contact{" "}
                    <a href="mailto:contact@astrevix.com" className="underline">contact@astrevix.com</a>{" "}
                    for assistance.
                  </p>
                </div>
              </div>
            </div>
          )}
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
