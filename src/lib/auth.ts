import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "./db";
import { env } from "./env";
import { syncWorkspaceFromSession } from "./workspace-sync";

export async function getCurrentUser() {
  if (!env.hasClerk || !env.hasDatabase) return null;

  const { userId } = await auth();
  if (!userId) return null;

  const user = await db.user.findUnique({
    where: { clerkId: userId },
    include: {
      memberships: {
        include: { org: true },
      },
    },
  });

  return user;
}

export async function getCurrentOrg() {
  if (!env.hasClerk || !env.hasDatabase) return null;

  const { orgId } = await auth();
  if (!orgId) return null;

  return db.organization.findUnique({
    where: { clerkId: orgId },
  });
}

/** For API routes: mirror Clerk org into Prisma, then resolve the active org row. */
export async function getCurrentOrgSynced() {
  await ensureDashboardIdentity();
  return getCurrentOrg();
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  return user;
}

export async function requireOrg() {
  const org = await getCurrentOrg();
  if (!org) throw new Error("NO_ACTIVE_ORG");
  return org;
}

export async function ensureUserExists() {
  if (!env.hasClerk || !env.hasDatabase) return null;

  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const primary = clerkUser.emailAddresses.find(
    (e) => e.id === clerkUser.primaryEmailAddressId,
  );
  const email = primary?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress;
  if (!email) return null;

  return db.user.upsert({
    where: { clerkId: clerkUser.id },
    update: {
      email,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      imageUrl: clerkUser.imageUrl,
    },
    create: {
      clerkId: clerkUser.id,
      email,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      imageUrl: clerkUser.imageUrl,
    },
  });
}

/** User row + active Clerk org/membership mirrored into Prisma (safe to call every dashboard load). */
export async function ensureDashboardIdentity() {
  await ensureUserExists();
  await syncWorkspaceFromSession();
}
