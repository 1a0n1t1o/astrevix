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
          "linear-gradient(180deg, #6D28D9 0%, #5B21B6 50%, #4C1D95 100%)",
      }}
    >
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Image
              src="/logo-text.png"
              alt="Astrevix"
              width={120}
              height={24}
            />
          </div>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-purple-200 transition-colors hover:text-white"
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
          <p className="text-xs text-purple-300">
            &copy; {new Date().getFullYear()} Astrevix. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
