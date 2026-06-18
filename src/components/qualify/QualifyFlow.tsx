"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ArrowRight,
  ArrowLeft,
  Check,
  Hand,
  Scissors,
  Car,
  Sparkles,
  Store,
  Camera,
  MessageSquare,
  Footprints,
  TrendingDown,
  type LucideIcon,
} from "lucide-react";
import { InlineWidget } from "react-calendly";

interface QualifyOption {
  label: string;
  icon: LucideIcon;
}

interface QualifyStep {
  id: string;
  question: string;
  options: QualifyOption[];
}

const STEPS: QualifyStep[] = [
  {
    id: "business",
    question: "What best describes your business?",
    options: [
      { label: "Nail Salon", icon: Hand },
      { label: "Barbershop / Hair Salon", icon: Scissors },
      { label: "Auto Detailing / Tint / Wrap", icon: Car },
      { label: "Lash Studio / Med Spa / Tattoo", icon: Sparkles },
      { label: "Other Local Business", icon: Store },
    ],
  },
  {
    id: "challenge",
    question: "What's your biggest challenge right now?",
    options: [
      { label: "Not enough customer content or reviews", icon: Camera },
      { label: "Customers don't post about us", icon: MessageSquare },
      { label: "Low foot traffic / need more visibility", icon: Footprints },
      { label: "Tried marketing, nothing's working", icon: TrendingDown },
    ],
  },
];

interface QualifyFlowProps {
  open: boolean;
  onClose: () => void;
}

export function QualifyFlow({ open, onClose }: QualifyFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [contact, setContact] = useState({ name: "", email: "", phone: "" });
  const [submitted, setSubmitted] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Render the modal into <body> via a portal so it escapes the hero's
  // stacking context — the hero phone and its floating badges were painting
  // on top of the modal otherwise.
  useEffect(() => setMounted(true), []);

  const isContactStep = currentStep === STEPS.length;

  function handleSelectAnswer(stepId: string, value: string) {
    setAnswers((prev) => ({ ...prev, [stepId]: value }));
    setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
    }, 250);
  }

  function handleSubmitContact(e: React.FormEvent) {
    e.preventDefault();
    if (!contact.name || !contact.email || !contact.phone) return;

    fetch("/api/qualify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...answers, ...contact }),
    }).catch((err) => console.error("Qualify submit error:", err));

    if (typeof window !== "undefined" && (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq) {
      (window as unknown as { fbq: (...args: unknown[]) => void }).fbq(
        "track",
        "Lead",
        {
          content_name: "Qualified Lead",
          value: 97,
          currency: "USD",
        },
      );
    }

    setSubmitted(true);
  }

  function handleClose() {
    onClose();
    setTimeout(() => {
      setCurrentStep(0);
      setAnswers({});
      setContact({ name: "", email: "", phone: "" });
      setSubmitted(false);
    }, 300);
  }

  function handleBack() {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  }

  const totalSteps = STEPS.length + 1;
  const progress = submitted
    ? 100
    : ((currentStep + 1) / (totalSteps + 1)) * 100;

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full overflow-hidden rounded-2xl bg-white shadow-2xl transition-[max-width] duration-500 ease-out ${
              submitted ? "max-w-5xl" : "max-w-2xl"
            }`}
          >
            {/* Progress bar */}
            <div className="h-1.5 bg-gray-100">
              <motion.div
                className="h-full bg-[#2563EB]"
                initial={false}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>

            {/* Header */}
            <div className="flex items-center justify-end px-6 py-3">
              <button
                onClick={handleClose}
                className="rounded-full p-1 transition-colors hover:bg-gray-100"
                aria-label="Close"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Body */}
            <div className="min-h-[400px] p-6 sm:p-8">
              <AnimatePresence mode="wait">
                {!isContactStep && !submitted && (
                  <motion.div
                    key={`step-${currentStep}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                        {STEPS[currentStep].question}
                      </h2>
                    </div>
                    <div className="space-y-3">
                      {STEPS[currentStep].options.map((option) => {
                        const isSelected =
                          answers[STEPS[currentStep].id] === option.label;
                        const Icon = option.icon;
                        return (
                          <motion.button
                            key={option.label}
                            onClick={() =>
                              handleSelectAnswer(
                                STEPS[currentStep].id,
                                option.label,
                              )
                            }
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className={`w-full rounded-xl border-2 px-5 py-4 text-left transition-all ${
                              isSelected
                                ? "border-[#2563EB] bg-blue-50 shadow-md"
                                : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100/50"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span
                                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isSelected ? "bg-[#2563EB] text-white" : "bg-blue-50 text-[#2563EB]"}`}
                                >
                                  <Icon className="h-5 w-5" strokeWidth={2} />
                                </span>
                                <span
                                  className={`font-medium ${
                                    isSelected
                                      ? "text-gray-900"
                                      : "text-gray-700"
                                  }`}
                                >
                                  {option.label}
                                </span>
                              </div>
                              {isSelected && (
                                <motion.div
                                  initial={{ scale: 0, rotate: -180 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  transition={{
                                    duration: 0.25,
                                    ease: [0.34, 1.56, 0.64, 1],
                                  }}
                                  className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2563EB]"
                                >
                                  <Check
                                    className="h-4 w-4 text-white"
                                    strokeWidth={3}
                                  />
                                </motion.div>
                              )}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {isContactStep && !submitted && (
                  <motion.div
                    key="contact"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="mb-6">
                      <motion.div
                        className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 px-3 py-1"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                          duration: 0.3,
                          ease: [0.34, 1.56, 0.64, 1],
                        }}
                      >
                        <Check className="h-3.5 w-3.5 text-green-600" strokeWidth={3} />
                        <span className="text-xs font-semibold uppercase tracking-wide text-green-700">
                          You qualified
                        </span>
                      </motion.div>
                      <h2 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                        Let&apos;s get you set up
                      </h2>
                      <p className="text-gray-500">
                        Drop your details and pick a time that works.
                      </p>
                    </div>
                    <form onSubmit={handleSubmitContact} className="space-y-4">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                          Full name
                        </label>
                        <input
                          type="text"
                          required
                          value={contact.name}
                          onChange={(e) =>
                            setContact({ ...contact, name: e.target.value })
                          }
                          className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-colors focus:border-[#2563EB] focus:outline-none"
                          placeholder="Jane Smith"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <input
                          type="email"
                          required
                          value={contact.email}
                          onChange={(e) =>
                            setContact({ ...contact, email: e.target.value })
                          }
                          className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-colors focus:border-[#2563EB] focus:outline-none"
                          placeholder="jane@yourbusiness.com"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                          Phone
                        </label>
                        <input
                          type="tel"
                          required
                          value={contact.phone}
                          onChange={(e) =>
                            setContact({ ...contact, phone: e.target.value })
                          }
                          className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-colors focus:border-[#2563EB] focus:outline-none"
                          placeholder="(555) 123-4567"
                        />
                      </div>
                      <button
                        type="submit"
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-6 py-3.5 font-semibold text-white shadow-[0_10px_24px_-8px_rgba(37,99,235,0.5)] transition-all duration-200 hover:bg-[#1D4ED8] hover:-translate-y-0.5 active:scale-[0.98]"
                      >
                        See Available Times
                        <ArrowRight className="h-4 w-4" />
                      </button>
                      <p className="pt-2 text-center text-xs text-gray-400">
                        Trusted by local businesses across Southern California
                      </p>
                    </form>
                  </motion.div>
                )}

                {submitted && (
                  <motion.div
                    key="calendly"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                      Pick a time that works
                    </h2>
                    <p className="mb-4 text-gray-500">
                      Looking forward to chatting, {contact.name.split(" ")[0]}.
                    </p>
                    <div className="overflow-hidden rounded-xl border border-gray-100">
                      <InlineWidget
                        url="https://calendly.com/contact-astrevix/new-meeting"
                        prefill={{
                          name: contact.name,
                          email: contact.email,
                          customAnswers: {
                            a1: contact.phone,
                          },
                        }}
                        styles={{
                          height: "720px",
                          minWidth: "320px",
                        }}
                        pageSettings={{
                          backgroundColor: "ffffff",
                          primaryColor: "2563eb",
                          textColor: "1f2937",
                          hideEventTypeDetails: false,
                          hideLandingPageDetails: true,
                        }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer with back button */}
            {!submitted && currentStep > 0 && (
              <div className="flex items-center border-t border-gray-100 px-6 py-3">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-900"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
