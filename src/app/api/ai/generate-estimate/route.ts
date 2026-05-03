import { NextRequest } from "next/server";
import { aiEstimateSchema } from "@/lib/validation";
import { generateEstimate } from "@/lib/ai";
import { auth } from "@clerk/nextjs/server";
import { env } from "@/lib/env";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  if (env.hasClerk) {
    const { userId } = await auth();
    if (!userId) return new Response("UNAUTHORIZED", { status: 401 });
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return new Response("INVALID_JSON", { status: 400 });
  }

  const parsed = aiEstimateSchema.safeParse(payload);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const estimate = await generateEstimate(parsed.data);
    return Response.json(estimate);
  } catch (err) {
    console.error("[ai/generate-estimate]", err);
    const message = err instanceof Error ? err.message : "AI_ERROR";
    return new Response(message, { status: 500 });
  }
}
