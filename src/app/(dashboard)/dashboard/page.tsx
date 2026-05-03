import Link from "next/link";
import { TopBar } from "../_components/TopBar";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { getCurrentUser, getCurrentOrg } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function DashboardHome() {
  const user = await getCurrentUser();
  const org = await getCurrentOrg();

  const [documents, openInvoiceAggregate] = await Promise.all([
    org
      ? db.document.findMany({
          where: { orgId: org.id },
          orderBy: { updatedAt: "desc" },
          take: 5,
          include: { client: true },
        })
      : Promise.resolve([]),
    org
      ? db.invoice.aggregate({
          where: { orgId: org.id, status: "OPEN" },
          _sum: { amountCents: true },
          _count: true,
        })
      : Promise.resolve({ _sum: { amountCents: 0 }, _count: 0 } as const),
  ]);

  const stats = [
    {
      label: "Open balance",
      value: formatCurrency(openInvoiceAggregate._sum.amountCents ?? 0),
    },
    {
      label: "Outstanding invoices",
      value: String(openInvoiceAggregate._count ?? 0),
    },
    { label: "Acceptance rate", value: "—" },
    { label: "Avg time to sign", value: "—" },
  ];

  return (
    <>
      <TopBar title={`Hi${user?.firstName ? `, ${user.firstName}` : ""} 👋`} />
      <main className="px-8 py-8">
        <section
          className="grid gap-4"
          style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
        >
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-[16px] border p-6"
              style={{
                background: "var(--color-cream)",
                borderColor: "var(--color-line)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--color-muted-2)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  marginBottom: 12,
                }}
              >
                {s.label}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 36,
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                {s.value}
              </div>
            </div>
          ))}
        </section>

        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h3
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 28,
                letterSpacing: "-0.01em",
              }}
            >
              Recent documents
            </h3>
            <Link href="/documents" className="btn btn-ghost" style={{ padding: "8px 14px" }}>
              View all <ArrowIcon size={12} />
            </Link>
          </div>

          <div
            className="overflow-hidden rounded-[16px] border"
            style={{
              background: "var(--color-cream)",
              borderColor: "var(--color-line)",
            }}
          >
            {documents.length === 0 ? (
              <EmptyState />
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
                    <th style={{ textAlign: "left", padding: "14px 20px" }}>Number</th>
                    <th style={{ textAlign: "left", padding: "14px 20px" }}>Title</th>
                    <th style={{ textAlign: "left", padding: "14px 20px" }}>Client</th>
                    <th style={{ textAlign: "left", padding: "14px 20px" }}>Status</th>
                    <th style={{ textAlign: "right", padding: "14px 20px" }}>Total</th>
                    <th style={{ textAlign: "right", padding: "14px 20px" }}>Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => (
                    <tr
                      key={doc.id}
                      style={{ borderTop: "1px solid var(--color-line)", fontSize: 14 }}
                    >
                      <td style={{ padding: "14px 20px", fontFamily: "var(--font-mono)" }}>
                        <Link href={`/documents/${doc.id}`}>{doc.number}</Link>
                      </td>
                      <td style={{ padding: "14px 20px" }}>{doc.title}</td>
                      <td style={{ padding: "14px 20px", color: "var(--color-muted)" }}>
                        {doc.client?.name ?? "—"}
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <StatusPill status={doc.status} />
                      </td>
                      <td
                        style={{
                          padding: "14px 20px",
                          textAlign: "right",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        {formatCurrency(doc.totalCents, doc.currency)}
                      </td>
                      <td
                        style={{
                          padding: "14px 20px",
                          textAlign: "right",
                          color: "var(--color-muted)",
                        }}
                      >
                        {formatDate(doc.updatedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

function StatusPill({ status }: { status: string }) {
  const palette: Record<string, { bg: string; fg: string }> = {
    DRAFT: { bg: "var(--color-paper-2)", fg: "var(--color-ink)" },
    SENT: { bg: "rgba(45,43,255,0.12)", fg: "var(--color-indigo-brand)" },
    VIEWED: { bg: "rgba(45,43,255,0.12)", fg: "var(--color-indigo-brand)" },
    SIGNED: { bg: "rgba(212,255,58,0.35)", fg: "var(--color-ink)" },
    PAID: { bg: "var(--color-ink)", fg: "var(--color-lime)" },
    OVERDUE: { bg: "rgba(255,90,31,0.18)", fg: "var(--color-ember)" },
    DECLINED: { bg: "rgba(255,90,31,0.18)", fg: "var(--color-ember)" },
    VOID: { bg: "var(--color-paper-3)", fg: "var(--color-muted)" },
  };
  const c = palette[status] ?? palette.DRAFT;
  return (
    <span
      style={{
        display: "inline-block",
        padding: "3px 10px",
        borderRadius: 999,
        background: c.bg,
        color: c.fg,
        fontFamily: "var(--font-mono)",
        fontSize: 10,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
      }}
    >
      {status}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
      <div
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: 32,
          letterSpacing: "-0.02em",
          marginBottom: 12,
        }}
      >
        Nothing here yet.
      </div>
      <p
        style={{
          color: "var(--color-muted)",
          maxWidth: 380,
          marginBottom: 24,
        }}
      >
        Type a one-line brief and Briv will draft your first estimate in seconds.
      </p>
      <Link href="/documents/new" className="btn btn-primary">
        Draft your first document <ArrowIcon size={12} />
      </Link>
    </div>
  );
}
