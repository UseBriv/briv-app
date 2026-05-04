import type { Role } from "@prisma/client";

/** Map Clerk organization membership role strings to Prisma `Role`. */
export function mapClerkMembershipRole(clerkRole: string): Role {
  const r = clerkRole.toLowerCase();
  if (r.includes("admin")) return "ADMIN";
  if (r.includes("owner")) return "OWNER";
  if (r.includes("viewer")) return "VIEWER";
  return "MEMBER";
}
