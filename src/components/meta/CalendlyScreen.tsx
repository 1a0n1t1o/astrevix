"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";
import { metaPixel } from "@/lib/meta/tracking";

const CALENDLY_URL = "https://calendly.com/contact-astrevix/new-meeting";

interface CalendlyScreenProps {
  name: string;
  email: string;
}

export default function CalendlyScreen({ name, email }: CalendlyScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  // Init the inline widget once the official script is available.
  useEffect(() => {
    let cancelled = false;

    function tryInit(attempts = 0) {
      if (cancelled || initializedRef.current) return;
      const el = containerRef.current;
      if (window.Calendly && el) {
        window.Calendly.initInlineWidget({
          url: `${CALENDLY_URL}?hide_gdpr_banner=1`,
          parentElement: el,
          prefill: { name, email },
        });
        initializedRef.current = true;
        return;
      }
      if (attempts < 40) {
        window.setTimeout(() => tryInit(attempts + 1), 150);
      }
    }

    tryInit();
    return () => {
      cancelled = true;
    };
  }, [name, email]);

  // The script-based widget emits postMessage booking events. Fire Schedule
  // (the primary conversion) when the user completes a booking.
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.origin !== "https://calendly.com") return;
      const data = e.data as { event?: unknown } | null;
      if (
        data &&
        typeof data === "object" &&
        data.event === "calendly.event_scheduled"
      ) {
        metaPixel.schedule();
      }
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <div className="flex flex-1 flex-col py-6">
      <Script
        id="calendly-widget-script"
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="afterInteractive"
      />

      <p className="mb-4 text-center text-[16px] leading-relaxed text-slate-600">
        Pick any time that works. We&apos;ll send you the meeting link.
      </p>

      <div
        ref={containerRef}
        className="min-h-[720px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_24px_-12px_rgba(15,23,42,0.1)]"
      />
    </div>
  );
}
