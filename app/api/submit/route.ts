import { NextResponse } from "next/server";
import { getPriceIdForTier, getStripe } from "@/lib/stripe";
import { SITE_URL } from "@/lib/site";

export const runtime = "nodejs";

type SubmitBody = {
  tier?: string;
  name?: string;
  email?: string;
  agencyName?: string;
  website?: string;
  description?: string;
  category?: string;
};

export async function POST(req: Request) {
  let body: SubmitBody;
  try {
    body = (await req.json()) as SubmitBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const tier = body.tier;
  if (tier !== "standard" && tier !== "featured") {
    return NextResponse.json(
      { error: "tier must be 'standard' or 'featured'" },
      { status: 400 }
    );
  }

  // Resolve the base URL for Stripe redirects from the request origin, falling
  // back to the configured site URL.
  const origin = req.headers.get("origin") || SITE_URL;

  try {
    const stripe = getStripe();
    const price = getPriceIdForTier(tier);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price, quantity: 1 }],
      success_url: `${origin}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/submit`,
      customer_email: body.email || undefined,
      // Carry the submission details on the session so the webhook can store
      // them and email the customer once payment completes.
      metadata: {
        tier,
        contactName: body.name ?? "",
        agencyName: body.agencyName ?? "",
        website: body.website ?? "",
        category: body.category ?? "",
        description: (body.description ?? "").slice(0, 480),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to create checkout session";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
