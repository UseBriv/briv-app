import { NextRequest } from "next/server";
import { z } from "zod";
import { analyzeClauses } from "@/lib/ai";
import { auth } from "@clerk/nextjs/server";
import { env } from "@/lib/env";

export const runtime = "nodejs";
export const maxDuration = 60;

const schema = z.object({
  contractText: z.string().min(20).max(50000),
  perspective: z.enum(["sender", "recipient"]).optional(),
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
    const analysis = await analyzeClauses(parsed.data);
    return Response.json(analysis);
  } catch (err) {
    console.error("[ai/analyze-clauses]", err);
    return new Response(err instanceof Error ? err.message : "AI_ERROR", { status: 500 });
  }
}
