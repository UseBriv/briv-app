import { NextRequest } from "next/server";
import { Webhook } from "svix";
import { db } from "@/lib/db";
import { mapClerkMembershipRole } from "@/lib/clerk-org-role";
import { syncOrgMembershipFromClerk } from "@/lib/workspace-sync";

export const runtime = "nodejs";

type ClerkEvent =
  | {
      type: "user.created" | "user.updated";
      data: {
        id: string;
        email_addresses: { email_address: string; id: string }[];
        primary_email_address_id?: string | null;
        first_name?: string | null;
        last_name?: string | null;
        image_url?: string | null;
      };
    }
  | {
      type: "user.deleted";
      data: { id: string; deleted?: boolean };
    }
  | {
      type: "organization.created" | "organization.updated";
      data: {
        id: string;
        slug: string;
        name: string;
        image_url?: string | null;
      };
    }
  | {
      type: "organization.deleted";
      data: { id: string };
    }
  | {
      type: "organizationMembership.created" | "organizationMembership.updated";
      data: {
        id: string;
        organization: { id: string };
        public_user_data: { user_id: string };
        role: string;
      };
    }
  | {
      type: "organizationMembership.deleted";
      data: {
        organization: { id: string };
        public_user_data: { user_id: string };
      };
    };

export async function POST(req: NextRequest) {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) return new Response("WEBHOOK_NOT_CONFIGURED", { status: 500 });

  const svixId = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");
  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("MISSING_SVIX_HEADERS", { status: 400 });
  }

  const body = await req.text();
  let event: ClerkEvent;
  try {
    const wh = new Webhook(secret);
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkEvent;
  } catch (err) {
    console.error("[webhooks/clerk] verify failed", err);
    return new Response("INVALID_SIGNATURE", { status: 400 });
  }

  switch (event.type) {
    case "user.created":
    case "user.updated": {
      const primary = event.data.email_addresses.find(
        (e) => e.id === event.data.primary_email_address_id,
      );
      const email = primary?.email_address ?? event.data.email_addresses[0]?.email_address;
      if (!email) break;
      await db.user.upsert({
        where: { clerkId: event.data.id },
        create: {
          clerkId: event.data.id,
          email,
          firstName: event.data.first_name ?? null,
          lastName: event.data.last_name ?? null,
          imageUrl: event.data.image_url ?? null,
        },
        update: {
          email,
          firstName: event.data.first_name ?? null,
          lastName: event.data.last_name ?? null,
          imageUrl: event.data.image_url ?? null,
        },
      });
      break;
    }

    case "user.deleted":
      if (event.data.id) {
        await db.user.deleteMany({ where: { clerkId: event.data.id } });
      }
      break;

    case "organization.created":
    case "organization.updated":
      await db.organization.upsert({
        where: { clerkId: event.data.id },
        create: {
          clerkId: event.data.id,
          slug: event.data.slug,
          name: event.data.name,
          logoUrl: event.data.image_url ?? null,
        },
        update: {
          slug: event.data.slug,
          name: event.data.name,
          logoUrl: event.data.image_url ?? null,
        },
      });
      break;

    case "organization.deleted":
      await db.organization.deleteMany({ where: { clerkId: event.data.id } });
      break;

    case "organizationMembership.created":
    case "organizationMembership.updated": {
      const synced = await syncOrgMembershipFromClerk({
        clerkUserId: event.data.public_user_data.user_id,
        clerkOrgId: event.data.organization.id,
      });
      if (synced.ok) break;

      const user = await db.user.findUnique({
        where: { clerkId: event.data.public_user_data.user_id },
      });
      const org = await db.organization.findUnique({
        where: { clerkId: event.data.organization.id },
      });
      if (!user || !org) break;

      const role = mapClerkMembershipRole(event.data.role);
      await db.membership.upsert({
        where: { userId_orgId: { userId: user.id, orgId: org.id } },
        create: { userId: user.id, orgId: org.id, role },
        update: { role },
      });
      break;
    }

    case "organizationMembership.deleted": {
      const user = await db.user.findUnique({
        where: { clerkId: event.data.public_user_data.user_id },
      });
      const org = await db.organization.findUnique({
        where: { clerkId: event.data.organization.id },
      });
      if (!user || !org) break;
      await db.membership.deleteMany({
        where: { userId: user.id, orgId: org.id },
      });
      break;
    }
  }

  return Response.json({ ok: true });
}
