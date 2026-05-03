import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { assertStripe } from "@/lib/stripe";
import type Stripe from "stripe";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return new Response("WEBHOOK_NOT_CONFIGURED", { status: 500 });

  const sig = req.headers.get("stripe-signature");
  if (!sig) return new Response("MISSING_SIGNATURE", { status: 400 });

  const stripe = assertStripe();
  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch (err) {
    console.error("[webhooks/stripe] verify failed", err);
    return new Response("INVALID_SIGNATURE", { status: 400 });
  }

  switch (event.type) {
    case "payment_intent.succeeded": {
      const intent = event.data.object as Stripe.PaymentIntent;
      const invoice = await db.invoice.findFirst({
        where: { stripeIntentId: intent.id },
      });
      if (invoice) {
        await db.$transaction([
          db.invoice.update({
            where: { id: invoice.id },
            data: { status: "PAID", paidAt: new Date() },
          }),
          db.document.update({
            where: { id: invoice.documentId },
            data: { status: "PAID", paidAt: new Date() },
          }),
          db.payment.create({
            data: {
              invoiceId: invoice.id,
              stripeChargeId: intent.latest_charge?.toString() ?? null,
              amountCents: intent.amount_received,
              currency: intent.currency.toUpperCase(),
              method: "CARD",
              status: "SUCCEEDED",
            },
          }),
        ]);
      }
      break;
    }

    case "checkout.session.completed":
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      // Plan/subscription sync to Organization.plan can go here.
      break;
  }

  return Response.json({ ok: true });
}
