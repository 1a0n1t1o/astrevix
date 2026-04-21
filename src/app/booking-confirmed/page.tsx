"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default function BookingConfirmedPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#0A0E27]" />}>
      <BookingConfirmedContent />
    </Suspense>
  );
}

function BookingConfirmedContent() {
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const inviteeUuid = searchParams.get("invitee_uuid");

    if (!inviteeUuid || !UUID_REGEX.test(inviteeUuid)) {
      console.warn(
        "[Pixel] Invalid or missing UUID, not firing Schedule event",
      );
      return;
    }

    const firedKey = `fired_${inviteeUuid}`;
    if (sessionStorage.getItem(firedKey)) {
      console.log("[Pixel] Already fired for this UUID");
      return;
    }

    const fireEvent = (attempts = 0) => {
      if (typeof window === "undefined") return;

      if (typeof window.fbq === "function") {
        try {
          window.fbq("track", "Schedule", {
            value: 97,
            currency: "USD",
          });
          sessionStorage.setItem(firedKey, "true");
          console.log("[Pixel] Schedule event fired for UUID:", inviteeUuid);
        } catch (err) {
          console.error("[Pixel] Error firing Schedule event:", err);
        }
      } else if (attempts < 20) {
        setTimeout(() => fireEvent(attempts + 1), 250);
      } else {
        console.error("[Pixel] fbq never became available");
      }
    };

    fireEvent();
  }, [searchParams]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0A0E27] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-[#2563EB] opacity-20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[24rem] w-[24rem] rounded-full bg-[#2563EB] opacity-10 blur-3xl" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-16">
        <div
          className={`w-full max-w-xl rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl transition-all duration-700 sm:p-12 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-[#2563EB]/20 p-4">
              <CheckCircle2
                className="h-14 w-14 text-[#2563EB]"
                strokeWidth={1.75}
              />
            </div>
          </div>

          <h1 className="text-center text-4xl font-semibold tracking-tight sm:text-5xl">
            You&apos;re all set.
          </h1>
          <p className="mt-4 text-center text-base leading-relaxed text-white/70 sm:text-lg">
            We just sent a calendar invite to your email. Check your inbox —
            and spam folder just in case.
          </p>

          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-7">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white/60">
              What happens next
            </h2>
            <ol className="mt-5 space-y-4">
              {[
                "You'll get a calendar invite with the Zoom link",
                "We'll walk through exactly how Astrevix will work for your shop",
                "If it's a fit, we'll get you set up with a 3-week free trial that day",
              ].map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-sm font-semibold text-white">
                    {i + 1}
                  </span>
                  <span className="pt-0.5 text-white/85">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <p className="mt-8 text-center text-sm text-white/50">
            Questions? Email{" "}
            <a
              href="mailto:contact@astrevix.com"
              className="text-[#2563EB] hover:underline"
            >
              contact@astrevix.com
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
