import Image from "next/image";

const CALENDLY_URL = "https://calendly.com/contact-astrevix/new-meeting";

const NAV_LINKS = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "Results", href: "#results" },
  { label: "FAQ", href: "#faq" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-[#0B1120] py-12">
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          {/* Logo */}
          <a href="/">
            <Image
              src="/logo-text.png"
              alt="Astrevix"
              width={120}
              height={30}
            />
          </a>

          {/* Nav links */}
          <div className="flex flex-wrap items-center justify-center gap-6">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-slate-500 transition-colors hover:text-slate-300"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#3B82F6]"
          >
            Book a Demo
          </a>
        </div>

        {/* Bottom row */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-800/50 pt-8 sm:flex-row">
          <p className="text-xs text-slate-600">
            &copy; {new Date().getFullYear()} Astrevix. All rights reserved.
          </p>
          <div className="flex gap-5">
            {LEGAL_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-xs text-slate-600 transition-colors hover:text-slate-400"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
