import { z } from "zod";

export const lineItemSchema = z.object({
  description: z.string().min(1).max(500),
  quantity: z.number().positive().default(1),
  unitCents: z.number().int().nonnegative(),
});

export const createDocumentSchema = z.object({
  type: z.enum(["ESTIMATE", "PROPOSAL", "CONTRACT", "INVOICE"]),
  title: z.string().min(1).max(200),
  clientId: z.string().optional(),
  currency: z.string().length(3).default("USD"),
  taxRate: z.number().min(0).max(1).default(0),
  lineItems: z.array(lineItemSchema).default([]),
  body: z.unknown().optional(),
  dueAt: z.string().datetime().optional(),
});

export const updateDocumentSchema = createDocumentSchema.partial().extend({
  status: z
    .enum(["DRAFT", "SENT", "VIEWED", "SIGNED", "DECLINED", "PAID", "OVERDUE", "VOID"])
    .optional(),
});

export const aiEstimateSchema = z.object({
  prompt: z.string().min(8).max(2000),
  industry: z
    .enum(["construction", "design", "legal", "photography", "consulting", "other"])
    .optional(),
  budgetCents: z.number().int().nonnegative().optional(),
  currency: z.string().length(3).default("USD"),
  clientName: z.string().max(200).optional(),
});

export const clientSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().max(40).optional(),
  company: z.string().max(200).optional(),
  address: z.string().max(500).optional(),
  notes: z.string().max(2000).optional(),
});

export type LineItemInput = z.infer<typeof lineItemSchema>;
export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;
export type AiEstimateInput = z.infer<typeof aiEstimateSchema>;
export type ClientInput = z.infer<typeof clientSchema>;
