import { NextRequest } from "next/server";
import { z } from "zod";
import { detectPricingAnomaly } from "@/lib/ai";
import { auth } from "@clerk/nextjs/server";
import { env } from "@/lib/env";

export const runtime = "nodejs";
export const maxDuration = 60;

const schema = z.object({
  industry: z.enum([
    "construction",
    "design",
    "legal",
    "photography",
    "consulting",
    "other",
  ]),
  region: z.string().max(120).optional(),
  currency: z.string().length(3).optional(),
  lineItems: z
    .array(
      z.object({
        description: z.string(),
        quantity: z.number().positive(),
        unitCents: z.number().int().nonnegative(),
      }),
    )
    .min(1)
    .max(50),
});

export async function POST(req: NextRequest) {
  if (env.hasClerk) {
    const { userId } = await auth();
    if (!userId) return new Response("UNAUTHORIZED", { status: 401 });
  }

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const result = await detectPricingAnomaly(parsed.data);
    return Response.json(result);
  } catch (err) {
    console.error("[ai/detect-pricing-anomaly]", err);
    return new Response(err instanceof Error ? err.message : "AI_ERROR", { status: 500 });
  }
}
