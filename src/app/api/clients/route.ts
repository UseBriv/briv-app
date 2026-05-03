import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { clientSchema } from "@/lib/validation";
import { getCurrentOrg } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  const org = await getCurrentOrg();
  if (!org) return new Response("NO_ACTIVE_ORG", { status: 400 });

  const clients = await db.client.findMany({
    where: { orgId: org.id },
    orderBy: { name: "asc" },
  });
  return Response.json(clients);
}

export async function POST(req: NextRequest) {
  const org = await getCurrentOrg();
  if (!org) return new Response("NO_ACTIVE_ORG", { status: 400 });

  const parsed = clientSchema.safeParse(await req.json());
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const client = await db.client.create({
    data: {
      orgId: org.id,
      name: parsed.data.name,
      email: parsed.data.email || undefined,
      phone: parsed.data.phone,
      company: parsed.data.company,
      address: parsed.data.address,
      notes: parsed.data.notes,
    },
  });
  return Response.json(client, { status: 201 });
}
