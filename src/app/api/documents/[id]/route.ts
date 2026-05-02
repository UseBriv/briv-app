import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { updateDocumentSchema } from "@/lib/validation";
import { getCurrentOrg, requireUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const org = await getCurrentOrg();
  if (!org) return new Response("NO_ACTIVE_ORG", { status: 400 });

  const doc = await db.document.findFirst({
    where: { id, orgId: org.id },
    include: { lineItems: true, client: true, signatures: true, events: true },
  });
  if (!doc) return new Response("NOT_FOUND", { status: 404 });
  return Response.json(doc);
}

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const user = await requireUser();
  const org = await getCurrentOrg();
  if (!org) return new Response("NO_ACTIVE_ORG", { status: 400 });

  const parsed = updateDocumentSchema.safeParse(await req.json());
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const input = parsed.data;

  const existing = await db.document.findFirst({
    where: { id, orgId: org.id },
    include: { lineItems: true },
  });
  if (!existing) return new Response("NOT_FOUND", { status: 404 });

  const lineItems = input.lineItems ?? existing.lineItems.map((li) => ({
    description: li.description,
    quantity: Number(li.quantity),
    unitCents: li.unitCents,
  }));

  const taxRate = input.taxRate ?? Number(existing.taxRate);
  const subtotalCents = lineItems.reduce(
    (acc, li) => acc + Math.round(li.quantity * li.unitCents),
    0,
  );
  const taxCents = Math.round(subtotalCents * taxRate);
  const totalCents = subtotalCents + taxCents;

  const doc = await db.document.update({
    where: { id },
    data: {
      title: input.title,
      status: input.status,
      currency: input.currency,
      taxRate,
      subtotalCents,
      taxCents,
      totalCents,
      dueAt: input.dueAt ? new Date(input.dueAt) : undefined,
      ...(input.lineItems
        ? {
            lineItems: {
              deleteMany: {},
              create: input.lineItems.map((li, idx) => ({
                position: idx,
                description: li.description,
                quantity: li.quantity,
                unitCents: li.unitCents,
                totalCents: Math.round(li.quantity * li.unitCents),
              })),
            },
          }
        : {}),
      events: { create: { type: "EDITED", actor: user.id } },
    },
  });

  return Response.json(doc);
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const org = await getCurrentOrg();
  if (!org) return new Response("NO_ACTIVE_ORG", { status: 400 });

  const existing = await db.document.findFirst({ where: { id, orgId: org.id } });
  if (!existing) return new Response("NOT_FOUND", { status: 404 });

  await db.document.delete({ where: { id } });
  return new Response(null, { status: 204 });
}
