import * as React from "react";
import { Text } from "@react-email/components";
import AstrevixEmailWrapper from "./AstrevixEmailWrapper";

interface Props {
  businessName: string;
  body: string;
}

const paragraph: React.CSSProperties = {
  color: "#1f2937",
  fontSize: 15,
  lineHeight: "24px",
  margin: 0,
  whiteSpace: "pre-line",
};

export function SubmissionConfirmationEmail({ businessName, body }: Props) {
  return (
    <AstrevixEmailWrapper
      preview={`We got your submission — ${businessName}`}
      businessName={businessName}
    >
      <Text style={paragraph}>{body}</Text>
    </AstrevixEmailWrapper>
  );
}

export default SubmissionConfirmationEmail;
