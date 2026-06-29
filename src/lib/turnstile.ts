// Cloudflare Turnstile server-side verification.
// Inert until TURNSTILE_SECRET_KEY is set, so the app keeps working before the
// captcha is provisioned. Once the secret is present, a missing/invalid token
// is rejected.

const VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function verifyTurnstile(
  token: string | undefined | null,
  ip?: string
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  // Not configured yet → don't block.
  if (!secret) return true;

  if (!token) return false;

  try {
    const body = new URLSearchParams();
    body.set("secret", secret);
    body.set("response", token);
    if (ip && ip !== "unknown") body.set("remoteip", ip);

    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    // On verifier outage, fail closed — a state-changing public endpoint
    // shouldn't accept unverifiable traffic.
    return false;
  }
}
