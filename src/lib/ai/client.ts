import Anthropic from "@anthropic-ai/sdk";

const apiKey = process.env.ANTHROPIC_API_KEY;

export const anthropic = apiKey
  ? new Anthropic({ apiKey })
  : (null as unknown as Anthropic);

export const MODELS = {
  default: process.env.CLAUDE_MODEL ?? "claude-sonnet-4-5",
  fast: process.env.CLAUDE_MODEL_FAST ?? "claude-haiku-4-5",
};

export function assertAnthropic(): Anthropic {
  if (!anthropic) {
    throw new Error("Anthropic is not configured. Set ANTHROPIC_API_KEY.");
  }
  return anthropic;
}