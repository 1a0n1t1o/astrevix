"use client";

import { useState, type ReactNode } from "react";
import dynamic from "next/dynamic";

// Lazy-load QualifyFlow + react-calendly only when the user actually opens
// the modal. Keeps ~76KB of react-calendly + the modal JS out of the initial
// landing-page bundle.
const QualifyFlow = dynamic(
  () => import("./QualifyFlow").then((m) => m.QualifyFlow),
  { ssr: false },
);

interface QualifyButtonProps {
  children: ReactNode;
  className?: string;
}

export function QualifyButton({ children, className }: QualifyButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)} className={className}>
        {children}
      </button>
      {open && <QualifyFlow open={open} onClose={() => setOpen(false)} />}
    </>
  );
}
