import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "./db";
import { env } from "./env";
import { mapClerkMembershipRole } from "./clerk-org-role";

/**
 * Ensures Prisma `User`, `Organization`, and `Membership` rows exist for the
 * given Clerk IDs by reading Clerk’s Backend API. Covers webhook ordering gaps
 * and local dev without a working webhook tunnel.
 */
export async function syncOrgMembershipFromClerk(params: {
  clerkUserId: string;
  clerkOrgId: string;
}): Promise<{ ok: true } | { ok: false; reason: string }> {
  if (!env.hasClerk || !env.hasDatabase) return { ok: true };

  try {
    const cc = await clerkClient();

    let dbUser = await db.user.findUnique({ where: { clerkId: params.clerkUserId } });
    if (!dbUser) {
      const cu = await cc.users.getUser(params.clerkUserId);
      const email =
        cu.emailAddresses.find((e) => e.id === cu.primaryEmailAddressId)?.emailAddress ??
        cu.emailAddresses[0]?.emailAddress;
      if (!email) return { ok: false, reason: "USER_NO_EMAIL" };

      dbUser = await db.user.upsert({
        where: { clerkId: cu.id },
        create: {
          clerkId: cu.id,
          email,
          firstName: cu.firstName,
          lastName: cu.lastName,
          imageUrl: cu.imageUrl,
        },
        update: {
          email,
          firstName: cu.firstName,
          lastName: cu.lastName,
          imageUrl: cu.imageUrl,
        },
      });
    }

    let dbOrg = await db.organization.findUnique({ where: { clerkId: params.clerkOrgId } });
    if (!dbOrg) {
      const co = await cc.organizations.getOrganization({ organizationId: params.clerkOrgId });
      dbOrg = await db.organization.upsert({
        where: { clerkId: co.id },
        create: {
          clerkId: co.id,
          slug: co.slug,
          name: co.name,
          logoUrl: co.imageUrl || null,
        },
        update: {
          slug: co.slug,
          name: co.name,
          logoUrl: co.imageUrl || null,
        },
      });
    }

    const { data: memberships } = await cc.organizations.getOrganizationMembershipList({
      organizationId: params.clerkOrgId,
      userId: [params.clerkUserId],
      limit: 5,
    });
    const membership = memberships[0];
    if (!membership) return { ok: false, reason: "NOT_A_MEMBER" };

    const role = mapClerkMembershipRole(String(membership.role));
    await db.membership.upsert({
      where: { userId_orgId: { userId: dbUser.id, orgId: dbOrg.id } },
      create: { userId: dbUser.id, orgId: dbOrg.id, role },
      update: { role },
    });

    return { ok: true };
  } catch (err) {
    console.error("[workspace-sync] syncOrgMembershipFromClerk failed", err);
    return { ok: false, reason: "CLERK_OR_DB_ERROR" };
  }
}

/** After sign-in: mirror the active Clerk org + membership into Postgres. */
export async function syncWorkspaceFromSession(): Promise<void> {
  if (!env.hasClerk || !env.hasDatabase) return;

  const { userId, orgId } = await auth();
  if (!userId || !orgId) return;

  await syncOrgMembershipFromClerk({ clerkUserId: userId, clerkOrgId: orgId });
}
