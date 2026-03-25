/**
 * Server-only email service via Resend.
 * Do NOT import in "use client" components.
 */
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/** Default email templates for each message type */
export const DEFAULT_EMAIL_TEMPLATES = {
  confirmation: {
    subject: "Thanks for your submission to [Business Name]!",
    body: "We received your post and we're reviewing it now. We'll get back to you shortly with your reward!",
  },
  approval: {
    subject: "Your reward from [Business Name] is here!",
    body: "Great news! Your post has been approved. Here's your reward: [Reward Details]. Thank you for your support!",
  },
  rejection: {
    subject: "Update on your submission to [Business Name]",
    body: "Thanks for your submission. Unfortunately, we weren't able to approve this one. Feel free to try again with a new post!",
  },
};

/** Replace template variables with actual values */
export function renderEmailTemplate(
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

  // Prepend personal note if provided
  if (variables.personalNote) {
    result = `${variables.personalNote}\n\n${result}`;
  }

  return result;
}

/** Build a simple branded HTML email */
export function buildEmailHtml(
  body: string,
  brandColor: string,
  businessName: string,
  logoUrl?: string | null
): string {
  const escapedBody = body
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br>");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f7f5f2;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f7f5f2;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background-color:#ffffff;border-radius:16px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background-color:${brandColor};padding:24px 32px;text-align:center;">
              ${logoUrl ? `<img src="${logoUrl}" alt="${businessName}" style="max-height:40px;margin-bottom:8px;border-radius:8px;">` : ""}
              <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:700;">${businessName}</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;color:#333333;font-size:15px;line-height:1.6;">
              ${escapedBody}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:16px 32px 24px;border-top:1px solid #f0eeeb;text-align:center;">
              <p style="margin:0;color:#999999;font-size:12px;">
                Sent via <a href="https://astrevix.com" style="color:${brandColor};text-decoration:none;">Astrevix</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** Send an email via Resend */
export async function sendRewardEmail(
  to: string,
  subject: string,
  htmlBody: string,
  attachment?: { filename: string; content: Buffer }
) {
  return resend.emails.send({
    from: "Astrevix <contact@astrevix.com>",
    to,
    subject,
    html: htmlBody,
    attachments: attachment ? [attachment] : undefined,
  });
}
