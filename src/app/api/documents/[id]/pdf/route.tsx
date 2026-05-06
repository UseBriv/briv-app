import { renderToBuffer } from "@react-pdf/renderer";
import { BrivDocumentPdf, tiptapJsonToPlainText } from "@/lib/pdf/briv-document-pdf";
import { db } from "@/lib/db";
import { getCurrentOrgSynced } from "@/lib/auth";

export const runtime = "nodejs";

function safeFilename(s: string) {
  return s.replace(/[^\w.-]+/g, "-").slice(0, 80) || "document";
}

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const org = await getCurrentOrgSynced();
  if (!org) return new Response("NO_ACTIVE_ORG", { status: 400 });

  const doc = await db.document.findFirst({
    where: { id, orgId: org.id },
    include: {
      lineItems: { orderBy: { position: "asc" } },
      client: true,
      signatures: { orderBy: { signedAt: "desc" } },
    },
  });
  if (!doc) return new Response("NOT_FOUND", { status: 404 });

  const bodyPlain = tiptapJsonToPlainText(doc.body);

  const buffer = await renderToBuffer(
    <BrivDocumentPdf
      orgName={org.name}
      number={doc.number}
      title={doc.title}
      type={doc.type}
      status={doc.status}
      currency={doc.currency}
      clientName={doc.client?.name ?? null}
      issuedAt={doc.issuedAt}
      bodyPlainText={bodyPlain || null}
      lineItems={doc.lineItems.map((li) => ({
        description: li.description,
        quantity: li.quantity.toString(),
        unitCents: li.unitCents,
        totalCents: li.totalCents,
      }))}
      subtotalCents={doc.subtotalCents}
      taxCents={doc.taxCents}
      totalCents={doc.totalCents}
      taxRate={Number(doc.taxRate)}
      signatures={doc.signatures.map((s) => ({
        signerName: s.signerName,
        signerEmail: s.signerEmail,
        signedAt: s.signedAt,
      }))}
    />,
  );

  const name = safeFilename(`${doc.number}-${doc.title}`);
  return new Response(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${name}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
