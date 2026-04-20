import * as React from "react";
import {
  Body,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface Props {
  preview: string;
  businessName: string;
  children: React.ReactNode;
}

const main: React.CSSProperties = {
  backgroundColor: "#f4f4f5",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  margin: 0,
  padding: "24px 0",
};

const container: React.CSSProperties = {
  backgroundColor: "#ffffff",
  borderRadius: 12,
  margin: "0 auto",
  maxWidth: 600,
  overflow: "hidden",
};

const header: React.CSSProperties = {
  padding: "24px 32px 16px 32px",
  borderBottom: "1px solid #f1f1f4",
};

const businessNameStyle: React.CSSProperties = {
  color: "#111827",
  fontSize: 18,
  fontWeight: 700,
  margin: 0,
};

const body: React.CSSProperties = {
  padding: "24px 32px 32px 32px",
};

const footer: React.CSSProperties = {
  padding: "20px 32px 28px 32px",
  borderTop: "1px solid #f1f1f4",
  textAlign: "center" as const,
};

const footerText: React.CSSProperties = {
  color: "#9ca3af",
  fontSize: 12,
  margin: 0,
};

const footerLink: React.CSSProperties = {
  color: "#6d28d9",
  textDecoration: "none",
  fontWeight: 600,
};

export function AstrevixEmailWrapper({
  preview,
  businessName,
  children,
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={businessNameStyle}>{businessName}</Text>
          </Section>
          <Section style={body}>{children}</Section>
          <Section style={footer}>
            <Text style={footerText}>
              Powered by{" "}
              <Link href="https://astrevix.com" style={footerLink}>
                Astrevix
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default AstrevixEmailWrapper;
