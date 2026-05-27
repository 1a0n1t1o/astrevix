// Stage-1 (browser-side) Meta Pixel helpers for the /meta funnel.
// The pixel itself is installed site-wide in app/layout.tsx (lazyOnload), so
// fbq may not exist yet when an early event (e.g. ViewContent on hero mount)
// fires. Every call is guarded to no-op if fbq never appears; for early events
// we also briefly retry until it loads — same approach as /booking-confirmed.

type Fbq = Window["fbq"];

function withFbq(run: (fbq: Fbq) => void, attempts = 0): void {
  if (typeof window === "undefined") return;

  if (typeof window.fbq === "function") {
    try {
      run(window.fbq);
    } catch (err) {
      console.error("[MetaPixel] event failed:", err);
    }
    return;
  }

  // Not ready yet — retry for ~5s, then give up (no-op).
  if (attempts < 20) {
    window.setTimeout(() => withFbq(run, attempts + 1), 250);
  }
}

export const metaPixel = {
  viewContent() {
    withFbq((fbq) => fbq("track", "ViewContent"));
  },
  quizStart() {
    withFbq((fbq) => fbq("trackCustom", "QuizStart"));
  },
  quizStep(stepNumber: number) {
    withFbq((fbq) => fbq("trackCustom", "QuizStep", { step_number: stepNumber }));
  },
  lead() {
    withFbq((fbq) => fbq("track", "Lead"));
  },
  schedule() {
    withFbq((fbq) => fbq("track", "Schedule"));
  },
};

const ATTRIBUTION_KEY = "astrevix_meta_attribution";

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
}

// Capture the Meta click identifiers on page load so a later server-side
// Conversions API mirror (separate stage) can dedupe/attribute. This is the
// ONLY permitted localStorage write in the funnel.
export function captureMetaAttribution(): void {
  if (typeof window === "undefined") return;

  try {
    const fbclid = new URLSearchParams(window.location.search).get("fbclid");
    const payload = {
      fbclid: fbclid ?? null,
      fbp: readCookie("_fbp"),
      fbc: readCookie("_fbc"),
      landingUrl: window.location.href,
      capturedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(payload));
  } catch (err) {
    console.error("[MetaPixel] attribution capture failed:", err);
  }
}
