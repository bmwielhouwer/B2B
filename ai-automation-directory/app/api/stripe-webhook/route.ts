import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { Resend } from "resend";
import { getStripe } from "@/lib/stripe";
import { getRedis, SUBMISSION_PREFIX, type StoredSubmission } from "@/lib/redis";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = req.headers.get("stripe-signature");

  if (!secret || !signature) {
    return NextResponse.json(
      { error: "Missing webhook secret or signature" },
      { status: 400 }
    );
  }

  // Stripe requires the raw, unparsed request body to verify the signature.
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(rawBody, signature, secret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${message}` },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const email =
      session.customer_details?.email || session.customer_email || "";
    const md = session.metadata ?? {};

    const submission: StoredSubmission = {
      name: md.contactName ?? "",
      email,
      agencyName: md.agencyName ?? "",
      website: md.website ?? "",
      description: md.description ?? "",
      category: md.category ?? "",
      tier: md.tier ?? "",
      amountTotal: session.amount_total ?? null,
      createdAt: new Date().toISOString(),
    };

    // Persist the submission for the owner's admin view. Keyed by timestamp.
    try {
      const key = `${SUBMISSION_PREFIX}${Date.now()}`;
      await getRedis().set(key, JSON.stringify(submission));
    } catch (err) {
      console.error("Failed to store submission in Redis:", err);
    }

    // Send a confirmation email to the customer via Resend.
    try {
      const apiKey = process.env.RESEND_API_KEY;
      const fromEmail = process.env.RESEND_FROM_EMAIL;
      if (email && apiKey && fromEmail) {
        const resend = new Resend(apiKey);
        await resend.emails.send({
          from: `Directory <${fromEmail}>`,
          to: email,
          subject: "We received your AI Automation Agency Directory submission",
          html: buildEmailHtml(submission),
        });
      }
    } catch (err) {
      console.error("Failed to send confirmation email:", err);
    }
  }

  return NextResponse.json({ received: true });
}

function buildEmailHtml(submission: StoredSubmission): string {
  const agency = submission.agencyName || "your agency";
  const tier = submission.tier
    ? submission.tier.charAt(0).toUpperCase() + submission.tier.slice(1)
    : "Standard";
  return `
  <div style="font-family: Arial, Helvetica, sans-serif; max-width: 560px; margin: 0 auto; color: #18181b;">
    <h1 style="font-size: 20px;">Thank you for your submission!</h1>
    <p>We've received your payment for the <strong>${tier} listing</strong> of <strong>${agency}</strong> in the AI Automation Agency Directory.</p>
    <p>Our team will review your details and your listing will be reviewed and added to the directory <strong>within 48 hours</strong>. We'll be in touch if we need anything else.</p>
    <p style="color:#52525b; font-size: 13px;">If you have any questions, just reply to this email.</p>
    <p style="margin-top: 24px;">— The AI Automation Agency Directory team</p>
  </div>`;
}
