import type { ReactNode } from "react";
import { ensureDashboardIdentity, getCurrentOrg } from "@/lib/auth";
import { checkDatabaseReachable } from "@/lib/db";
import { Sidebar } from "./_components/Sidebar";
import { ConfigBanner } from "./_components/ConfigBanner";
import { NoActiveWorkspaceBanner } from "./_components/NoActiveWorkspaceBanner";
import { env } from "@/lib/env";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const dbReachable = env.hasDatabase ? await checkDatabaseReachable() : true;

  if (env.hasDatabase && !dbReachable) {
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
          <div
            className="px-8 py-4"
            style={{
              background: "var(--color-ember)",
              color: "var(--color-cream)",
              fontFamily: "var(--font-mono)",
              fontSize: 12,
            }}
          >
            Postgres unreachable — replace <code style={{ opacity: 0.95 }}>DATABASE_URL</code> in{" "}
            <code>.env.local</code> with your Neon connection string (not the{" "}
            <code>host:5432</code> placeholder).
          </div>
          <main className="px-8 py-12" style={{ maxWidth: 560 }}>
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 28,
                letterSpacing: "-0.02em",
                marginBottom: 12,
              }}
            >
              Dashboard needs a database
            </h2>
            <p style={{ color: "var(--color-muted)", lineHeight: 1.6, marginBottom: 16 }}>
              Create a free project at{" "}
              <a href="https://neon.tech" className="underline" style={{ color: "var(--color-ink)" }}>
                neon.tech
              </a>
              , copy the pooled connection URL, set <code>DATABASE_URL</code> and{" "}
              <code>DIRECT_URL</code>, then run <code>npx prisma db push</code> from the repo root.
            </p>
          </main>
        </div>
      </div>
    );
  }

  await ensureDashboardIdentity();
  const org = await getCurrentOrg();

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
        {env.hasClerk && env.hasDatabase && !org && <NoActiveWorkspaceBanner />}
        {children}
      </div>
    </div>
  );
}
