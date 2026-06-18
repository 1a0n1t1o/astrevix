import Image from "next/image";
import Link from "next/link";

const FOOTER_LINKS = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/#features" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "FAQ", href: "/#faq" },
];

export default function Footer() {
  return (
    <footer
      style={{
        background:
          "linear-gradient(180deg, #1E40AF 0%, #1E3A8A 50%, #172554 100%)",
      }}
    >
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          {/* Logo */}
          <div className="flex flex-col items-center gap-0 md:items-start">
            <Image
              src="/logo-text.png"
              alt="Astrevix"
              width={120}
              height={24}
            />
            <p className="mt-2 text-xs font-medium text-white/80">
              Made in Southern California
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-blue-200 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Empty spacer for layout balance */}
          <div className="hidden w-[120px] md:block" />
        </div>

        <div
          className="mt-8 pt-8 text-center"
          style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
        >
          <div className="flex justify-center gap-4 mb-4">
            <Link
              href="/privacy"
              className="text-xs text-blue-300 transition-colors hover:text-white"
            >
              Privacy Policy
            </Link>
            <span className="text-xs text-blue-300/50">&middot;</span>
            <Link
              href="/terms"
              className="text-xs text-blue-300 transition-colors hover:text-white"
            >
              Terms &amp; Conditions
            </Link>
          </div>
          <p className="text-xs text-blue-300">
            &copy; {new Date().getFullYear()} Astrevix. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
