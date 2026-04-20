import * as React from "react";
import { render } from "@react-email/render";
import SubmissionConfirmationEmail from "./SubmissionConfirmationEmail";
import RewardApprovedEmail from "./RewardApprovedEmail";
import RejectionEmail from "./RejectionEmail";

export async function renderConfirmationEmail(args: {
  businessName: string;
  body: string;
}) {
  const el = React.createElement(SubmissionConfirmationEmail, args);
  const [html, text] = await Promise.all([
    render(el),
    render(el, { plainText: true }),
  ]);
  return { html, text };
}

export async function renderApprovalEmail(args: {
  businessName: string;
  body: string;
  couponCode?: string | null;
  rewardLink?: string | null;
}) {
  const el = React.createElement(RewardApprovedEmail, args);
  const [html, text] = await Promise.all([
    render(el),
    render(el, { plainText: true }),
  ]);
  return { html, text };
}

export async function renderRejectionEmail(args: {
  businessName: string;
  body: string;
}) {
  const el = React.createElement(RejectionEmail, args);
  const [html, text] = await Promise.all([
    render(el),
    render(el, { plainText: true }),
  ]);
  return { html, text };
}
