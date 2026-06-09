import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { Resend } from "resend";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

type Submission = {
  name: string;
  email: string;
  agencyName: string;
  website: string;
  description: string;
  category: string;
  tier: string;
  amountTotal: number | null;
  currency: string;
  createdAt: string;
};

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

    const submission: Submission = {
      name: md.contactName ?? "",
      email,
      agencyName: md.agencyName ?? "",
      website: md.website ?? "",
      description: md.description ?? "",
      category: md.category ?? "",
      tier: md.tier ?? "",
      amountTotal: session.amount_total ?? null,
      currency: session.currency ?? "usd",
      createdAt: new Date().toISOString(),
    };

    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL;
    const resend = apiKey ? new Resend(apiKey) : null;

    // Notify the owner of the new paid submission so they can fulfill it.
    try {
      const ownerEmail = process.env.OWNER_EMAIL;
      if (ownerEmail && fromEmail && resend) {
        await resend.emails.send({
          from: `Directory <${fromEmail}>`,
          to: ownerEmail,
          subject: `New paid submission${
            submission.agencyName ? `: ${submission.agencyName}` : ""
          }`,
          html: buildOwnerEmailHtml(submission),
        });
      }
    } catch (err) {
      console.error("Failed to send owner notification email:", err);
    }

    // Send a confirmation email to the customer via Resend.
    try {
      if (email && fromEmail && resend) {
        await resend.emails.send({
          from: `Directory <${fromEmail}>`,
          to: email,
          subject: "We received your AI Automation Agency Directory submission",
          html: buildCustomerEmailHtml(submission),
        });
      }
    } catch (err) {
      console.error("Failed to send confirmation email:", err);
    }
  }

  return NextResponse.json({ received: true });
}

function formatAmount(amountTotal: number | null, currency: string): string {
  if (amountTotal === null) return "—";
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amountTotal / 100);
  } catch {
    return `${(amountTotal / 100).toFixed(2)} ${currency.toUpperCase()}`;
  }
}

function buildOwnerEmailHtml(submission: Submission): string {
  const amount = formatAmount(submission.amountTotal, submission.currency);
  const timestamp = new Date(submission.createdAt).toLocaleString();
  const rows: [string, string][] = [
    ["Customer email", submission.email || "—"],
    ["Amount paid", amount],
    ["Timestamp", timestamp],
    ["Contact name", submission.name || "—"],
    ["Agency", submission.agencyName || "—"],
    ["Tier", submission.tier || "—"],
    ["Website", submission.website || "—"],
    ["Category", submission.category || "—"],
    ["Description", submission.description || "—"],
  ];
  const tableRows = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 12px;color:#52525b;font-weight:600;white-space:nowrap;vertical-align:top;">${label}</td><td style="padding:6px 12px;color:#18181b;">${escapeHtml(
          value
        )}</td></tr>`
    )
    .join("");
  return `
  <div style="font-family: Arial, Helvetica, sans-serif; max-width: 560px; margin: 0 auto; color: #18181b;">
    <h1 style="font-size: 20px;">New paid submission</h1>
    <p>A new payment just completed in Stripe. Details below — add the listing to <code>data/agencies.json</code> to fulfill it.</p>
    <table style="border-collapse:collapse;width:100%;font-size:14px;border:1px solid #e4e4e7;border-radius:8px;">
      ${tableRows}
    </table>
  </div>`;
}

function buildCustomerEmailHtml(submission: Submission): string {
  const agency = submission.agencyName || "your agency";
  const tier = submission.tier
    ? submission.tier.charAt(0).toUpperCase() + submission.tier.slice(1)
    : "Standard";
  return `
  <div style="font-family: Arial, Helvetica, sans-serif; max-width: 560px; margin: 0 auto; color: #18181b;">
    <h1 style="font-size: 20px;">Thank you for your submission!</h1>
    <p>We've received your payment for the <strong>${tier} listing</strong> of <strong>${escapeHtml(
      agency
    )}</strong> in the AI Automation Agency Directory.</p>
    <p>Our team will review your details and your listing will be reviewed and added to the directory <strong>within 48 hours</strong>. We'll be in touch if we need anything else.</p>
    <p style="color:#52525b; font-size: 13px;">If you have any questions, just reply to this email.</p>
    <p style="margin-top: 24px;">— The AI Automation Agency Directory team</p>
  </div>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
