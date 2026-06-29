import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { durableRateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  // Rate limiting: 5 signups per IP per minute
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const { success: allowed } = await durableRateLimit(`early-access:${ip}`, 5, 60);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  let email: unknown;
  try {
    const body = await request.json();
    email = body?.email;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  console.log("[early-access] new signup:", email);

  return NextResponse.json({ success: true });
}
