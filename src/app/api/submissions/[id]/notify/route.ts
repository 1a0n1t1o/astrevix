import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { status, reward_given } = await request.json();

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch submission details
  const { data: submission } = await supabase
    .from("submissions")
    .select("*")
    .eq("id", id)
    .single();

  if (!submission) {
    return NextResponse.json(
      { error: "Submission not found" },
      { status: 404 }
    );
  }

  // Fetch business details
  const { data: business } = await supabase
    .from("businesses")
    .select("name")
    .eq("id", submission.business_id)
    .single();

  const businessName = business?.name || "the business";

  // Build email content
  const emailData = {
    to: submission.customer_email,
    customerName: submission.customer_name,
    businessName,
    status,
    reward: reward_given || null,
    submissionUrl: submission.post_url,
  };

  // TODO: Integrate with an email service (Resend, SendGrid, etc.)
  // For now, log the email that would be sent
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📧 EMAIL NOTIFICATION (logged, not sent)");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`To: ${emailData.to}`);
  console.log(`Subject: ${
    status === "approved"
      ? `🎉 Your submission to ${businessName} was approved!`
      : `Update on your submission to ${businessName}`
  }`);
  console.log("---");

  if (status === "approved") {
    console.log(`Hi ${emailData.customerName},`);
    console.log("");
    console.log(`Great news! ${businessName} has approved your content submission.`);
    if (reward_given) {
      console.log(`Your reward: ${reward_given}`);
    }
    console.log("");
    console.log("Thank you for creating amazing content!");
  } else {
    console.log(`Hi ${emailData.customerName},`);
    console.log("");
    console.log(`Thank you for submitting content to ${businessName}.`);
    console.log("Unfortunately, your submission was not approved this time.");
    console.log("Feel free to try again with new content!");
  }

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  return NextResponse.json({ success: true, logged: true });
}
