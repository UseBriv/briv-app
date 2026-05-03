import { TopBar } from "../_components/TopBar";
import { db } from "@/lib/db";
import { getCurrentOrg } from "@/lib/auth";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function InvoicesPage() {
  const org = await getCurrentOrg();
  const invoices = org
    ? await db.invoice.findMany({
        where: { orgId: org.id },
        orderBy: { createdAt: "desc" },
        include: { document: true },
      })
    : [];

  return (
    <>
      <TopBar title="Invoices" />
      <main className="px-8 py-8">
        <div
          className="overflow-hidden rounded-[16px] border"
          style={{ background: "var(--color-cream)", borderColor: "var(--color-line)" }}
        >
          {invoices.length === 0 ? (
            <div className="px-6 py-20 text-center">
              <div
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 28,
                  letterSpacing: "-0.01em",
                  marginBottom: 12,
                }}
              >
                No invoices yet.
              </div>
              <p style={{ color: "var(--color-muted)" }}>
                Sign a contract or estimate and an invoice will land here automatically.
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "var(--color-muted-2)",
                  }}
                >
                  <th style={{ textAlign: "left", padding: "14px 20px" }}>Document</th>
                  <th style={{ textAlign: "left", padding: "14px 20px" }}>Status</th>
                  <th style={{ textAlign: "right", padding: "14px 20px" }}>Amount</th>
                  <th style={{ textAlign: "right", padding: "14px 20px" }}>Due</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr
                    key={inv.id}
                    style={{ borderTop: "1px solid var(--color-line)", fontSize: 14 }}
                  >
                    <td
                      style={{
                        padding: "14px 20px",
                        fontFamily: "var(--font-mono)",
                        fontSize: 12,
                      }}
                    >
                      {inv.document.number}
                    </td>
                    <td
                      style={{
                        padding: "14px 20px",
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        textTransform: "uppercase",
                        color: "var(--color-muted)",
                      }}
                    >
                      {inv.status}
                    </td>
                    <td
                      style={{
                        padding: "14px 20px",
                        textAlign: "right",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {formatCurrency(inv.amountCents, inv.currency)}
                    </td>
                    <td
                      style={{
                        padding: "14px 20px",
                        textAlign: "right",
                        color: "var(--color-muted)",
                      }}
                    >
                      {inv.dueAt ? formatDate(inv.dueAt) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </>
  );
}
