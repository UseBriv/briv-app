import Link from "next/link";
import { TopBar } from "../_components/TopBar";
import { db } from "@/lib/db";
import { getCurrentOrg } from "@/lib/auth";
import { formatDate } from "@/lib/utils";

export default async function ClientsPage() {
  const org = await getCurrentOrg();
  const clients = org
    ? await db.client.findMany({
        where: { orgId: org.id },
        orderBy: { updatedAt: "desc" },
        include: { _count: { select: { documents: true } } },
      })
    : [];

  return (
    <>
      <TopBar title="Clients" />
      <main className="px-8 py-8">
        <div
          className="overflow-hidden rounded-[16px] border"
          style={{ background: "var(--color-cream)", borderColor: "var(--color-line)" }}
        >
          {clients.length === 0 ? (
            <div className="px-6 py-20 text-center">
              <div
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 28,
                  letterSpacing: "-0.01em",
                  marginBottom: 12,
                }}
              >
                Your client book is empty.
              </div>
              <p style={{ color: "var(--color-muted)" }}>
                Clients are created automatically when you send your first document — or add one
                manually from any document.
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
                  <th style={{ textAlign: "left", padding: "14px 20px" }}>Name</th>
                  <th style={{ textAlign: "left", padding: "14px 20px" }}>Email</th>
                  <th style={{ textAlign: "right", padding: "14px 20px" }}>Documents</th>
                  <th style={{ textAlign: "right", padding: "14px 20px" }}>Added</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((c) => (
                  <tr
                    key={c.id}
                    style={{ borderTop: "1px solid var(--color-line)", fontSize: 14 }}
                  >
                    <td style={{ padding: "14px 20px" }}>
                      <Link href={`/clients/${c.id}`}>{c.name}</Link>
                    </td>
                    <td
                      style={{
                        padding: "14px 20px",
                        color: "var(--color-muted)",
                        fontFamily: "var(--font-mono)",
                        fontSize: 12,
                      }}
                    >
                      {c.email ?? "—"}
                    </td>
                    <td
                      style={{
                        padding: "14px 20px",
                        textAlign: "right",
                        fontFamily: "var(--font-mono)",
                        fontSize: 12,
                      }}
                    >
                      {c._count.documents}
                    </td>
                    <td
                      style={{
                        padding: "14px 20px",
                        textAlign: "right",
                        color: "var(--color-muted)",
                      }}
                    >
                      {formatDate(c.createdAt)}
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
