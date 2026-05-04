import { NextRequest } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { getCurrentOrgSynced } from "@/lib/auth";

export const runtime = "nodejs";

const documentTypeSchema = z.enum(["ESTIMATE", "PROPOSAL", "CONTRACT", "INVOICE"]);

const templateSchema = z.object({
  name: z.string().min(1).max(120),
  type: documentTypeSchema,
  body: z
    .object({
      title: z.string().min(1).max(200).optional(),
      currency: z.string().length(3).optional(),
      taxRate: z.number().min(0).max(1).optional(),
    })
    .optional(),
  lineItems: z
    .array(
      z.object({
        description: z.string().min(1).max(500),
        quantity: z.number().positive(),
        unitCents: z.number().int().nonnegative(),
      }),
    )
    .default([]),
});

export async function GET(req: NextRequest) {
  const org = await getCurrentOrgSynced();
  if (!org) return new Response("NO_ACTIVE_ORG", { status: 400 });

  const { searchParams } = new URL(req.url);
  const requestedType = searchParams.get("type");
  const type = requestedType ? documentTypeSchema.safeParse(requestedType) : null;
  if (requestedType && !type?.success) {
    return new Response("INVALID_TEMPLATE_TYPE", { status: 400 });
  }

  const templates = await db.template.findMany({
    where: {
      orgId: org.id,
      ...(type?.success ? { type: type.data } : {}),
    },
    orderBy: { updatedAt: "desc" },
  });
  return Response.json(templates);
}

export async function POST(req: NextRequest) {
  const org = await getCurrentOrgSynced();
  if (!org) return new Response("NO_ACTIVE_ORG", { status: 400 });

  const parsed = templateSchema.safeParse(await req.json());
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const template = await db.template.create({
    data: {
      orgId: org.id,
      name: parsed.data.name,
      type: parsed.data.type,
      body: parsed.data.body ?? Prisma.JsonNull,
      lineItems: parsed.data.lineItems,
    },
  });

  return Response.json(template, { status: 201 });
}
