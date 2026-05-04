import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Logo } from "@/components/ui/Logo";
import { formatCurrency, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function PublicDocumentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const doc = await db.document.findUnique({
    where: { publicSlug: slug },
    include: {
      org: true,
      client: true,
      lineItems: { orderBy: { position: "asc" } },
      signatures: true,
    },
  });

  if (!doc) notFound();

  return (
    <div className="min-h-screen" style={{ background: "var(--color-paper)" }}>
      <header
        className="border-b px-8 py-5"
        style={{ borderColor: "var(--color-line)", background: "var(--color-cream)" }}
      >
        <div
          className="mx-auto flex items-center justify-between"
          style={{ maxWidth: 880 }}
        >
          <Logo size="sm" href={null} />
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--color-muted-2)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            {doc.type} · {doc.number}
          </span>
        </div>
      </header>

      <main
        className="mx-auto px-8 py-12"
        style={{ maxWidth: 880 }}
      >
        <div
          className="rounded-[24px] border p-10"
          style={{ background: "var(--color-cream)", borderColor: "var(--color-line)" }}
        >
          <div className="flex items-start justify-between">
            <div>
              <div
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 28,
                  letterSpacing: "-0.01em",
                }}
              >
                {doc.org.name}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--color-muted-2)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  marginTop: 2,
                }}
              >
                {doc.title}
              </div>
            </div>
            <div
              style={{
                textAlign: "right",
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--color-muted)",
              }}
            >
              <strong
                style={{
                  display: "block",
                  color: "var(--color-ink)",
                  fontSize: 14,
                  marginBottom: 4,
                }}
              >
                {doc.number}
              </strong>
              {doc.issuedAt
                ? formatDate(doc.issuedAt)
                : formatDate(doc.createdAt)}
            </div>
          </div>

          {doc.client && (
            <div className="mt-8">
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: "var(--color-muted-2)",
                  marginBottom: 6,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Billed to
              </div>
              <div
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 22,
                }}
              >
                {doc.client.name}
              </div>
            </div>
          )}

          <table className="mt-10 w-full">
            <tbody>
              {doc.lineItems.map((li) => (
                <tr key={li.id} style={{ borderTop: "1px solid var(--color-line)" }}>
                  <td style={{ padding: "12px 0" }}>{li.description}</td>
                  <td
                    style={{
                      padding: "12px 0",
                      textAlign: "right",
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
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
            <span
              style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 12 }}
            >
              {formatCurrency(doc.subtotalCents, doc.currency)}
            </span>
            <span style={{ color: "var(--color-muted)", fontSize: 13 }}>Tax</span>
            <span
              style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 12 }}
            >
              {formatCurrency(doc.taxCents, doc.currency)}
            </span>
            <span style={{ fontFamily: "var(--font-serif)", fontSize: 18 }}>Total</span>
            <span
              style={{ textAlign: "right", fontFamily: "var(--font-serif)", fontSize: 28 }}
            >
              {formatCurrency(doc.totalCents, doc.currency)}
            </span>
          </div>
        </div>

        <p
          className="mt-6 text-center"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--color-muted-2)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          Powered by Briv ·{" "}
          <a href="https://usebriv.com" style={{ color: "var(--color-ink)" }}>
            usebriv.com
          </a>
        </p>
      </main>
    </div>
  );
}
