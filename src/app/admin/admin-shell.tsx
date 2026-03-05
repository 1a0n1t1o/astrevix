"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Users, BarChart3, Settings, Ticket } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface AdminShellProps {
  readonly userEmail: string;
  readonly userName: string;
  readonly children: React.ReactNode;
}

const ADMIN_NAV_ITEMS = [
  {
    href: "/admin",
    label: "Owners",
    icon: <Users className="h-5 w-5" />,
    exact: true,
  },
  {
    href: "/admin/invite-codes",
    label: "Invite Codes",
    icon: <Ticket className="h-5 w-5" />,
  },
  {
    href: "/admin/analytics",
    label: "Analytics",
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    href: "/admin/settings",
    label: "Settings",
    icon: <Settings className="h-5 w-5" />,
  },
];

export default function AdminShell({
  userEmail,
  userName,
  children,
}: AdminShellProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

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
      {/* Logo + Admin badge */}
      <div className="flex items-center gap-2.5 px-5 pb-2 pt-4">
        <Image
          src="/logo-text.png"
          alt="Astrevix"
          width={120}
          height={24}
          style={{ filter: "brightness(0)" }}
        />
        <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-600 ring-1 ring-inset ring-red-500/20">
          Admin
        </span>
      </div>

      {/* Nav */}
      <nav className="space-y-1 px-3">
        {ADMIN_NAV_ITEMS.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "text-[#2563EB]"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {active && (
                <motion.div
                  layoutId="admin-sidebar-active-indicator"
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background:
                      "linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)",
                    zIndex: -1,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 350,
                    damping: 30,
                  }}
                />
              )}
              {active && (
                <motion.div
                  layoutId="admin-sidebar-active-bar"
                  className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-[#2563EB]"
                  transition={{
                    type: "spring",
                    stiffness: 350,
                    damping: 30,
                  }}
                />
              )}
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom section */}
      <div className="border-t border-gray-100 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2563EB] text-sm font-semibold text-white">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-gray-900">
              {userName}
            </p>
            <p className="truncate text-xs text-gray-500">{userEmail}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="mt-3 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
            />
          </svg>
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(135deg, #f0f4ff 0%, #fafbfc 40%, #f5f3ff 100%)",
      }}
    >
      {/* Mobile backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-gray-100/80 transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background: "linear-gradient(180deg, #ffffff 0%, #f8faff 100%)",
        }}
      >
        {sidebar}
      </aside>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Mobile top bar */}
        <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-gray-100 bg-white/80 px-4 py-3 backdrop-blur-md lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-50"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
          <Image
            src="/logo-text.png"
            alt="Astrevix"
            width={110}
            height={22}
            style={{ filter: "brightness(0)" }}
          />
          <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-600 ring-1 ring-inset ring-red-500/20">
            Admin
          </span>
        </div>

        {/* Page content */}
        <main className="p-6 lg:p-8">
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
