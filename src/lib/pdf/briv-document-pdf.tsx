import {
  Document as PdfRoot,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { formatCurrency, formatDate } from "@/lib/utils";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#1a1a1b",
  },
  brand: {
    fontSize: 9,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: "#666",
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    marginBottom: 4,
  },
  meta: {
    fontSize: 9,
    color: "#555",
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 8,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: "#888",
    marginBottom: 6,
  },
  clientBox: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 10,
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e8e8e8",
    paddingVertical: 8,
  },
  rowHead: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 6,
    marginBottom: 2,
  },
  colDesc: { width: "52%" },
  colQty: { width: "16%", textAlign: "right" },
  colUnit: { width: "16%", textAlign: "right" },
  colTot: { width: "16%", textAlign: "right" },
  headText: { fontSize: 8, textTransform: "uppercase", color: "#666" },
  totals: {
    marginTop: 16,
    alignSelf: "flex-end",
    width: "42%",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  totalStrong: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 8,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    fontSize: 12,
  },
  bodyBlock: {
    marginTop: 16,
    marginBottom: 12,
    fontSize: 10,
    lineHeight: 1.5,
    color: "#333",
  },
  sigBlock: {
    marginTop: 24,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  sigLine: { fontSize: 9, color: "#444", marginBottom: 4 },
});

export type BrivDocumentPdfProps = {
  orgName: string;
  number: string;
  title: string;
  type: string;
  status: string;
  currency: string;
  clientName: string | null;
  issuedAt: Date | null;
  bodyPlainText?: string | null;
  lineItems: {
    description: string;
    quantity: string;
    unitCents: number;
    totalCents: number;
  }[];
  subtotalCents: number;
  taxCents: number;
  totalCents: number;
  taxRate: number;
  signatures: { signerName: string; signerEmail: string; signedAt: Date }[];
};

export function BrivDocumentPdf(props: BrivDocumentPdfProps) {
  const taxPct = (props.taxRate * 100).toFixed(2);
  return (
    <PdfRoot title={`${props.number} — ${props.title}`} creator="Briv">
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.brand}>{props.orgName}</Text>
        <Text style={styles.title}>{props.title}</Text>
        <Text style={styles.meta}>
          {props.number} · {props.type} · {props.status}
          {props.issuedAt ? ` · Issued ${formatDate(props.issuedAt)}` : ""}
        </Text>

        <Text style={styles.sectionLabel}>Bill to</Text>
        <View style={styles.clientBox}>
          <Text style={{ fontSize: 11 }}>{props.clientName ?? "No client on file"}</Text>
        </View>

        {props.bodyPlainText ? (
          <View>
            <Text style={styles.sectionLabel}>Details</Text>
            <Text style={styles.bodyBlock}>{props.bodyPlainText}</Text>
          </View>
        ) : null}

        <Text style={styles.sectionLabel}>Line items</Text>
        <View style={styles.rowHead}>
          <Text style={[styles.colDesc, styles.headText]}>Description</Text>
          <Text style={[styles.colQty, styles.headText]}>Qty</Text>
          <Text style={[styles.colUnit, styles.headText]}>Rate</Text>
          <Text style={[styles.colTot, styles.headText]}>Amount</Text>
        </View>
        {props.lineItems.map((li, i) => (
          <View key={i} style={styles.row} wrap={false}>
            <Text style={styles.colDesc}>{li.description}</Text>
            <Text style={styles.colQty}>{li.quantity}</Text>
            <Text style={styles.colUnit}>{formatCurrency(li.unitCents, props.currency)}</Text>
            <Text style={styles.colTot}>{formatCurrency(li.totalCents, props.currency)}</Text>
          </View>
        ))}

        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text>Subtotal</Text>
            <Text>{formatCurrency(props.subtotalCents, props.currency)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text>Tax ({taxPct}%)</Text>
            <Text>{formatCurrency(props.taxCents, props.currency)}</Text>
          </View>
          <View style={styles.totalStrong}>
            <Text>Total</Text>
            <Text>{formatCurrency(props.totalCents, props.currency)}</Text>
          </View>
        </View>

        {props.signatures.length > 0 ? (
          <View style={styles.sigBlock}>
            <Text style={styles.sectionLabel}>Signatures</Text>
            {props.signatures.map((s, i) => (
              <Text key={i} style={styles.sigLine}>
                {s.signerName} ({s.signerEmail}) — {formatDate(s.signedAt)}
              </Text>
            ))}
          </View>
        ) : null}
      </Page>
    </PdfRoot>
  );
}

/** Best-effort plain text from Tiptap-like JSON for PDF body. */
export function tiptapJsonToPlainText(body: unknown): string {
  if (body == null) return "";
  if (typeof body === "string") return body;
  if (typeof body !== "object") return "";
  const o = body as Record<string, unknown>;
  if (o.type === "text" && typeof o.text === "string") return o.text;
  if (Array.isArray(o.content)) {
    return o.content.map(tiptapJsonToPlainText).join(" ").replace(/\s+/g, " ").trim();
  }
  return "";
}
