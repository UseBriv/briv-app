import { z } from "zod";
import { assertOpenAI, MODELS } from "./client";
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
  const client = assertOpenAI();

  const completion = await client.chat.completions.create({
    model: MODELS.smart,
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_CLAUSE },
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

Contract:
"""
${input.contractText.slice(0, 18000)}
"""`,
      },
    ],
  });

  const raw = completion.choices[0]?.message.content;
  if (!raw) throw new Error("AI_NO_RESPONSE");

  return responseSchema.parse(JSON.parse(raw));
}
