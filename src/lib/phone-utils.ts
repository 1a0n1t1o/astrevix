/**
 * Client-safe phone number utilities for US phone numbers.
 * No server dependencies — safe to import in "use client" components.
 */

/** Format phone digits as user types: (555) 123-4567 */
export function formatPhoneInput(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length === 0) return "";
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

/** Parse any phone input to E.164 format (+1XXXXXXXXXX), or null if invalid */
export function parsePhoneToE164(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return null;
}

/** Check if input contains a valid 10-digit US phone number */
export function isValidUSPhone(input: string): boolean {
  return parsePhoneToE164(input) !== null;
}

/** Format E.164 phone for display: +15551234567 -> (555) 123-4567 */
export function formatPhoneForDisplay(e164: string | null | undefined): string {
  if (!e164) return "";
  const digits = e164.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) {
    return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return e164;
}

/** Count SMS segments for a message. 160 chars = 1 segment, 153 per segment for multi-part. */
export function countSmsSegments(text: string): {
  characters: number;
  segments: number;
} {
  const characters = text.length;
  if (characters === 0) return { characters: 0, segments: 0 };
  if (characters <= 160) return { characters, segments: 1 };
  return { characters, segments: Math.ceil(characters / 153) };
}
