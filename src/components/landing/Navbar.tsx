"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const CALENDLY_URL = "https://calendly.com/contact-astrevix/new-meeting";

const NAV_LINKS = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "Results", href: "#results" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function smoothScroll(href: string) {
    setMobileOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0F172A]/95 shadow-lg shadow-black/10 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <Image
            src="/logo-text.png"
            alt="Astrevix"
            width={130}
            height={32}
            priority
          />
        </a>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => smoothScroll(link.href)}
              className="text-sm font-medium text-slate-400 transition-colors hover:text-white"
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-4 md:flex">
          <a
            href="/dashboard"
            className="text-sm font-medium text-slate-400 transition-colors hover:text-white"
          >
            Log in
          </a>
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#3B82F6] hover:shadow-lg hover:shadow-blue-500/25"
          >
            Book a Demo
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-white md:hidden"
          aria-label="Toggle menu"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            {mobileOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-slate-800 bg-[#0F172A]/98 backdrop-blur-md md:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => smoothScroll(link.href)}
                  className="rounded-lg px-4 py-3 text-left text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
                >
                  {link.label}
                </button>
              ))}
              <div className="mt-3 flex flex-col gap-2 border-t border-slate-800 pt-4">
                <a
                  href="/dashboard"
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white"
                >
                  Log in
                </a>
                <a
                  href={CALENDLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-[#2563EB] px-4 py-3 text-center text-sm font-semibold text-white transition-all hover:bg-[#3B82F6]"
                >
                  Book a Demo
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
