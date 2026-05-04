"use client";

import { motion } from "framer-motion";

export default function Problem() {
  return (
    <section className="bg-[#FAFAFA] py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px 200px 0px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7C3AED]">
            The truth about local marketing
          </p>
          <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
            Your customers love you. They just don&apos;t post about you.
          </h2>
          <div className="mt-6 space-y-5 text-base leading-relaxed text-gray-600 md:text-lg">
            <p>
              They tip well. They come back. They tell their friends. But
              they never tag you on Instagram.
            </p>
            <p>
              And the few who do? They post stories that disappear in 24
              hours. They forget to tag your handle. The post fades into the
              void.
            </p>
            <p>
              Meanwhile, the shop down the street is getting tagged 50+ times
              a month. They didn&apos;t get lucky. They built a system.
            </p>
          </div>
          <p className="mt-8 text-lg font-semibold text-gray-900 md:text-xl">
            That system is Astrevix.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
