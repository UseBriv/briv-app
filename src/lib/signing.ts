import { createHash, randomBytes } from "node:crypto";

type SnapshotLineItem = {
  description: string;
  quantity: string;
  unitCents: number;
  totalCents: number;
};

type SigningSnapshotInput = {
  id: string;
  publicSlug: string;
  number: string;
  title: string;
  type: string;
  currency: string;
  taxRate: string;
  subtotalCents: number;
  taxCents: number;
  totalCents: number;
  body: unknown;
  lineItems: SnapshotLineItem[];
};

export function generateShareToken() {
  return randomBytes(24).toString("hex");
}

export function buildDocumentSigningSnapshot(input: SigningSnapshotInput) {
  return {
    id: input.id,
    publicSlug: input.publicSlug,
    number: input.number,
    title: input.title,
    type: input.type,
    currency: input.currency,
    taxRate: input.taxRate,
    subtotalCents: input.subtotalCents,
    taxCents: input.taxCents,
    totalCents: input.totalCents,
    body: input.body ?? null,
    lineItems: input.lineItems,
  };
}

export function computeSigningSnapshotHash(snapshot: unknown) {
  return createHash("sha256").update(JSON.stringify(snapshot)).digest("hex");
}
