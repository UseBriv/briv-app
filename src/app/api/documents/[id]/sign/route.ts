import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import {
  buildDocumentSigningSnapshot,
  computeSigningSnapshotHash,
} from "@/lib/signing";

export const runtime = "nodejs";

const schema = z.object({
  signerName: z.string().min(1).max(200),
  signerEmail: z.string().email(),
  imageData: z.string().optional(),
  acceptTerms: z.literal(true),
  shareToken: z.string().min(8),
});

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const doc = await db.document.findUnique({
    where: { id },
    include: { lineItems: { orderBy: { position: "asc" } } },
  });
  if (!doc) return new Response("NOT_FOUND", { status: 404 });
  if (!doc.shareToken) return new Response("DOCUMENT_NOT_SENDABLE", { status: 409 });
  if (doc.shareToken !== parsed.data.shareToken) {
    return new Response("FORBIDDEN", { status: 403 });
  }
  if (doc.status === "SIGNED" || doc.status === "PAID") {
    return new Response("ALREADY_SIGNED", { status: 409 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const userAgent = req.headers.get("user-agent") ?? null;
  const consentText =
    "By signing, you agree this electronic signature is legally binding for this document.";
  const signingSnapshot = buildDocumentSigningSnapshot({
    id: doc.id,
    publicSlug: doc.publicSlug,
    number: doc.number,
    title: doc.title,
    type: doc.type,
    currency: doc.currency,
    taxRate: doc.taxRate.toString(),
    subtotalCents: doc.subtotalCents,
    taxCents: doc.taxCents,
    totalCents: doc.totalCents,
    body: doc.body,
    lineItems: doc.lineItems.map((li) => ({
      description: li.description,
      quantity: li.quantity.toString(),
      unitCents: li.unitCents,
      totalCents: li.totalCents,
    })),
  });
  const snapshotHash = computeSigningSnapshotHash(signingSnapshot);
  const signedAt = new Date();

  const signature = await db.signature.create({
    data: {
      documentId: doc.id,
      signerName: parsed.data.signerName,
      signerEmail: parsed.data.signerEmail,
      imageData: parsed.data.imageData,
      signedAt,
      ipAddress: ip,
      userAgent,
      verified: true,
    },
  });

  await db.document.update({
    where: { id: doc.id },
    data: {
      status: "SIGNED",
      signedAt,
      events: {
        create: {
          type: "SIGNED",
          actor: "client",
          metadata: {
            signatureId: signature.id,
            ip,
            userAgent,
            signedAt: signedAt.toISOString(),
            consent: {
              accepted: parsed.data.acceptTerms,
              text: consentText,
              version: "v1",
            },
            snapshotHash,
            snapshot: signingSnapshot,
          },
        },
      },
    },
  });

  return Response.json({
    ok: true,
    signatureId: signature.id,
    signedAt: signedAt.toISOString(),
    snapshotHash,
  });
}
