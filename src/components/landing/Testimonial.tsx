import { Star } from "lucide-react";

const STATS = [
  { value: "30%+", label: "Customer participation rate" },
  { value: "Under 2 min", label: "To set up your first page" },
  { value: "100%", label: "Automated reward delivery" },
];

export default function Testimonial() {
  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-20 md:py-[120px]">
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="reveal reveal-up-sm mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#7C3AED]">
            Real results
          </p>
          <h2 className="reveal reveal-up-sm reveal-d1 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Built and tested by real local businesses.
          </h2>
          <p className="reveal reveal-up-sm reveal-d2 mt-4 text-lg text-gray-600">
            Used by service businesses across Orange County. From auto
            detailers to nail salons — same system, same results.
          </p>
        </div>

        {/* Featured testimonial card */}
        <div className="reveal reveal-up reveal-d3 mx-auto mt-16 max-w-[800px] rounded-3xl border border-gray-100 bg-white p-8 shadow-xl shadow-purple-500/10 md:p-12">
          {/* Stars */}
          <div className="flex items-center gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star
                key={i}
                className="h-5 w-5 fill-[#FBBF24] text-[#FBBF24]"
                strokeWidth={0}
              />
            ))}
          </div>

          {/* Quote */}
          <blockquote className="mt-6 text-xl italic leading-relaxed text-gray-800 md:text-2xl">
            &ldquo;We were paying $400/month boosting Instagram posts and
            getting nothing. First month with Astrevix, we got 38 customer
            posts and 6 new bookings from people who saw their friends tag us.
            It just works.&rdquo;
          </blockquote>

          {/* Attribution — business only, no personal name */}
          <div className="mt-8 flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-lg font-bold text-white">
              JM
            </div>
            <div>
              <p className="text-base font-semibold text-gray-900">
                John&apos;s Mobile Detailing
              </p>
              <p className="text-sm text-gray-500">
                Mobile Auto Detailing • Orange County, CA
              </p>
            </div>
          </div>
        </div>

        {/* 3-stat row */}
        <div className="mx-auto mt-20 grid max-w-[800px] grid-cols-1 gap-8 sm:grid-cols-3">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className={`reveal reveal-up-sm reveal-d${i + 4} text-center`}
            >
              <p className="bg-gradient-to-r from-[#2563EB] to-[#7C3AED] bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
