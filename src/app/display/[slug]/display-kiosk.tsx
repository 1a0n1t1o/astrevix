"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Nfc } from "lucide-react";

/** Parse the reward text to extract the highlight value and determine if trailing text is needed */
function parseReward(raw: string): { prefix: string; highlight: string; suffix: string } {
  const upper = raw.toUpperCase().trim();

  // If reward already contains "YOUR NEXT VISIT" or "NEXT VISIT", strip it and don't re-add
  const trailingPatterns = [/\s+YOUR\s+NEXT\s+VISIT$/i, /\s+NEXT\s+VISIT$/i];
  let cleaned = upper;
  let hasSuffix = true;
  for (const pattern of trailingPatterns) {
    if (pattern.test(cleaned)) {
      cleaned = cleaned.replace(pattern, "");
      hasSuffix = true;
      break;
    }
  }

  // The highlight is the numeric/discount portion, e.g. "10% OFF" or "$5 OFF" or "FREE DRINK"
  return {
    prefix: "GET ",
    highlight: cleaned,
    suffix: hasSuffix ? " YOUR NEXT VISIT" : "",
  };
}

export function DisplayKiosk({
  businessName,
  rewardText,
  submitUrl,
}: Readonly<{
  businessName: string;
  rewardText: string;
  submitUrl: string;
}>) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const reward = parseReward(rewardText);

  useEffect(() => {
    QRCode.toDataURL(submitUrl, {
      width: 280,
      margin: 2,
      color: { dark: "#ffffff", light: "#00000000" },
      errorCorrectionLevel: "M",
    }).then(setQrDataUrl);
  }, [submitUrl]);

  return (
    <div className="kiosk-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap');

        .kiosk-root {
          position: fixed;
          inset: 0;
          background: #0a0a0f;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          font-family: 'Plus Jakarta Sans', sans-serif;
          user-select: none;
          -webkit-user-select: none;
        }

        /* Animated gradient orbs */
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.3;
          pointer-events: none;
        }
        .orb-1 {
          width: 750px;
          height: 750px;
          background: #2563EB;
          top: -15%;
          left: -10%;
          animation: float1 20s ease-in-out infinite;
        }
        .orb-2 {
          width: 650px;
          height: 650px;
          background: #0ea5e9;
          bottom: -10%;
          right: -10%;
          animation: float2 25s ease-in-out infinite;
        }
        .orb-3 {
          width: 520px;
          height: 520px;
          background: #6366f1;
          top: 40%;
          left: 50%;
          transform: translateX(-50%);
          animation: float3 18s ease-in-out infinite;
        }

        @keyframes float1 {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(120px, 90px); }
          66% { transform: translate(-60px, 45px); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(-90px, -60px); }
          66% { transform: translate(60px, -120px); }
        }
        @keyframes float3 {
          0%, 100% { transform: translateX(-50%) translate(0, 0); }
          33% { transform: translateX(-50%) translate(90px, -75px); }
          66% { transform: translateX(-50%) translate(-120px, 60px); }
        }

        /* Grid overlay */
        .grid-overlay {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
        }

        /* Noise texture */
        .noise {
          position: absolute;
          inset: 0;
          opacity: 0.035;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-repeat: repeat;
          background-size: 256px 256px;
          pointer-events: none;
        }

        /* Content */
        .kiosk-content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 2rem;
          max-width: 720px;
          width: 100%;
        }

        .reward-label {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #38bdf8;
          margin-bottom: 1rem;
        }

        .headline {
          font-family: 'Outfit', sans-serif;
          font-weight: 900;
          font-size: clamp(2.2rem, 5vw, 3.5rem);
          line-height: 1.1;
          color: #ffffff;
          letter-spacing: 0.01em;
          margin-bottom: 1rem;
        }
        .headline .reward-value {
          background: linear-gradient(135deg, #38bdf8, #2563EB, #818cf8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .subtext {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(0.9rem, 2vw, 1.15rem);
          color: rgba(255, 255, 255, 0.55);
          max-width: 440px;
          line-height: 1.5;
          margin-bottom: 2.5rem;
        }

        /* Scan section */
        .scan-label {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 0.5rem;
        }

        .bounce-arrows {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
          margin-bottom: 0.75rem;
          animation: bounce 2s ease-in-out infinite;
        }
        .bounce-arrows svg {
          width: 24px;
          height: 16px;
          color: rgba(255, 255, 255, 0.5);
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(8px); }
        }

        .qr-container {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 20px;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .qr-container img {
          display: block;
          width: 200px;
          height: 200px;
        }

        /* Divider */
        .or-divider {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin: 1.5rem 0;
          width: 240px;
        }
        .or-divider .line {
          flex: 1;
          height: 1px;
          background: rgba(255, 255, 255, 0.12);
        }
        .or-divider span {
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          color: rgba(255, 255, 255, 0.35);
        }

        /* NFC section */
        .nfc-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }
        .nfc-icon-wrapper {
          position: relative;
          width: 72px;
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .nfc-ripple {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 1.5px solid rgba(56, 189, 248, 0.2);
          animation: ripple 6s ease-out infinite;
        }
        .nfc-ripple:nth-child(2) {
          animation-delay: 2s;
        }
        .nfc-ripple:nth-child(3) {
          animation-delay: 4s;
        }
        @keyframes ripple {
          0% { transform: scale(0.8); opacity: 0.3; }
          100% { transform: scale(2.2); opacity: 0; }
        }

        .nfc-icon {
          position: relative;
          z-index: 1;
          color: #38bdf8;
        }

        .nfc-label {
          font-size: 0.85rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.6);
        }

        /* Footer */
        .kiosk-footer {
          position: absolute;
          bottom: 2rem;
          left: 0;
          right: 0;
          text-align: center;
          z-index: 1;
        }
        .footer-steps {
          font-size: 0.8rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.35);
          letter-spacing: 0.08em;
          margin-bottom: 0.5rem;
        }
        .footer-brand {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.2);
          letter-spacing: 0.05em;
        }
      `}</style>

      {/* Background effects */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <div className="grid-overlay" />
      <div className="noise" />

      {/* Main content */}
      <div className="kiosk-content">
        <div className="reward-label">YOUR REWARD IS WAITING</div>

        <h1 className="headline">
          {reward.prefix}<span className="reward-value">{reward.highlight}</span>{reward.suffix}
        </h1>

        <p className="subtext">
          Post about your experience on Instagram or TikTok and get rewarded
        </p>

        <div className="scan-label">SCAN TO CLAIM</div>

        <div className="bounce-arrows">
          <svg viewBox="0 0 24 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6,2 12,8 18,2" />
          </svg>
        </div>

        {qrDataUrl && (
          <div className="qr-container">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrDataUrl} alt={`QR code for ${businessName}`} />
          </div>
        )}

        <div className="or-divider">
          <div className="line" />
          <span>OR</span>
          <div className="line" />
        </div>

        <div className="nfc-section">
          <div className="nfc-icon-wrapper">
            <div className="nfc-ripple" />
            <div className="nfc-ripple" />
            <div className="nfc-ripple" />
            <Nfc className="nfc-icon" size={32} strokeWidth={1.5} />
          </div>
          <div className="nfc-label">Tap your phone here</div>
        </div>
      </div>

      {/* Footer */}
      <div className="kiosk-footer">
        <div className="footer-steps">Scan &bull; Post &bull; Get Rewarded</div>
        <div className="footer-brand">Powered by Astrevix</div>
      </div>
    </div>
  );
}
