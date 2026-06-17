import Image from "next/image";
import Link from "next/link";

/**
 * Slim legal footer for the /meta ad landing page — privacy/terms links +
 * copyright only, so Meta/Google can find an accessible privacy policy while
 * the page stays focused (no Home/Features/FAQ site nav).
 *
 * Server Component on purpose: just <Link> navigation and a static <Image>, so
 * there is no reason to ship client JS. Rendered at the page level (a Server
 * Component) rather than inside the client MetaFunnel tree.
 *
 * `bg-[#FEFCFA]` matches the document <body> background, so the band reads as a
 * seamless continuation of the page. The extra bottom padding keeps the legal
 * links clear of the hero's fixed StickyStartBar (~80px) at max scroll.
 */
export default function MetaFooter() {
  return (
    <footer className="border-t border-slate-200/70 bg-[#FEFCFA]">
      <div className="mx-auto flex max-w-[520px] flex-col items-center gap-5 px-5 pb-28 pt-10 text-center">
        <Image
          src="/logo-text-black.png"
          alt="Astrevix"
          width={110}
          height={22}
        />

        <nav className="flex items-center gap-3 text-sm font-medium">
          <Link
            href="/privacy"
            className="text-slate-500 transition-colors hover:text-slate-900"
          >
            Privacy Policy
          </Link>
          <span aria-hidden="true" className="text-slate-300">
            &middot;
          </span>
          <Link
            href="/terms"
            className="text-slate-500 transition-colors hover:text-slate-900"
          >
            Terms &amp; Conditions
          </Link>
        </nav>

        <p className="text-xs font-medium text-slate-400">
          &copy; 2026 Astrevix. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
