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
}

export interface Submission {
  id: string;
  business_id: string;
  post_url: string;
  detected_platform: string | null;
  customer_name: string;
  customer_email: string;
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
