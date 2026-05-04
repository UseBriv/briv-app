import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { createDocumentSchema } from "@/lib/validation";
import { getCurrentOrgSynced, getCurrentUser } from "@/lib/auth";
import { generateDocumentNumber } from "@/lib/utils";
import type { DocumentType } from "@prisma/client";

export const runtime = "nodejs";

const PREFIX: Record<DocumentType, string> = {
  ESTIMATE: "EST",
  PROPOSAL: "PROP",
  CONTRACT: "CON",
  INVOICE: "INV",
};

export async function GET() {
  const org = await getCurrentOrgSynced();
  if (!org) return new Response("NO_ACTIVE_ORG", { status: 400 });

  const docs = await db.document.findMany({
    where: { orgId: org.id },
    orderBy: { updatedAt: "desc" },
    include: { client: true },
  });
  return Response.json(docs);
}

export async function POST(req: NextRequest) {
  const org = await getCurrentOrgSynced();
  if (!org) return new Response("NO_ACTIVE_ORG", { status: 400 });
  const user = await getCurrentUser();
  if (!user) return new Response("UNAUTHORIZED", { status: 401 });

  const parsed = createDocumentSchema.safeParse(await req.json());
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const input = parsed.data;

  const subtotalCents = input.lineItems.reduce(
    (acc, li) => acc + Math.round(li.quantity * li.unitCents),
    0,
  );
  const taxCents = Math.round(subtotalCents * input.taxRate);
  const totalCents = subtotalCents + taxCents;

  const seqCount = await db.document.count({
    where: { orgId: org.id, type: input.type },
  });
  const number = generateDocumentNumber(PREFIX[input.type], seqCount + 1);

  const doc = await db.document.create({
    data: {
      orgId: org.id,
      authorId: user.id,
      clientId: input.clientId,
      type: input.type,
      title: input.title,
      currency: input.currency,
      taxRate: input.taxRate,
      subtotalCents,
      taxCents,
      totalCents,
      number,
      dueAt: input.dueAt ? new Date(input.dueAt) : null,
      lineItems: {
        create: input.lineItems.map((li, idx) => ({
          position: idx,
          description: li.description,
          quantity: li.quantity,
          unitCents: li.unitCents,
          totalCents: Math.round(li.quantity * li.unitCents),
        })),
      },
      events: {
        create: { type: "CREATED", actor: user.id },
      },
    },
  });

  return Response.json(doc, { status: 201 });
}
