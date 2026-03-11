import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Scan to Get Rewarded",
  description: "Scan the QR code or tap your phone to claim your reward",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function DisplayLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      style={{ backgroundColor: "#0a0a0f" }}
      className="min-h-dvh overflow-hidden"
    >
      {children}
    </div>
  );
}
