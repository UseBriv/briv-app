import { z } from "zod";
import { assertAnthropic, MODELS } from "./client";
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
  const client = assertAnthropic();

  const userPayload = {
    brief: input.prompt,
    industry: input.industry ?? null,
    budgetCents: input.budgetCents ?? null,
    currency: input.currency ?? "USD",
    clientName: input.clientName ?? null,
  };

  const message = await client.messages.create({
    model: MODELS.default,
    max_tokens: 4096,
    temperature: 0.4,
    system: SYSTEM_ESTIMATE,
    messages: [
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

Respond with ONLY valid JSON. No markdown fences, no preamble, no commentary.

Brief: ${JSON.stringify(userPayload)}`,
      },
      { role: "assistant", content: "{" },
    ],
  });

  const block = message.content[0];
  if (!block || block.type !== "text") throw new Error("AI_NO_RESPONSE");

  // Re-prepend the "{" prefill so the JSON parses cleanly
  const raw = "{" + block.text;
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