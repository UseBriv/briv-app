import Stripe from "stripe";

const apiKey = process.env.STRIPE_SECRET_KEY;

export const stripe = apiKey
  ? new Stripe(apiKey, {
      apiVersion: "2025-02-24.acacia",
      typescript: true,
      appInfo: {
        name: "Briv",
        version: "0.1.0",
      },
    })
  : (null as unknown as Stripe);

export function assertStripe(): Stripe {
  if (!stripe) {
    throw new Error("Stripe is not configured. Set STRIPE_SECRET_KEY.");
  }
  return stripe;
}
