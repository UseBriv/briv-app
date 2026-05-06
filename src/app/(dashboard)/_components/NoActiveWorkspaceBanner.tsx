"use client";

import { OrganizationList } from "@clerk/nextjs";

/**
 * Shown when the user is signed in but has no active Clerk organization.
 * Briv is org-scoped; picking or creating a workspace activates `orgId` in the session.
 */
export function NoActiveWorkspaceBanner() {
  return (
    <div
      className="border-b px-8 py-5"
      style={{
        background: "rgba(45,43,255,0.06)",
        borderColor: "var(--color-line)",
      }}
    >
      <div className="mb-3" style={{ fontFamily: "var(--font-serif)", fontSize: 18, letterSpacing: "-0.02em" }}>
        Choose a workspace
      </div>
      <p className="mb-4 max-w-xl text-sm" style={{ color: "var(--color-muted)" }}>
        Select an organization or create one so documents, clients, and billing stay in the right
        place. Your team shares each workspace.
      </p>
      <OrganizationList
        hidePersonal
        afterSelectOrganizationUrl="/dashboard"
        afterCreateOrganizationUrl="/dashboard"
        appearance={{
          variables: {
            colorPrimary: "#0b0b0c",
            colorText: "#0b0b0c",
            colorBackground: "#fbf8f1",
            borderRadius: "12px",
            fontFamily: "var(--font-sans)",
          },
        }}
      />
    </div>
  );
}
