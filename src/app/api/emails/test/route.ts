import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/resend";
import {
  DEFAULT_EMAIL_TEMPLATES,
  DEFAULT_EMAIL_SUBJECTS,
  renderEmailTemplate,
  renderEmailSubject,
} from "@/lib/email";
import {
  renderConfirmationEmail,
  renderApprovalEmail,
  renderRejectionEmail,
} from "@/emails/render";

export async function GET(request: Request) {
  // Gate: dev only, or via ?key=
  const isDev = process.env.NODE_ENV !== "production";
  const { searchParams } = new URL(request.url);
  const keyParam = searchParams.get("key");
  const testKey = process.env.EMAIL_TEST_KEY;
  const keyOk = testKey && keyParam === testKey;
  if (!isDev && !keyOk) {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }

  const type = searchParams.get("type") || "confirmation";
  const to = searchParams.get("to") || "delivered@resend.dev";
  const businessName = searchParams.get("business") || "Sample Coffee Co.";
  const customerName = searchParams.get("name") || "Sarah";

  const variables = {
    businessName,
    customerName,
    rewardDetails: "Free medium latte",
    couponCode: "AX7K2M",
    rewardLink: "https://example.com/reward",
  };

  let subject: string;
  let body: string;
  let html: string;
  let text: string;

  if (type === "approval") {
    body = renderEmailTemplate(DEFAULT_EMAIL_TEMPLATES.approval, variables);
    subject = renderEmailSubject(DEFAULT_EMAIL_SUBJECTS.approval, variables);
    const rendered = await renderApprovalEmail({
      businessName,
      body,
      couponCode: variables.couponCode,
      rewardLink: null,
    });
    html = rendered.html;
    text = rendered.text;
  } else if (type === "rejection") {
    body = renderEmailTemplate(DEFAULT_EMAIL_TEMPLATES.rejection, variables);
    subject = renderEmailSubject(DEFAULT_EMAIL_SUBJECTS.rejection, variables);
    const rendered = await renderRejectionEmail({ businessName, body });
    html = rendered.html;
    text = rendered.text;
  } else {
    body = renderEmailTemplate(DEFAULT_EMAIL_TEMPLATES.confirmation, variables);
    subject = renderEmailSubject(
      DEFAULT_EMAIL_SUBJECTS.confirmation,
      variables
    );
    const rendered = await renderConfirmationEmail({ businessName, body });
    html = rendered.html;
    text = rendered.text;
  }

  const result = await sendEmail({
    to,
    subject,
    html,
    text,
    fromName: businessName,
  });

  return NextResponse.json({ type, to, subject, ...result });
}
