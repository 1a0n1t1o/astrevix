/**
 * Server-only Resend email client.
 * Do NOT import in "use client" components.
 */
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const EMAIL_FROM_ADDRESS = "contact@astrevix.com";

export interface SendEmailResult {
  success: boolean;
  emailId?: string;
  error?: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
  fromName,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  fromName?: string;
}): Promise<SendEmailResult> {
  try {
    const from = fromName
      ? `${fromName} <${EMAIL_FROM_ADDRESS}>`
      : `Astrevix <${EMAIL_FROM_ADDRESS}>`;

    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
      text,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, emailId: data?.id };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
