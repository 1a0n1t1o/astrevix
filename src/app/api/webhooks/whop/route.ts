import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

// TODO: Verify webhook signature using WHOP_WEBHOOK_SECRET
// Whop sends a signature header that should be validated before processing.
// See Whop docs for verification details.

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    if (!action || !data) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const admin = getSupabaseAdmin();

    // Extract email from the membership to match back to a business
    const email =
      data.email ||
      data.user?.email ||
      data.metadata?.email ||
      null;

    const membershipId = data.id || data.membership_id || null;

    if (!email) {
      console.error("[Whop Webhook] No email found in payload:", JSON.stringify(body));
      return NextResponse.json({ error: "No email in payload" }, { status: 400 });
    }

    // Look up the business owner by email
    const { data: users } = await admin.auth.admin.listUsers();
    const matchedUser = users?.users?.find(
      (u) => u.email?.toLowerCase() === email.toLowerCase()
    );

    if (!matchedUser) {
      console.error("[Whop Webhook] No user found for email:", email);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find the business owned by this user
    const { data: business } = await admin
      .from("businesses")
      .select("id")
      .eq("owner_id", matchedUser.id)
      .single();

    if (!business) {
      console.error("[Whop Webhook] No business found for user:", matchedUser.id);
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    switch (action) {
      case "membership.went_valid": {
        await admin
          .from("businesses")
          .update({
            subscription_status: "active",
            whop_membership_id: membershipId,
            subscription_activated_at: new Date().toISOString(),
            plan: "pro",
          })
          .eq("id", business.id);

        console.log("[Whop Webhook] Activated subscription for business:", business.id);
        break;
      }

      case "membership.went_invalid": {
        await admin
          .from("businesses")
          .update({ subscription_status: "past_due" })
          .eq("id", business.id);

        console.log("[Whop Webhook] Subscription went invalid for business:", business.id);
        break;
      }

      case "membership.cancelled": {
        await admin
          .from("businesses")
          .update({ subscription_status: "cancelled" })
          .eq("id", business.id);

        console.log("[Whop Webhook] Subscription cancelled for business:", business.id);
        break;
      }

      default:
        console.log("[Whop Webhook] Unhandled action:", action);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Whop Webhook] Error processing webhook:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
