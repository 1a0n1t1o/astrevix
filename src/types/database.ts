export interface Business {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  logo_url: string | null;
  logo_emoji: string | null;
  brand_color: string | null;
  reward_description: string;
  content_type: string | null;
  requirements: string[] | null;
  owner_id: string | null;
  created_at: string;
  updated_at: string;
  // Business Information fields
  category: string | null;
  phone: string | null;
  address_street: string | null;
  address_city: string | null;
  address_state: string | null;
  address_zip: string | null;
  website: string | null;
  operating_hours: OperatingHours | null;
  // QR/NFC defaults
  qr_default_redirect_url: string | null;
  qr_default_fallback: string | null;
  qr_default_branding: boolean | null;
  // Submission limits
  max_rewards_per_customer: number | null;
  // Email template (legacy)
  email_subject: string | null;
  email_header: string | null;
  email_body: string | null;
  email_footer: string | null;
  email_brand_color: string | null;
  reward_file_url: string | null;
  reward_file_name: string | null;
  // SMS templates
  sms_confirmation_template: string | null;
  sms_confirmation_enabled: boolean | null;
  sms_approval_template: string | null;
  sms_approval_enabled: boolean | null;
  sms_rejection_template: string | null;
  sms_rejection_enabled: boolean | null;
  // Terms & Conditions
  terms_conditions: string | null;
  // Admin fields
  plan: "free" | "pro";
  status: "active" | "suspended";
  deleted_at: string | null;
}

export interface Submission {
  id: string;
  business_id: string;
  post_url: string;
  detected_platform: string | null;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
  status: "pending" | "approved" | "rejected";
  reviewed_at: string | null;
  reward_given: string | null;
  review_comment: string | null;
  created_at: string;
}

export interface QrScan {
  id: string;
  business_id: string;
  scanned_at: string;
  user_agent: string | null;
}

// Operating hours types
export interface DayHours {
  open: string;
  close: string;
  closed: boolean;
}

export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type OperatingHours = Partial<Record<DayOfWeek, DayHours>>;

export interface RewardSent {
  id: string;
  business_id: string;
  submission_id: string;
  customer_email: string | null;
  customer_phone: string | null;
  reward_type: string | null;
  sent_at: string;
}

export interface SmsLog {
  id: string;
  business_id: string;
  submission_id: string | null;
  customer_phone: string;
  message_type: "confirmation" | "approval" | "rejection";
  message_body: string;
  twilio_sid: string | null;
  status: string;
  created_at: string;
}

// User profile (stored in Supabase Auth user_metadata)
export interface UserProfile {
  first_name: string;
  last_name: string;
  avatar_url: string | null;
}

export interface InviteCode {
  id: string;
  code: string;
  business_name: string | null;
  business_email: string | null;
  max_uses: number;
  times_used: number;
  status: "active" | "used" | "expired" | "revoked";
  created_by: string;
  created_at: string;
  expires_at: string | null;
  claimed_by: string | null;
  claimed_at: string | null;
}
