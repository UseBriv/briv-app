import type { ReactNode } from "react";
import { ensureUserExists } from "@/lib/auth";
import { Sidebar } from "./_components/Sidebar";

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
      <div className="flex min-h-screen flex-col">{children}</div>
    </div>
  );
}
