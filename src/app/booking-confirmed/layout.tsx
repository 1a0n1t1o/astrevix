import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "You're booked — Astrevix",
  description: "Your Astrevix demo is confirmed. Check your inbox for details.",
  robots: { index: false, follow: false },
};

export default function BookingConfirmedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
