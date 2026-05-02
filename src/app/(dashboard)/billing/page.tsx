import { TopBar } from "../_components/TopBar";
import { getCurrentOrg } from "@/lib/auth";

export default async function BillingPage() {
  const org = await getCurrentOrg();
  return (
    <>
      <TopBar title="Billing" />
      <main className="px-8 py-8">
        <div
          className="rounded-[16px] border p-8"
          style={{
            background: "var(--color-cream)",
            borderColor: "var(--color-line)",
            maxWidth: 720,
          }}
        >
          <span className="pill" style={{ marginBottom: 16 }}>
            <span className="dot" /> CURRENT PLAN · {org?.plan ?? "—"}
          </span>
          <h3
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 32,
              letterSpacing: "-0.02em",
            }}
          >
            Manage your subscription
          </h3>
          <p style={{ color: "var(--color-muted)", marginTop: 8 }}>
            Upgrade, downgrade, or update your payment method. Stripe-managed.
          </p>
          <button
            className="btn btn-primary mt-6"
            type="button"
            disabled
            title="Wire to /api/stripe/portal"
          >
            Open Stripe portal
          </button>
        </div>
      </main>
    </>
  );
}
