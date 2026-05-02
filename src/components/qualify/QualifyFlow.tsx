"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { InlineWidget } from "react-calendly";

const STEPS = [
  {
    id: "business",
    question: "What best describes your business?",
    options: [
      "Nail Salon",
      "Barbershop / Hair Salon",
      "Auto Detailing / Tint / Wrap",
      "Lash Studio / Med Spa / Tattoo",
      "Other Local Business",
    ],
  },
  {
    id: "challenge",
    question: "What's your biggest challenge right now?",
    options: [
      "Not enough customer content or reviews",
      "Customers don't post about us",
      "Low foot traffic / need more visibility",
      "Tried marketing, nothing's working",
    ],
  },
  {
    id: "ads",
    question: "Have you tried running paid ads before?",
    options: [
      "Yes — they work for me",
      "Yes — they don't work for me",
      "No — never tried",
    ],
  },
] as const;

interface QualifyFlowProps {
  open: boolean;
  onClose: () => void;
}

export function QualifyFlow({ open, onClose }: QualifyFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [contact, setContact] = useState({ name: "", email: "", phone: "" });
  const [submitted, setSubmitted] = useState(false);

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
  const progress = ((currentStep + (submitted ? 1 : 0)) / totalSteps) * 100;

  return (
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
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            {/* Progress bar */}
            <div className="h-1 bg-gray-100">
              <motion.div
                className="h-full bg-gradient-to-r from-[#2563EB] to-[#7C3AED]"
                initial={false}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div className="text-sm text-gray-500">
                {submitted
                  ? "Pick a time that works"
                  : `Step ${Math.min(currentStep + 1, totalSteps)} of ${totalSteps}`}
              </div>
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
                    <h2 className="mb-6 text-2xl font-bold text-gray-900 sm:text-3xl">
                      {STEPS[currentStep].question}
                    </h2>
                    <div className="space-y-3">
                      {STEPS[currentStep].options.map((option) => {
                        const isSelected =
                          answers[STEPS[currentStep].id] === option;
                        return (
                          <button
                            key={option}
                            onClick={() =>
                              handleSelectAnswer(
                                STEPS[currentStep].id,
                                option,
                              )
                            }
                            className={`w-full rounded-xl border-2 px-5 py-4 text-left transition-all ${
                              isSelected
                                ? "border-[#2563EB] bg-blue-50 text-blue-900"
                                : "border-gray-200 text-gray-900 hover:border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{option}</span>
                              {isSelected && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <Check className="h-5 w-5 text-[#2563EB]" />
                                </motion.div>
                              )}
                            </div>
                          </button>
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
                    <h2 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                      Almost there
                    </h2>
                    <p className="mb-6 text-gray-500">
                      Where should we send your demo confirmation?
                    </p>
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
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#7C3AED] px-6 py-3.5 font-semibold text-white shadow-lg shadow-purple-500/25 transition-opacity hover:opacity-90"
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
                    <div className="-mx-6 -mb-6 sm:-mx-8 sm:-mb-8">
                      <InlineWidget
                        url="https://calendly.com/contact-astrevix/new-meeting"
                        prefill={{
                          name: contact.name,
                          email: contact.email,
                          customAnswers: {
                            a1: contact.phone,
                          },
                        }}
                        styles={{ height: "600px" }}
                        pageSettings={{
                          backgroundColor: "ffffff",
                          primaryColor: "7C3AED",
                          textColor: "1f2937",
                          hideEventTypeDetails: false,
                          hideLandingPageDetails: false,
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
    </AnimatePresence>
  );
}
