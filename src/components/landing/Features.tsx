import { QrCode, Gift, CheckCircle2, Palette } from "lucide-react";

const FEATURES = [
  {
    icon: QrCode,
    title: "QR Code + NFC Tap Stand",
    description:
      "Customers scan from their phone or tap your counter stand. We ship the physical NFC stand to you for free.",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    icon: Gift,
    title: "Choose Any Reward",
    description:
      "Free service, % off, BOGO, store credit — whatever you want. Customers see it before they post, so they're motivated.",
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    icon: CheckCircle2,
    title: "One-Click Approval",
    description:
      "We show you every submitted post. You approve the ones you like in one tap. Bad posts never become rewards.",
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    icon: Palette,
    title: "Your Brand, Your Page",
    description:
      "Custom colors, your logo, your photos. Looks like part of your business, not a third-party tool.",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="relative py-20 md:py-28"
      style={{
        background:
          "linear-gradient(180deg, #FFFFFF 0%, #F8F7FF 30%, #F3F1FE 50%, #F8F7FF 70%, #FFFFFF 100%)",
      }}
    >
      {/* Background accents */}
      <div className="gpu-layer pointer-events-none absolute inset-0">
        <div
          className="absolute right-0 top-0 h-[500px] w-[500px] -translate-y-1/4 translate-x-1/4 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute -left-20 bottom-0 h-[400px] w-[400px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="reveal reveal-up-sm mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#7C3AED]">
            What&apos;s included
          </p>
          <h2 className="reveal reveal-up-sm reveal-d1 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need. Nothing you don&apos;t.
          </h2>
          <p className="reveal reveal-up-sm reveal-d2 mt-4 text-lg text-gray-600">
            Built specifically for local service businesses. No fluff, no
            features you&apos;ll never use.
          </p>
        </div>

        {/* Feature grid */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={`reveal reveal-up reveal-d${i + 1} group feature-card rounded-2xl border border-gray-100 bg-white p-8`}
              >
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${feature.iconBg}`}
                >
                  <Icon
                    className={`h-6 w-6 feature-card-icon ${feature.iconColor}`}
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
