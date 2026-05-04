import { TopBar } from "../_components/TopBar";
import { getCurrentUser, getCurrentOrg } from "@/lib/auth";
import { env } from "@/lib/env";
import { SettingsAccountEditor } from "./_components/SettingsAccountEditor";
import { SettingsWorkspaceEditor } from "./_components/SettingsWorkspaceEditor";

function formatPlan(plan: string | undefined | null): string {
  if (!plan) return "—";
  const words = plan.replace(/_/g, " ").toLowerCase().split(" ");
  return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

export default async function SettingsPage() {
  const user = await getCurrentUser();
  const org = await getCurrentOrg();

  const accountFirst = user?.firstName ?? "";
  const accountLast = user?.lastName ?? "";
  const accountEmail = user?.email ?? "";

  return (
    <>
      <TopBar title="Settings" />
      <main className="px-8 py-8">
        <div className="grid gap-6" style={{ maxWidth: 720 }}>
          <Card title="Account" subtitle="Your personal Briv profile.">
            {env.hasClerk ? (
              <SettingsAccountEditor
                initialFirstName={accountFirst}
                initialLastName={accountLast}
                initialEmail={accountEmail}
              />
            ) : (
              <>
                <Field
                  label="Name"
                  value={`${accountFirst} ${accountLast}`.trim() || "—"}
                />
                <Field label="Email" value={accountEmail || "—"} />
              </>
            )}
          </Card>

          <Card title="Workspace" subtitle="Your team’s shared workspace.">
            {env.hasClerk ? (
              <SettingsWorkspaceEditor
                initialName={org?.name ?? ""}
                planLabel={formatPlan(org?.plan)}
              />
            ) : (
              <>
                <Field label="Name" value={org?.name ?? "—"} />
                <Field label="Plan" value={formatPlan(org?.plan)} />
              </>
            )}
          </Card>
        </div>
      </main>
    </>
  );
}

function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-[16px] border p-6"
      style={{ background: "var(--color-cream)", borderColor: "var(--color-line)" }}
    >
      <h3
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: 24,
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h3>
      <p style={{ color: "var(--color-muted)", fontSize: 14, marginTop: 4, marginBottom: 18 }}>
        {subtitle}
      </p>
      <div className="grid gap-3">{children}</div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="grid items-center"
      style={{
        gridTemplateColumns: "180px 1fr",
        padding: "10px 0",
        borderTop: "1px solid var(--color-line)",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "var(--color-muted-2)",
        }}
      >
        {label}
      </span>
      <span style={{ fontSize: 14 }}>{value}</span>
    </div>
  );
}
