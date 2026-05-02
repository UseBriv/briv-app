import Link from "next/link";
import { TopBar } from "../_components/TopBar";
import { db } from "@/lib/db";
import { getCurrentOrg } from "@/lib/auth";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function DocumentsPage() {
  const org = await getCurrentOrg();
  const documents = org
    ? await db.document.findMany({
        where: { orgId: org.id },
        orderBy: { updatedAt: "desc" },
        include: { client: true },
      })
    : [];

  return (
    <>
      <TopBar title="Documents" />
      <main className="px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <p style={{ color: "var(--color-muted)", maxWidth: 480 }}>
            Estimates, proposals, contracts, and invoices — all in one inbox. Filter, redline,
            send, and reconcile from here.
          </p>
          <Link href="/documents/new" className="btn btn-primary">
            New document <ArrowIcon size={12} />
          </Link>
        </div>

        <div
          className="overflow-hidden rounded-[16px] border"
          style={{ background: "var(--color-cream)", borderColor: "var(--color-line)" }}
        >
          {documents.length === 0 ? (
            <div className="px-6 py-20 text-center">
              <div
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 28,
                  letterSpacing: "-0.01em",
                  marginBottom: 12,
                }}
              >
                No documents yet.
              </div>
              <p style={{ color: "var(--color-muted)", marginBottom: 20 }}>
                Draft your first document with the AI studio.
              </p>
              <Link href="/documents/new" className="btn btn-primary">
                Start drafting <ArrowIcon size={12} />
              </Link>
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
                  <th style={{ textAlign: "left", padding: "14px 20px" }}>Number</th>
                  <th style={{ textAlign: "left", padding: "14px 20px" }}>Type</th>
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
                    <td
                      style={{ padding: "14px 20px", fontFamily: "var(--font-mono)", fontSize: 12 }}
                    >
                      <Link href={`/documents/${doc.id}`}>{doc.number}</Link>
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
                      {doc.type}
                    </td>
                    <td style={{ padding: "14px 20px" }}>{doc.title}</td>
                    <td style={{ padding: "14px 20px", color: "var(--color-muted)" }}>
                      {doc.client?.name ?? "—"}
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
                      {doc.status}
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
      </main>
    </>
  );
}
