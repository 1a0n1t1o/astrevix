import Image from "next/image";
import Link from "next/link";

const FOOTER_LINKS = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/#features" },
  { label: "Pricing", href: "/#pricing" },
  { label: "FAQ", href: "/#faq" },
];

const SOCIAL_LINKS = [
  {
    label: "Twitter",
    href: "#",
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "#",
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.48V13a8.15 8.15 0 005.58 2.2V11.8a4.85 4.85 0 01-5.58-2.2V2h3.45a4.83 4.83 0 002.13 4.69z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer
      style={{
        background:
          "linear-gradient(180deg, #FFFFFF 0%, #FAF8FF 50%, #F5F3FF 100%)",
        borderTop: "1px solid rgba(139,92,246,0.1)",
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
                className="text-sm text-gray-500 transition-colors hover:text-gray-900"
              >
                {link.label}
              </Link>
            ))}
            <a
              href="mailto:contact@astrevix.com"
              className="text-sm text-gray-500 transition-colors hover:text-gray-900"
            >
              Contact
            </a>
          </nav>

          {/* Social */}
          <div className="flex items-center gap-4">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="text-gray-400 transition-colors hover:text-gray-600"
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        <div
          className="mt-8 pt-8 text-center"
          style={{ borderTop: "1px solid rgba(139,92,246,0.08)" }}
        >
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Astrevix. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
