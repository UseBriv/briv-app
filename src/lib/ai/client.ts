import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

export const openai = apiKey
  ? new OpenAI({ apiKey })
  : (null as unknown as OpenAI);

export const MODELS = {
  smart: process.env.OPENAI_MODEL ?? "gpt-4o",
  fast: process.env.OPENAI_MODEL_FAST ?? "gpt-4o-mini",
} as const;

export function assertOpenAI(): OpenAI {
  if (!openai) {
    throw new Error("OpenAI is not configured. Set OPENAI_API_KEY.");
  }
  return openai;
}
