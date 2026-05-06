"use client";

import { OrganizationSwitcher } from "@clerk/nextjs";

export function WorkspaceSwitcher() {
  return (
    <OrganizationSwitcher
      hidePersonal
      afterSelectOrganizationUrl="/dashboard"
      afterCreateOrganizationUrl="/dashboard"
      appearance={{
        elements: {
          organizationSwitcherTrigger: {
            padding: "6px 10px",
            borderRadius: 10,
            border: "1px solid var(--color-line-strong)",
            fontFamily: "var(--font-sans)",
            fontSize: 13,
          },
        },
        variables: {
          colorPrimary: "#0b0b0c",
          colorText: "#0b0b0c",
          colorBackground: "#f4f0e8",
          borderRadius: "10px",
          fontFamily: "var(--font-sans)",
        },
      }}
    />
  );
}
