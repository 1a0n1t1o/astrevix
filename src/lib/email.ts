/**
 * Server-only email template rendering utilities.
 * Template strings live in the businesses table; this module renders
 * them into plain-text bodies + React Email HTML for Resend.
 */

export const DEFAULT_EMAIL_TEMPLATES = {
  confirmation:
    "Hi [Customer Name],\n\nThanks for submitting your post to [Business Name]! We'll review it and get back to you shortly.",
  approval:
    "Hi [Customer Name],\n\nGreat news! Your post for [Business Name] has been approved.\n\nHere's your reward: [Reward Details]\nYour coupon code: [Coupon Code]\n\nThank you for your support!",
  rejection:
    "Hi [Customer Name],\n\nThanks for your submission to [Business Name]. Unfortunately, we weren't able to approve this one. Feel free to try again with a new post!",
};

export const DEFAULT_EMAIL_SUBJECTS = {
  confirmation: "We got your submission — [Business Name]",
  approval: "Your reward from [Business Name] is ready!",
  rejection: "An update on your submission to [Business Name]",
};

export interface EmailTemplateVars {
  businessName: string;
  customerName: string;
  rewardDetails?: string;
  rewardLink?: string;
  personalNote?: string;
  couponCode?: string;
}

export function renderEmailTemplate(
  template: string,
  variables: EmailTemplateVars
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

  if (variables.personalNote) {
    result += `\n\n${variables.personalNote}`;
  }

  return result;
}

export function renderEmailSubject(
  subject: string,
  variables: Pick<EmailTemplateVars, "businessName" | "customerName">
): string {
  return subject
    .replace(/\[Business Name\]/g, variables.businessName)
    .replace(/\[Customer Name\]/g, variables.customerName);
}
