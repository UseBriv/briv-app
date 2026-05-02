import type { ReactNode } from "react";
import { ensureUserExists } from "@/lib/auth";
import { Sidebar } from "./_components/Sidebar";
import { ConfigBanner } from "./_components/ConfigBanner";
import { env } from "@/lib/env";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  await ensureUserExists();

  return (
    <div
      className="grid min-h-screen"
      style={{
        gridTemplateColumns: "248px 1fr",
        background: "var(--color-paper)",
      }}
    >
      <Sidebar />
      <div className="flex min-h-screen flex-col">
        {(!env.hasClerk || !env.hasDatabase) && <ConfigBanner />}
        {children}
      </div>
    </div>
  );
}
