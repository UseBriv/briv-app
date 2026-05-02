import { z } from "zod";
import { assertOpenAI, MODELS } from "./client";
import { SYSTEM_ESTIMATE } from "./prompts";
import type { AiEstimate, Industry } from "./types";

const estimateResponseSchema = z.object({
  title: z.string(),
  industry: z.enum([
    "construction",
    "design",
    "legal",
    "photography",
    "consulting",
    "other",
  ]),
  clientName: z.string().nullable(),
  currency: z.string().length(3),
  lineItems: z
    .array(
      z.object({
        description: z.string(),
        quantity: z.number().positive(),
        unitCents: z.number().int().nonnegative(),
        totalCents: z.number().int().nonnegative(),
        rationale: z.string().optional(),
      }),
    )
    .min(1)
    .max(12),
  subtotalCents: z.number().int().nonnegative(),
  taxRate: z.number().min(0).max(1),
  taxCents: z.number().int().nonnegative(),
  totalCents: z.number().int().nonnegative(),
  scopeNotes: z.array(z.string()).default([]),
  termsAndConditions: z.array(z.string()).default([]),
  estimatedTimeline: z.string().nullable(),
  confidence: z.number().min(0).max(1),
});

export type GenerateEstimateInput = {
  prompt: string;
  industry?: Industry;
  budgetCents?: number;
  currency?: string;
  clientName?: string;
};

export async function generateEstimate(input: GenerateEstimateInput): Promise<AiEstimate> {
  const client = assertOpenAI();

  const userPayload = {
    brief: input.prompt,
    industry: input.industry ?? null,
    budgetCents: input.budgetCents ?? null,
    currency: input.currency ?? "USD",
    clientName: input.clientName ?? null,
  };

  const completion = await client.chat.completions.create({
    model: MODELS.smart,
    temperature: 0.4,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_ESTIMATE },
      {
        role: "user",
        content: `Generate an estimate as a JSON object matching this exact shape:
{
  "title": string,
  "industry": "construction"|"design"|"legal"|"photography"|"consulting"|"other",
  "clientName": string | null,
  "currency": "USD",
  "lineItems": [{ "description": string, "quantity": number, "unitCents": int, "totalCents": int, "rationale": string }],
  "subtotalCents": int,
  "taxRate": number (0..1),
  "taxCents": int,
  "totalCents": int,
  "scopeNotes": string[],
  "termsAndConditions": string[],
  "estimatedTimeline": string | null,
  "confidence": number (0..1)
}

Brief: ${JSON.stringify(userPayload)}`,
      },
    ],
  });

  const raw = completion.choices[0]?.message.content;
  if (!raw) throw new Error("AI_NO_RESPONSE");

  const parsed = estimateResponseSchema.parse(JSON.parse(raw));

  // Recompute totals server-side to guarantee math invariants.
  const recomputedSubtotal = parsed.lineItems.reduce(
    (sum, item) => sum + item.totalCents,
    0,
  );
  const taxCents = Math.round(recomputedSubtotal * parsed.taxRate);
  const totalCents = recomputedSubtotal + taxCents;

  return {
    ...parsed,
    subtotalCents: recomputedSubtotal,
    taxCents,
    totalCents,
  };
}
