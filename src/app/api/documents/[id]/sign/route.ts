import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

export const runtime = "nodejs";

const schema = z.object({
  signerName: z.string().min(1).max(200),
  signerEmail: z.string().email(),
  imageData: z.string().optional(),
  shareToken: z.string().min(8),
});

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const doc = await db.document.findUnique({ where: { id } });
  if (!doc) return new Response("NOT_FOUND", { status: 404 });
  if (doc.shareToken !== parsed.data.shareToken) {
    return new Response("FORBIDDEN", { status: 403 });
  }
  if (doc.status === "SIGNED" || doc.status === "PAID") {
    return new Response("ALREADY_SIGNED", { status: 409 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const userAgent = req.headers.get("user-agent") ?? null;

  const signature = await db.signature.create({
    data: {
      documentId: doc.id,
      signerName: parsed.data.signerName,
      signerEmail: parsed.data.signerEmail,
      imageData: parsed.data.imageData,
      ipAddress: ip,
      userAgent,
      verified: true,
    },
  });

  await db.document.update({
    where: { id: doc.id },
    data: {
      status: "SIGNED",
      signedAt: new Date(),
      events: {
        create: {
          type: "SIGNED",
          actor: "client",
          metadata: { signatureId: signature.id, ip },
        },
      },
    },
  });

  return Response.json({ ok: true, signatureId: signature.id });
}
