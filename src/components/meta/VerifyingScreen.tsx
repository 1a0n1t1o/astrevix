"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Loader2 } from "lucide-react";

const MESSAGES = [
  "Reviewing your answers…",
  "Checking who's available to walk you through it…",
  "Confirming we can help…",
];

interface VerifyingScreenProps {
  onDone: () => void;
}

export default function VerifyingScreen({ onDone }: VerifyingScreenProps) {
  const [msgIndex, setMsgIndex] = useState(0);
  const onDoneRef = useRef(onDone);
  const reduce = useReducedMotion() ?? false;

  // Keep the ref pointed at the latest callback (updated in an effect, never
  // during render).
  useEffect(() => {
    onDoneRef.current = onDone;
  });

  useEffect(() => {
    const interval = window.setInterval(() => {
      setMsgIndex((i) => Math.min(i + 1, MESSAGES.length - 1));
    }, 1100);
    const timeout = window.setTimeout(() => onDoneRef.current(), 3500);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 -z-10 rounded-full bg-[#2563EB] opacity-20 blur-2xl" />
        <Loader2
          className="h-14 w-14 animate-spin text-[#2563EB]"
          strokeWidth={2.25}
        />
      </div>

      <div className="flex h-16 items-center">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={msgIndex}
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="px-4 text-[18px] font-medium leading-snug text-slate-600"
          >
            {MESSAGES[msgIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
