export type Industry =
  | "construction"
  | "design"
  | "legal"
  | "photography"
  | "consulting"
  | "other";

export type AiLineItem = {
  description: string;
  quantity: number;
  unitCents: number;
  totalCents: number;
  rationale?: string;
};

export type AiEstimate = {
  title: string;
  industry: Industry;
  clientName: string | null;
  currency: string;
  lineItems: AiLineItem[];
  subtotalCents: number;
  taxRate: number;
  taxCents: number;
  totalCents: number;
  scopeNotes: string[];
  termsAndConditions: string[];
  estimatedTimeline: string | null;
  confidence: number; // 0..1
};

export type ClauseRisk = "low" | "medium" | "high";

export type ClauseFinding = {
  clauseTitle: string;
  excerpt: string;
  risk: ClauseRisk;
  category:
    | "payment"
    | "termination"
    | "liability"
    | "ip"
    | "confidentiality"
    | "scope"
    | "warranty"
    | "indemnification"
    | "governing_law"
    | "other";
  summary: string;
  suggestion: string;
};

export type ClauseAnalysis = {
  overallRisk: ClauseRisk;
  findings: ClauseFinding[];
  missingClauses: string[];
  recommendation: string;
};

export type PricingAnomaly = {
  lineItemIndex: number;
  description: string;
  proposedCents: number;
  expectedRangeCents: { min: number; max: number };
  deviationPct: number;
  severity: "info" | "warn" | "alert";
  reason: string;
};

export type PricingAnalysis = {
  anomalies: PricingAnomaly[];
  summary: string;
  totalDeltaPct: number;
};
