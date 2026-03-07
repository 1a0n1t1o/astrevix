/**
 * Server-only Twilio SMS service.
 * Do NOT import in "use client" components.
 */
import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER!;

/** Default SMS templates for each message type */
export const DEFAULT_SMS_TEMPLATES = {
  confirmation:
    "Thanks for submitting your post to [Business Name]! We'll review it and get back to you shortly.",
  approval:
    "Great news! Your post for [Business Name] has been approved! Your coupon code is: [Coupon Code]. Here's your reward: [Reward Details]. Thank you for your support!",
  rejection:
    "Thanks for your submission to [Business Name]. Unfortunately, we weren't able to approve this one. Feel free to try again with a new post!",
};

/** Replace template variables with actual values */
export function renderSmsTemplate(
  template: string,
  variables: {
    businessName: string;
    customerName: string;
    rewardDetails?: string;
    rewardLink?: string;
    personalNote?: string;
    couponCode?: string;
  }
): string {
  let result = template
    .replace(/\[Business Name\]/g, variables.businessName)
    .replace(/\[Customer Name\]/g, variables.customerName);

  if (variables.rewardDetails) {
    result = result.replace(/\[Reward Details\]/g, variables.rewardDetails);
  }
  if (variables.rewardLink) {
    result = result.replace(/\[Reward Link\]/g, variables.rewardLink);
  }
  if (variables.couponCode) {
    result = result.replace(/\[Coupon Code\]/g, variables.couponCode);
  }

  // Append personal note if provided
  if (variables.personalNote) {
    result += `\n\n${variables.personalNote}`;
  }

  return result;
}

/** Send an SMS via Twilio */
export async function sendSms(
  to: string,
  body: string
): Promise<{ sid: string; status: string }> {
  const message = await client.messages.create({
    body,
    from: TWILIO_PHONE_NUMBER,
    to,
  });
  return { sid: message.sid, status: message.status };
}
