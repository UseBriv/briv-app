import Link from "next/link";
import { notFound } from "next/navigation";
import { TopBar } from "../../_components/TopBar";
import { db } from "@/lib/db";
import { getCurrentOrg } from "@/lib/auth";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function DocumentDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const org = await getCurrentOrg();
  if (!org) notFound();

  const doc = await db.document.findFirst({
    where: { id, orgId: org.id },
    include: {
      lineItems: { orderBy: { position: "asc" } },
      client: true,
      signatures: { orderBy: { signedAt: "desc" } },
      events: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!doc) notFound();

  return (
    <>
      <TopBar title={`${doc.number} · ${doc.title}`} />
      <main className="px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--color-muted-2)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              {doc.type} · {doc.status}
            </span>
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 36,
                letterSpacing: "-0.02em",
                marginTop: 6,
              }}
            >
              {doc.title}
            </h2>
            <p style={{ color: "var(--color-muted)", marginTop: 4 }}>
              {doc.client?.name ?? "No client"} · created {formatDate(doc.createdAt)}
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/p/${doc.publicSlug}`}
              className="btn btn-ghost"
              style={{ padding: "8px 14px" }}
            >
              Public link
            </Link>
            <Link href="/documents" className="btn btn-primary" style={{ padding: "8px 14px" }}>
              Send
            </Link>
          </div>
        </div>

        <div
          className="rounded-[16px] border p-6"
          style={{ background: "var(--color-cream)", borderColor: "var(--color-line)" }}
        >
          <table className="w-full">
            <tbody>
              {doc.lineItems.map((li) => (
                <tr key={li.id} style={{ borderTop: "1px solid var(--color-line)" }}>
                  <td style={{ padding: "10px 0" }}>{li.description}</td>
                  <td
                    style={{
                      padding: "10px 0",
                      textAlign: "right",
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                      color: "var(--color-muted)",
                    }}
                  >
                    {li.quantity.toString()} × {formatCurrency(li.unitCents, doc.currency)}
                  </td>
                  <td
                    style={{
                      padding: "10px 0",
                      textAlign: "right",
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                      paddingLeft: 16,
                    }}
                  >
                    {formatCurrency(li.totalCents, doc.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div
            className="mt-4 grid"
            style={{
              gridTemplateColumns: "1fr auto",
              gap: "6px 16px",
              borderTop: "1px solid var(--color-line)",
              paddingTop: 16,
            }}
          >
            <span style={{ color: "var(--color-muted)", fontSize: 13 }}>Subtotal</span>
            <span style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 12 }}>
              {formatCurrency(doc.subtotalCents, doc.currency)}
            </span>
            <span style={{ color: "var(--color-muted)", fontSize: 13 }}>Tax</span>
            <span style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 12 }}>
              {formatCurrency(doc.taxCents, doc.currency)}
            </span>
            <span style={{ fontFamily: "var(--font-serif)", fontSize: 18 }}>Total</span>
            <span
              style={{
                textAlign: "right",
                fontFamily: "var(--font-serif)",
                fontSize: 24,
              }}
            >
              {formatCurrency(doc.totalCents, doc.currency)}
            </span>
          </div>
        </div>

        {doc.events.length > 0 && (
          <div className="mt-8">
            <h3
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 24,
                letterSpacing: "-0.01em",
                marginBottom: 12,
              }}
            >
              Activity
            </h3>
            <ul
              className="overflow-hidden rounded-[12px] border"
              style={{ background: "var(--color-cream)", borderColor: "var(--color-line)" }}
            >
              {doc.events.map((event) => (
                <li
                  key={event.id}
                  className="flex items-center justify-between px-4 py-3"
                  style={{ borderTop: "1px solid var(--color-line)" }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "var(--color-muted)",
                    }}
                  >
                    {event.type}
                  </span>
                  <span style={{ color: "var(--color-muted-2)", fontSize: 12 }}>
                    {formatDate(event.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </>
  );
}
