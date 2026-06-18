import { Star } from "lucide-react";
import { REVIEWS } from "@/lib/reviews";

export default function Testimonial() {
  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-14 md:py-[120px]">
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="reveal reveal-up-sm mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#2563EB]">
            Real results
          </p>
          <h2 className="reveal reveal-up-sm reveal-d1 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Built and tested by local businesses.
          </h2>
          <p className="reveal reveal-up-sm reveal-d2 mt-4 text-lg text-gray-600">
            Real owners across Orange County, from nail techs to car-wrap shops
            to café pop-ups. Same system, same results.
          </p>
        </div>

        {/* Review wall — masonry so varying-length quotes flow without gaps */}
        <div className="mt-16 gap-6 md:columns-2 lg:columns-3">
          {REVIEWS.map((review, i) => (
            <figure
              key={review.name}
              className={`reveal reveal-up reveal-d${Math.min(i + 1, 5)} mb-6 break-inside-avoid rounded-2xl border border-gray-100 bg-white p-6 shadow-sm shadow-blue-500/5`}
            >
              <div className="flex items-center gap-0.5">
                {[0, 1, 2, 3, 4].map((s) => (
                  <Star
                    key={s}
                    className="h-4 w-4 fill-[#FBBF24] text-[#FBBF24]"
                    strokeWidth={0}
                  />
                ))}
              </div>
              <blockquote className="mt-4 text-[15px] leading-relaxed text-gray-700">
                {`“${review.quote}”`}
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-sm font-bold text-white">
                  {review.name[0]}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">
                    {review.name}
                  </div>
                  <div className="text-xs text-gray-500">{review.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
