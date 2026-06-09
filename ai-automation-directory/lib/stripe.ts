import Stripe from "stripe";

// Lazily construct the Stripe client so the app can build without secrets set.
// The key is read by name only from the environment — never hardcoded.
export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  return new Stripe(key);
}

export const TIER_PRICE_ENV: Record<"standard" | "featured", string> = {
  standard: "STRIPE_STANDARD_PRICE_ID",
  featured: "STRIPE_FEATURED_PRICE_ID",
};

export function getPriceIdForTier(tier: "standard" | "featured"): string {
  const envName = TIER_PRICE_ENV[tier];
  const priceId = process.env[envName];
  if (!priceId) {
    throw new Error(`${envName} is not configured`);
  }
  return priceId;
}
