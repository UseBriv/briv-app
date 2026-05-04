import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getCurrentOrgSynced, requireUser } from "@/lib/auth";
import { getAppUrl } from "@/lib/env";
import { generateShareToken } from "@/lib/signing";

export const runtime = "nodejs";

export async function POST(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const org = await getCurrentOrgSynced();
  if (!org) return new Response("NO_ACTIVE_ORG", { status: 400 });
  const user = await requireUser();

  const existing = await db.document.findFirst({
    where: { id, orgId: org.id },
    select: {
      id: true,
      status: true,
      sentAt: true,
      publicSlug: true,
      shareToken: true,
    },
  });
  if (!existing) return new Response("NOT_FOUND", { status: 404 });
  if (existing.status === "SIGNED" || existing.status === "PAID") {
    return new Response("ALREADY_COMPLETED", { status: 409 });
  }
  if (existing.status === "VOID") {
    return new Response("VOID_DOCUMENT", { status: 409 });
  }

  const sentAt = new Date();
  const shareUrl = `${getAppUrl()}/p/${existing.publicSlug}`;
  const shareToken = existing.shareToken ?? generateShareToken();

  await db.document.update({
    where: { id: existing.id },
    data: {
      status: "SENT",
      sentAt,
      shareToken,
      events: {
        create: {
          type: "SENT",
          actor: user.id,
          metadata: {
            shareUrl,
            sentAt: sentAt.toISOString(),
            resent: Boolean(existing.sentAt),
          },
        },
      },
    },
  });

  return Response.json({
    ok: true,
    status: "SENT",
    sentAt: sentAt.toISOString(),
    shareUrl,
  });
}
