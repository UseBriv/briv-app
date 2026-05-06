import { z } from "zod";
import { assertAnthropic, MODELS } from "./client";
import { SYSTEM_CLAUSE } from "./prompts";
import type { ClauseAnalysis } from "./types";

const responseSchema = z.object({
  overallRisk: z.enum(["low", "medium", "high"]),
  findings: z.array(
    z.object({
      clauseTitle: z.string(),
      excerpt: z.string(),
      risk: z.enum(["low", "medium", "high"]),
      category: z.enum([
        "payment",
        "termination",
        "liability",
        "ip",
        "confidentiality",
        "scope",
        "warranty",
        "indemnification",
        "governing_law",
        "other",
      ]),
      summary: z.string(),
      suggestion: z.string(),
    }),
  ),
  missingClauses: z.array(z.string()),
  recommendation: z.string(),
});

export type AnalyzeClausesInput = {
  contractText: string;
  perspective?: "sender" | "recipient";
};

export async function analyzeClauses(input: AnalyzeClausesInput): Promise<ClauseAnalysis> {
  const client = assertAnthropic();

  const message = await client.messages.create({
    model: MODELS.smart,
    max_tokens: 4096,
    temperature: 0.2,
    system: SYSTEM_CLAUSE,
    messages: [
      {
        role: "user",
        content: `Perspective: ${input.perspective ?? "sender"}.
Analyze the contract below and return JSON in this shape:
{
  "overallRisk": "low"|"medium"|"high",
  "findings": [{ "clauseTitle": string, "excerpt": string, "risk": "low"|"medium"|"high", "category": "payment"|"termination"|"liability"|"ip"|"confidentiality"|"scope"|"warranty"|"indemnification"|"governing_law"|"other", "summary": string, "suggestion": string }],
  "missingClauses": string[],
  "recommendation": string
}

Respond with ONLY valid JSON. No markdown fences, no preamble, no commentary.

Contract:
"""
${input.contractText.slice(0, 18000)}
"""`,
      },
      { role: "assistant", content: "{" },
    ],
  });

  const block = message.content[0];
  if (!block || block.type !== "text") throw new Error("AI_NO_RESPONSE");

  // Re-prepend the "{" prefill so the JSON parses cleanly
  const raw = "{" + block.text;
  return responseSchema.parse(JSON.parse(raw));
}