import { z } from "zod";
import { assertOpenAI, MODELS } from "./client";
import { SYSTEM_PRICING } from "./prompts";
import type { Industry, PricingAnalysis } from "./types";

const responseSchema = z.object({
  anomalies: z.array(
    z.object({
      lineItemIndex: z.number().int().nonnegative(),
      description: z.string(),
      proposedCents: z.number().int().nonnegative(),
      expectedRangeCents: z.object({
        min: z.number().int().nonnegative(),
        max: z.number().int().nonnegative(),
      }),
      deviationPct: z.number(),
      severity: z.enum(["info", "warn", "alert"]),
      reason: z.string(),
    }),
  ),
  summary: z.string(),
  totalDeltaPct: z.number(),
});

export type DetectPricingAnomalyInput = {
  industry: Industry;
  region?: string;
  currency?: string;
  lineItems: Array<{ description: string; quantity: number; unitCents: number }>;
};

export async function detectPricingAnomaly(
  input: DetectPricingAnomalyInput,
): Promise<PricingAnalysis> {
  const client = assertOpenAI();

  const completion = await client.chat.completions.create({
    model: MODELS.fast,
    temperature: 0.1,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PRICING },
      {
        role: "user",
        content: `Industry: ${input.industry}
Region: ${input.region ?? "United States"}
Currency: ${input.currency ?? "USD"}

Line items (zero-indexed):
${input.lineItems
  .map(
    (li, i) =>
      `[${i}] ${li.description} — qty ${li.quantity} @ ${(li.unitCents / 100).toFixed(2)} = ${(
        (li.quantity * li.unitCents) /
        100
      ).toFixed(2)}`,
  )
  .join("\n")}

Return JSON:
{
  "anomalies": [{ "lineItemIndex": int, "description": string, "proposedCents": int, "expectedRangeCents": { "min": int, "max": int }, "deviationPct": number, "severity": "info"|"warn"|"alert", "reason": string }],
  "summary": string,
  "totalDeltaPct": number
}`,
      },
    ],
  });

  const raw = completion.choices[0]?.message.content;
  if (!raw) throw new Error("AI_NO_RESPONSE");

  return responseSchema.parse(JSON.parse(raw));
}
