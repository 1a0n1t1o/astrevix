import * as React from "react";
import { Button, Section, Text } from "@react-email/components";
import AstrevixEmailWrapper from "./AstrevixEmailWrapper";

interface Props {
  businessName: string;
  body: string;
  couponCode?: string | null;
  rewardLink?: string | null;
}

const paragraph: React.CSSProperties = {
  color: "#1f2937",
  fontSize: 15,
  lineHeight: "24px",
  margin: 0,
  whiteSpace: "pre-line",
};

const couponBox: React.CSSProperties = {
  border: "2px dashed #d4d4d8",
  borderRadius: 10,
  marginTop: 24,
  padding: "18px 16px",
  textAlign: "center" as const,
};

const couponLabel: React.CSSProperties = {
  color: "#6b7280",
  fontSize: 11,
  letterSpacing: 1.2,
  margin: 0,
  textTransform: "uppercase" as const,
};

const couponCodeStyle: React.CSSProperties = {
  color: "#111827",
  fontFamily: "'SF Mono', Menlo, Monaco, Consolas, 'Courier New', monospace",
  fontSize: 24,
  fontWeight: 700,
  letterSpacing: 3,
  margin: "6px 0 0 0",
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: "#6d28d9",
  borderRadius: 8,
  color: "#ffffff",
  display: "inline-block",
  fontSize: 15,
  fontWeight: 600,
  padding: "12px 22px",
  textDecoration: "none",
};

const buttonWrap: React.CSSProperties = {
  marginTop: 24,
  textAlign: "center" as const,
};

export function RewardApprovedEmail({
  businessName,
  body,
  couponCode,
  rewardLink,
}: Props) {
  return (
    <AstrevixEmailWrapper
      preview={`Your reward from ${businessName} is ready!`}
      businessName={businessName}
    >
      <Text style={paragraph}>{body}</Text>

      {couponCode && (
        <Section style={couponBox}>
          <Text style={couponLabel}>Your coupon code</Text>
          <Text style={couponCodeStyle}>{couponCode}</Text>
        </Section>
      )}

      {rewardLink && (
        <Section style={buttonWrap}>
          <Button href={rewardLink} style={buttonStyle}>
            Claim your reward
          </Button>
        </Section>
      )}
    </AstrevixEmailWrapper>
  );
}

export default RewardApprovedEmail;
