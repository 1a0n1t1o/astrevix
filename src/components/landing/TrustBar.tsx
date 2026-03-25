import {
  UtensilsCrossed,
  Scissors,
  Coffee,
  Dumbbell,
  ShoppingBag,
  Sparkles,
  Cake,
  Dog,
  Paintbrush,
  Car,
  Wine,
  SprayCan,
} from "lucide-react";

const BUSINESS_TYPES = [
  { icon: UtensilsCrossed, label: "Restaurants" },
  { icon: Scissors, label: "Salons" },
  { icon: Coffee, label: "Cafes" },
  { icon: Dumbbell, label: "Gyms" },
  { icon: ShoppingBag, label: "Boutiques" },
  { icon: Sparkles, label: "Spas" },
  { icon: Cake, label: "Bakeries" },
  { icon: Dog, label: "Pet Shops" },
  { icon: Paintbrush, label: "Nail Studios" },
  { icon: Car, label: "Auto Detailing" },
  { icon: SprayCan, label: "Body Shops" },
  { icon: Wine, label: "Bars & Lounges" },
];

export default function TrustBar() {
  const tripled = [...BUSINESS_TYPES, ...BUSINESS_TYPES, ...BUSINESS_TYPES];

  return (
    <section
      className="relative overflow-hidden py-12"
      style={{
        background: "linear-gradient(180deg, #FFFFFF 0%, #F8F7FF 50%, #FFFFFF 100%)",
        borderTop: "1px solid rgba(139,92,246,0.1)",
        borderBottom: "1px solid rgba(139,92,246,0.1)",
      }}
    >
      <div className="mx-auto max-w-7xl px-6 text-center">
        <p className="text-sm font-medium text-gray-500">
          Helping local businesses grow through authentic content
        </p>
      </div>

      <div className="relative mt-8">
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24" style={{ background: "linear-gradient(to right, #F8F7FF 0%, transparent 100%)" }} />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24" style={{ background: "linear-gradient(to left, #F8F7FF 0%, transparent 100%)" }} />
        <div className="flex w-max items-center gap-8" style={{ animation: "marquee-scroll 40s linear infinite" }}>
          {tripled.map((biz, i) => {
            const Icon = biz.icon;
            return (
              <div key={`${biz.label}-${i}`} className="flex shrink-0 items-center gap-2.5 rounded-full border border-purple-100/50 bg-white/60 px-5 py-2.5 backdrop-blur-sm transition-colors hover:bg-white hover:border-purple-200">
                <Icon className="h-[18px] w-[18px] text-purple-400" strokeWidth={1.5} />
                <span className="whitespace-nowrap text-sm font-medium text-gray-500">{biz.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
