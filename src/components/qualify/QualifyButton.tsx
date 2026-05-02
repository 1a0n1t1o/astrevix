"use client";

import { useState, type ReactNode } from "react";
import { QualifyFlow } from "./QualifyFlow";

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
      <QualifyFlow open={open} onClose={() => setOpen(false)} />
    </>
  );
}
