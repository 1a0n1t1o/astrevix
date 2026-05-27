"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

export interface LeadData {
  firstName: string;
  businessName: string;
  email: string;
  phone: string;
}

interface LeadFormScreenProps {
  onSubmit: (lead: LeadData) => void;
}

type FieldErrors = Partial<Record<keyof LeadData, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(lead: LeadData): FieldErrors {
  const errors: FieldErrors = {};
  if (!lead.firstName.trim()) errors.firstName = "Please enter your first name.";
  if (!lead.businessName.trim())
    errors.businessName = "Please enter your business name.";
  if (!EMAIL_RE.test(lead.email.trim()))
    errors.email = "Please enter a valid email.";
  if (lead.phone.replace(/\D/g, "").length < 10)
    errors.phone = "Please enter a valid mobile number.";
  return errors;
}

const FIELDS: {
  key: keyof LeadData;
  label: string;
  type: string;
  placeholder: string;
  autoComplete: string;
  inputMode?: "text" | "email" | "tel";
}[] = [
  {
    key: "firstName",
    label: "First name",
    type: "text",
    placeholder: "Jane",
    autoComplete: "given-name",
  },
  {
    key: "businessName",
    label: "Business name",
    type: "text",
    placeholder: "Jane's Salon",
    autoComplete: "organization",
  },
  {
    key: "email",
    label: "Email",
    type: "email",
    placeholder: "jane@yoursalon.com",
    autoComplete: "email",
    inputMode: "email",
  },
  {
    key: "phone",
    label: "Mobile phone",
    type: "tel",
    placeholder: "(555) 123-4567",
    autoComplete: "tel",
    inputMode: "tel",
  },
];

export default function LeadFormScreen({ onSubmit }: LeadFormScreenProps) {
  const [lead, setLead] = useState<LeadData>({
    firstName: "",
    businessName: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [attempted, setAttempted] = useState(false);

  function handleChange(key: keyof LeadData, value: string) {
    const next = { ...lead, [key]: value };
    setLead(next);
    if (attempted) setErrors(validate(next));
  }

  function handleSubmit() {
    const found = validate(lead);
    setErrors(found);
    setAttempted(true);
    if (Object.keys(found).length === 0) {
      onSubmit({
        firstName: lead.firstName.trim(),
        businessName: lead.businessName.trim(),
        email: lead.email.trim(),
        phone: lead.phone.trim(),
      });
    }
  }

  return (
    <div className="flex flex-1 flex-col justify-center py-8">
      <h2 className="text-[26px] font-semibold leading-tight tracking-tight text-[#F8FAFC] sm:text-[30px]">
        Let&apos;s lock in your spot.
      </h2>
      <p className="mt-3 text-[16px] leading-relaxed text-white/65">
        We&apos;ll send a confirmation and a reminder.
      </p>

      <div className="mt-7 space-y-4">
        {FIELDS.map((field) => {
          const error = errors[field.key];
          return (
            <div key={field.key}>
              <label
                htmlFor={`lead-${field.key}`}
                className="mb-1.5 block text-sm font-medium text-white/70"
              >
                {field.label}
              </label>
              <input
                id={`lead-${field.key}`}
                type={field.type}
                inputMode={field.inputMode}
                autoComplete={field.autoComplete}
                value={lead[field.key]}
                onChange={(e) => handleChange(field.key, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSubmit();
                }}
                placeholder={field.placeholder}
                aria-invalid={error ? true : undefined}
                className={`h-[56px] w-full rounded-2xl border-2 bg-white/[0.04] px-4 text-[16px] text-[#F8FAFC] placeholder:text-white/35 transition-colors focus:outline-none ${
                  error
                    ? "border-red-400/70"
                    : "border-white/15 focus:border-[#2563EB]"
                }`}
              />
              {error && (
                <p className="mt-1.5 text-xs text-red-300">{error}</p>
              )}
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        className="mt-7 flex h-[60px] w-full items-center justify-center gap-2 rounded-full bg-[#2563EB] text-lg font-semibold text-white shadow-xl shadow-[#2563EB]/30 transition-transform duration-100 active:scale-[0.98]"
      >
        See Available Times
        <ArrowRight className="h-5 w-5" strokeWidth={2.5} />
      </button>
    </div>
  );
}
