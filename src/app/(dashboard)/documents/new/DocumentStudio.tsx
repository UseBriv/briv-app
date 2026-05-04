"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Eye, Mic, MoreHorizontal, Sparkles } from "lucide-react";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { formatCurrency } from "@/lib/utils";
import type { AiEstimate } from "@/lib/ai/types";

type DocumentType = "ESTIMATE" | "PROPOSAL" | "CONTRACT" | "INVOICE";

type LineItem = {
  description: string;
  quantity: string;
  unitAmount: string;
  note?: string;
};

type TemplatePayload = {
  id: string;
  name: string;
  type: DocumentType;
  body: { title?: string; currency?: string; taxRate?: number } | null;
  lineItems:
    | { description: string; quantity: number; unitCents: number }[]
    | null
    | undefined;
};

type AiAppliedMeta = {
  confidence: number;
  industry: string;
  estimatedTimeline: string | null;
  scopeNotes: string[];
  termsAndConditions: string[];
};

const TYPE_LABEL: Record<DocumentType, string> = {
  ESTIMATE: "Estimate",
  PROPOSAL: "Proposal",
  CONTRACT: "Contract",
  INVOICE: "Invoice",
};

/** Standalone assistant product name (not compounded with “Briv”). */
const VELA = "Vela";

const TERMS_OPTIONS = ["Net 14", "Net 30", "Due on receipt"] as const;

const QUICK_STARTERS: { label: string; text: string }[] = [
  { label: "Kitchen remodel proposal", text: "Kitchen remodel — walnut cabinets, quartz counters, ~3 weeks, detailed scope for homeowner." },
  { label: "Interior design scope", text: "Interior design scope — mood boards, furnishings, install coordination for residential project." },
];

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function addDaysISO(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function emptyLineItem(): LineItem {
  return { description: "", quantity: "1", unitAmount: "0", note: "" };
}

export function DocumentStudio({
  onActivity,
  orgName = null,
}: {
  onActivity?: () => void;
  orgName?: string | null;
}) {
  const router = useRouter();
  const [type, setType] = useState<DocumentType>("INVOICE");
  const [title, setTitle] = useState("Invoice for Maya Reyes");
  const [description, setDescription] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [taxRatePercent, setTaxRatePercent] = useState("0");
  const [issueDate, setIssueDate] = useState(todayISO);
  const [dueDate, setDueDate] = useState(() => addDaysISO(14));
  const [termsPreset, setTermsPreset] = useState<string>(TERMS_OPTIONS[0]);
  const [lineItems, setLineItems] = useState<LineItem[]>(() => [
    {
      description: "Kitchen remodel — walnut cabinets",
      quantity: "1",
      unitAmount: "8500",
      note: "Design, materials, labor",
    },
  ]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [templates, setTemplates] = useState<TemplatePayload[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [templateId, setTemplateId] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [savingTemplate, setSavingTemplate] = useState(false);

  const [prompt, setPrompt] = useState("");
  const [industry, setIndustry] = useState<AiEstimate["industry"]>("construction");
  const [budget, setBudget] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMeta, setAiMeta] = useState<AiAppliedMeta | null>(null);
  const [showAiNotes, setShowAiNotes] = useState(false);

  useEffect(() => {
    setLoadingTemplates(true);
    fetch("/api/templates")
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then((items: TemplatePayload[]) => setTemplates(items))
      .catch(() => setTemplates([]))
      .finally(() => setLoadingTemplates(false));
  }, []);

  useEffect(() => {
    onActivity?.();
  }, [
    onActivity,
    type,
    title,
    description,
    currency,
    taxRatePercent,
    issueDate,
    dueDate,
    termsPreset,
    lineItems,
    prompt,
    templateId,
  ]);

  const filteredTemplates = useMemo(
    () => templates.filter((template) => template.type === type),
    [templates, type],
  );

  const totals = useMemo(() => {
    const clean = lineItems.map((li) => ({
      quantity: Number(li.quantity || 0),
      unitCents: Math.round(Number(li.unitAmount || 0) * 100),
    }));
    const subtotalCents = clean.reduce(
      (acc, li) => acc + Math.round(Math.max(li.quantity, 0) * Math.max(li.unitCents, 0)),
      0,
    );
    const taxRate = Math.max(Number(taxRatePercent || 0), 0) / 100;
    const taxCents = Math.round(subtotalCents * taxRate);
    return { subtotalCents, taxCents, totalCents: subtotalCents + taxCents };
  }, [lineItems, taxRatePercent]);

  function updateLineItem(index: number, next: Partial<LineItem>) {
    setLineItems((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        return { ...item, ...next };
      }),
    );
  }

  function applyTemplate() {
    const template = templates.find((item) => item.id === templateId);
    if (!template) return;
    if (template.body?.title) setTitle(template.body.title);
    if (template.body?.currency) setCurrency(template.body.currency.toUpperCase());
    if (typeof template.body?.taxRate === "number") {
      setTaxRatePercent((template.body.taxRate * 100).toFixed(2));
    }
    const nextLineItems = (template.lineItems ?? []).map((li) => ({
      description: li.description,
      quantity: li.quantity.toString(),
      unitAmount: (li.unitCents / 100).toString(),
      note: "",
    }));
    setLineItems(nextLineItems.length > 0 ? nextLineItems : [emptyLineItem()]);
    setAiMeta(null);
  }

  async function saveTemplate() {
    const cleanLineItems = lineItems
      .map((li) => ({
        description: li.description.trim(),
        quantity: Number(li.quantity || 0),
        unitCents: Math.round(Number(li.unitAmount || 0) * 100),
      }))
      .filter((li) => li.description.length > 0);

    if (!templateName.trim()) {
      setError("Please enter a template name.");
      return;
    }

    setSavingTemplate(true);
    setError(null);
    try {
      const res = await fetch("/api/templates", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: templateName.trim(),
          type,
          body: {
            title: title.trim(),
            currency: currency.trim().toUpperCase(),
            taxRate: Math.max(Number(taxRatePercent || 0), 0) / 100,
          },
          lineItems: cleanLineItems,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const created = (await res.json()) as TemplatePayload;
      setTemplates((prev) => [created, ...prev]);
      setTemplateId(created.id);
      setTemplateName("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save template.");
    } finally {
      setSavingTemplate(false);
    }
  }

  async function handleAiDraft(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setAiLoading(true);
    try {
      const res = await fetch("/api/ai/generate-estimate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          prompt,
          industry,
          budgetCents: budget ? Math.round(parseFloat(budget) * 100) : undefined,
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to generate");
      }
      const data: AiEstimate = await res.json();

      setType("ESTIMATE");
      setTitle(data.title);
      setCurrency(data.currency.toUpperCase());
      setTaxRatePercent((data.taxRate * 100).toFixed(2));
      setLineItems(
        data.lineItems.map((li) => ({
          description: li.description,
          quantity: li.quantity.toString(),
          unitAmount: (li.unitCents / 100).toString(),
          note: li.rationale,
        })),
      );
      setAiMeta({
        confidence: data.confidence,
        industry: data.industry,
        estimatedTimeline: data.estimatedTimeline,
        scopeNotes: data.scopeNotes,
        termsAndConditions: data.termsAndConditions,
      });
      setShowAiNotes(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setAiLoading(false);
    }
  }

  async function createDocument() {
    const cleanLineItems = lineItems
      .map((li) => ({
        description: li.description.trim(),
        quantity: Number(li.quantity || 0),
        unitCents: Math.round(Number(li.unitAmount || 0) * 100),
        note: li.note?.trim() || undefined,
      }))
      .filter((li) => li.description.length > 0);

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (cleanLineItems.length === 0) {
      setError("Add at least one line item.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          type,
          title: title.trim(),
          currency: currency.trim().toUpperCase(),
          taxRate: Math.max(Number(taxRatePercent || 0), 0) / 100,
          lineItems: cleanLineItems,
          body: description.trim()
            ? { studioSummary: description.trim(), termsLabel: termsPreset }
            : { termsLabel: termsPreset },
          issuedAt: issueDate ? new Date(`${issueDate}T12:00:00`).toISOString() : undefined,
          dueAt: dueDate ? new Date(`${dueDate}T12:00:00`).toISOString() : undefined,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const doc = (await res.json()) as { id: string };
      router.push(`/documents/${doc.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create document.");
    } finally {
      setSaving(false);
    }
  }

  const lineBorder = "var(--color-line)";

  const org = orgName?.trim() || null;

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_300px] xl:items-start">
      <section className="min-w-0">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--color-muted-2)",
                marginBottom: 8,
              }}
            >
              {TYPE_LABEL[type]}
            </div>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border-0 bg-transparent p-0 focus:outline-none focus:ring-0"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(1.75rem, 4vw, 2.25rem)",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                color: "var(--color-ink)",
              }}
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a short description of the work or project…"
              rows={2}
              className="mt-3 w-full resize-none border-0 bg-transparent p-0 text-[15px] focus:outline-none focus:ring-0"
              style={{ color: "var(--color-muted)", fontFamily: "var(--font-sans)" }}
            />
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span
              className="pill"
              style={{
                background: "rgba(26,26,27,0.06)",
                borderColor: "var(--color-line)",
                color: "var(--color-muted)",
              }}
            >
              Draft
            </span>
            <details className="relative">
              <summary
                className="grid size-10 cursor-pointer list-none place-items-center rounded-full border transition hover:bg-black/[0.03]"
                style={{ borderColor: "var(--color-line-strong)" }}
              >
                <MoreHorizontal size={18} strokeWidth={1.75} style={{ color: "var(--color-muted)" }} />
              </summary>
              <div
                className="absolute right-0 z-20 mt-2 min-w-[180px] rounded-[12px] border py-1 shadow-lg"
                style={{
                  background: "var(--color-cream)",
                  borderColor: "var(--color-line)",
                  boxShadow: "var(--shadow-float)",
                }}
              >
                <button
                  type="button"
                  className="w-full px-4 py-2.5 text-left text-[13px] hover:bg-black/[0.04]"
                  onClick={() => document.getElementById("doc-create-cta")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Jump to create
                </button>
              </div>
            </details>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <label className="grid gap-1.5">
            <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--color-muted-2)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Currency
            </span>
            <input
              value={currency}
              maxLength={3}
              onChange={(e) => setCurrency(e.target.value.toUpperCase())}
              className="rounded-[12px] border px-3 py-2.5 text-[14px]"
              style={{ borderColor: lineBorder, fontFamily: "var(--font-mono)" }}
            />
          </label>
          <label className="grid gap-1.5">
            <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--color-muted-2)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Issue date
            </span>
            <input
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              className="rounded-[12px] border px-3 py-2.5 text-[14px]"
              style={{ borderColor: lineBorder, fontFamily: "var(--font-mono)" }}
            />
          </label>
          <label className="grid gap-1.5">
            <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--color-muted-2)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Due date
            </span>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="rounded-[12px] border px-3 py-2.5 text-[14px]"
              style={{ borderColor: lineBorder, fontFamily: "var(--font-mono)" }}
            />
          </label>
        </div>

        <div className="mt-10 overflow-x-auto">
          <div
            className="grid min-w-[640px] gap-3 pb-2"
            style={{
              gridTemplateColumns: "44px minmax(200px,1fr) 72px 100px 100px 40px",
              alignItems: "start",
            }}
          >
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-muted-2)" }}>
              #
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-muted-2)" }}>
              Item
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-muted-2)" }}>
              Qty
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-muted-2)" }}>
              Unit
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-muted-2)", textAlign: "right" }}>
              Amount
            </span>
            <span />
            {lineItems.map((li, i) => {
              const qty = Number(li.quantity || 0);
              const unitCents = Math.round(Number(li.unitAmount || 0) * 100);
              const rowCents = Math.round(Math.max(qty, 0) * Math.max(unitCents, 0));
              const idx = String(i + 1).padStart(2, "0");
              return (
                <div key={i} style={{ display: "contents" }}>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 13,
                      color: "var(--color-muted)",
                      paddingTop: 10,
                    }}
                  >
                    {idx}
                  </div>
                  <div>
                    <input
                      value={li.description}
                      onChange={(e) => updateLineItem(i, { description: e.target.value })}
                      className="w-full rounded-[12px] border px-3 py-2.5 text-[14px]"
                      style={{ borderColor: lineBorder }}
                      placeholder="Line title"
                    />
                    <input
                      value={li.note ?? ""}
                      onChange={(e) => updateLineItem(i, { note: e.target.value })}
                      className="mt-2 w-full border-0 bg-transparent p-0 text-[13px] focus:outline-none focus:ring-0"
                      style={{ color: "var(--color-muted-2)" }}
                      placeholder="Sub-description (optional)"
                    />
                  </div>
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={li.quantity}
                    onChange={(e) => updateLineItem(i, { quantity: e.target.value })}
                    className="rounded-[12px] border px-3 py-2.5 text-[14px]"
                    style={{ borderColor: lineBorder, fontFamily: "var(--font-mono)" }}
                  />
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={li.unitAmount}
                    onChange={(e) => updateLineItem(i, { unitAmount: e.target.value })}
                    className="rounded-[12px] border px-3 py-2.5 text-[14px]"
                    style={{ borderColor: lineBorder, fontFamily: "var(--font-mono)" }}
                  />
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 13,
                      textAlign: "right",
                      paddingTop: 10,
                      color: "var(--color-ink)",
                    }}
                  >
                    {formatCurrency(rowCents, currency)}
                  </div>
                  <details className="relative justify-self-end pt-2">
                    <summary className="grid size-9 cursor-pointer list-none place-items-center rounded-full border border-transparent hover:border-[var(--color-line-strong)]">
                      <MoreHorizontal size={16} style={{ color: "var(--color-muted)" }} />
                    </summary>
                    <div
                      className="absolute right-0 z-10 mt-1 min-w-[120px] rounded-[10px] border py-1 shadow-md"
                      style={{ background: "var(--color-cream)", borderColor: lineBorder }}
                    >
                      <button
                        type="button"
                        className="w-full px-3 py-2 text-left text-[13px] hover:bg-black/[0.04]"
                        disabled={lineItems.length === 1}
                        onClick={() => setLineItems((prev) => prev.filter((_, idx) => idx !== i))}
                      >
                        Remove row
                      </button>
                    </div>
                  </details>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="btn btn-ghost text-[13px]"
            style={{ padding: "10px 16px", borderRadius: 999 }}
            onClick={() => setLineItems((prev) => [...prev, emptyLineItem()])}
          >
            + Add item
          </button>
          <button
            type="button"
            className="btn btn-ghost text-[13px]"
            style={{ padding: "10px 16px", borderRadius: 999 }}
            onClick={() => setLineItems((prev) => [...prev, emptyLineItem()])}
          >
            + Add section
          </button>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t pt-6 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between" style={{ borderColor: lineBorder }}>
          <label className="grid gap-1.5 sm:min-w-[200px]">
            <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--color-muted-2)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Template
            </span>
            <div className="relative">
              <select
                value={templateId}
                onChange={(e) => setTemplateId(e.target.value)}
                className="w-full appearance-none rounded-[12px] border px-3 py-2.5 pr-10 text-[14px]"
                style={{ borderColor: lineBorder }}
              >
                <option value="">Minimal — Elegant</option>
                {filteredTemplates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2"
                style={{ color: "var(--color-muted)" }}
                aria-hidden
              />
            </div>
          </label>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn btn-ghost text-[13px]" style={{ padding: "8px 14px" }} onClick={applyTemplate} disabled={!templateId}>
              Apply template
            </button>
          </div>
          <label className="grid gap-1.5 sm:min-w-[160px]">
            <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--color-muted-2)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Terms
            </span>
            <div className="relative">
              <select
                value={termsPreset}
                onChange={(e) => setTermsPreset(e.target.value)}
                className="w-full appearance-none rounded-[12px] border px-3 py-2.5 pr-10 text-[14px]"
                style={{ borderColor: lineBorder }}
              >
                {TERMS_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2"
                style={{ color: "var(--color-muted)" }}
                aria-hidden
              />
            </div>
          </label>
        </div>

        <label className="mt-6 grid gap-1.5 sm:max-w-xs">
          <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--color-muted-2)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Document type
          </span>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as DocumentType)}
            className="rounded-[12px] border px-3 py-2.5 text-[14px]"
            style={{ borderColor: lineBorder }}
          >
            {Object.entries(TYPE_LABEL).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        {aiMeta ? (
          <div className="mt-8 rounded-[16px] border p-5" style={{ borderColor: lineBorder }}>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-2 text-left"
              onClick={() => setShowAiNotes((v) => !v)}
            >
              <span style={{ fontFamily: "var(--font-serif)", fontSize: 18 }}>
                {VELA} · {Math.round(aiMeta.confidence * 100)}% confidence
              </span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--color-muted)" }}>
                {showAiNotes ? "Hide" : "Show"}
              </span>
            </button>
            {showAiNotes ? (
              <div style={{ marginTop: 12, fontSize: 13, color: "var(--color-muted)" }}>
                <p style={{ marginBottom: 8 }}>
                  <strong style={{ color: "var(--color-ink)" }}>{aiMeta.industry}</strong>
                  {aiMeta.estimatedTimeline ? ` · ${aiMeta.estimatedTimeline}` : ""}
                </p>
                {aiMeta.scopeNotes.length > 0 ? (
                  <div className="mb-3">
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 10,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        marginBottom: 6,
                        color: "var(--color-muted-2)",
                      }}
                    >
                      Scope notes
                    </div>
                    <ul style={{ paddingLeft: 18 }}>
                      {aiMeta.scopeNotes.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {aiMeta.termsAndConditions.length > 0 ? (
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 10,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        marginBottom: 6,
                        color: "var(--color-muted-2)",
                      }}
                    >
                      Terms (reference)
                    </div>
                    <ul style={{ paddingLeft: 18 }}>
                      {aiMeta.termsAndConditions.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : null}

        {error ? (
          <div
            style={{
              color: "#b22727",
              marginTop: 16,
              fontSize: 13,
              fontFamily: "var(--font-mono)",
            }}
          >
            {error}
          </div>
        ) : null}

        <div id="doc-create-cta" className="mt-8 flex flex-wrap gap-3">
          <button onClick={createDocument} className="btn btn-primary" type="button" disabled={saving}>
            {saving ? "Creating…" : `Create ${TYPE_LABEL[type].toLowerCase()}`}{" "}
            <ArrowIcon size={12} />
          </button>
          {aiMeta ? (
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setAiMeta(null);
                setShowAiNotes(false);
              }}
            >
              Discard draft
            </button>
          ) : null}
        </div>
      </section>

      <aside className="flex flex-col gap-6 xl:sticky xl:top-24">
        <div
          className="rounded-[24px] border p-6"
          style={{
            background: "rgba(255,255,255,0.94)",
            borderColor: lineBorder,
            boxShadow: "var(--shadow-soft)",
          }}
        >
          <div className="flex items-baseline justify-between gap-2">
            <span style={{ fontSize: 13, color: "var(--color-muted)" }}>Subtotal</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 14 }}>{formatCurrency(totals.subtotalCents, currency)}</span>
          </div>
          <div className="mt-3 flex items-center justify-between gap-2">
            <span style={{ fontSize: 13, color: "var(--color-muted)" }}>Tax</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                step={0.01}
                value={taxRatePercent}
                onChange={(e) => setTaxRatePercent(e.target.value)}
                className="w-16 rounded-[8px] border px-2 py-1 text-right text-[13px]"
                style={{ borderColor: lineBorder, fontFamily: "var(--font-mono)" }}
              />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--color-muted)" }}>%</span>
            </div>
          </div>
          <div className="mt-6 border-t pt-5" style={{ borderColor: lineBorder }}>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: 28, letterSpacing: "-0.02em" }}>
              Total {formatCurrency(totals.totalCents, currency)}
            </div>
          </div>
          <button
            type="button"
            className="btn btn-primary mt-6 w-full justify-center"
            style={{ padding: "12px 18px", borderRadius: 999 }}
            disabled={saving}
            onClick={() => document.getElementById("doc-create-cta")?.scrollIntoView({ behavior: "smooth" })}
          >
            <Eye size={16} strokeWidth={2} aria-hidden /> Preview document
          </button>
          <details className="mt-4">
            <summary
              className="cursor-pointer list-none text-center text-[13px] hover:underline"
              style={{ color: "var(--color-muted)" }}
            >
              More options
            </summary>
            <div className="mt-4 grid gap-3 rounded-[12px] border p-4" style={{ borderColor: lineBorder }}>
              <p style={{ fontSize: 12, color: "var(--color-muted-2)" }}>
                Save the current line items and fields as a reusable template ({loadingTemplates ? "…" : filteredTemplates.length}{" "}
                saved for this type).
              </p>
              <input
                placeholder="Template name"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="w-full rounded-[10px] border px-3 py-2 text-[14px]"
                style={{ borderColor: lineBorder }}
              />
              <button type="button" className="btn btn-ghost w-full justify-center" onClick={saveTemplate} disabled={savingTemplate}>
                {savingTemplate ? "Saving…" : "Save as template"}
              </button>
            </div>
          </details>
        </div>

        <form
          onSubmit={handleAiDraft}
          className="rounded-[24px] border p-6 sm:p-7"
          style={{
            background: "var(--color-ink)",
            color: "var(--color-cream)",
            borderColor: "var(--color-ink)",
            boxShadow: "var(--shadow-float)",
          }}
        >
          <div className="flex items-center gap-2" style={{ marginBottom: 10 }}>
            <Sparkles size={16} className="text-[var(--color-lime)]" aria-hidden />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: "0.16em",
                color: "var(--color-lime)",
              }}
            >
              {VELA.toUpperCase()} STUDIO
            </span>
          </div>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1.35rem, 2.2vw, 1.6rem)",
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
              marginBottom: 10,
              color: "var(--color-cream)",
            }}
          >
            Your document concierge
          </h2>
          <p style={{ opacity: 0.78, fontSize: 14, lineHeight: 1.5, marginBottom: 16 }}>
            {org
              ? `${VELA} works in ${org} — same templates, clients, and context as the rest of your workspace. Describe the work — composition follows.`
              : `${VELA} understands your client patterns. Describe the work — composition follows.`}
          </p>

          <div className="relative">
            <textarea
              required
              rows={4}
              placeholder='e.g. "Kitchen remodel — walnut cabinets, quartz, 3 weeks, client Maya Reyes, ~$14k."'
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full rounded-[14px] border px-4 py-3 pr-12"
              style={{
                background: "rgba(255,255,255,0.04)",
                borderColor: "rgba(255,255,255,0.12)",
                color: "var(--color-cream)",
                fontFamily: "var(--font-mono)",
                fontSize: 13,
                resize: "vertical",
              }}
            />
            <button
              type="button"
              aria-label="Voice input (coming soon)"
              className="absolute bottom-3 right-3 grid size-9 place-items-center rounded-full border border-white/10 bg-white/5 text-white/40"
            >
              <Mic size={16} />
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {QUICK_STARTERS.map((q) => (
              <button
                key={q.label}
                type="button"
                onClick={() => setPrompt(q.text)}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-left text-[12px] transition hover:bg-white/[0.08]"
              >
                {q.label}
              </button>
            ))}
          </div>

          <details className="mt-5 rounded-[12px] border border-white/10 bg-white/[0.03] px-3 py-2">
            <summary className="cursor-pointer list-none text-[12px] text-white/55">Advanced</summary>
            <div className="mt-3 grid gap-3 pb-2">
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value as AiEstimate["industry"])}
                className="rounded-[10px] border px-3 py-2"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  borderColor: "rgba(255,255,255,0.12)",
                  color: "var(--color-cream)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 13,
                }}
              >
                {(["construction", "design", "legal", "photography", "consulting", "other"] as const).map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min={0}
                step={100}
                placeholder="Budget hint (USD, optional)"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="rounded-[10px] border px-3 py-2"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  borderColor: "rgba(255,255,255,0.12)",
                  color: "var(--color-cream)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 13,
                }}
              />
            </div>
          </details>

          <div className="mt-6">
            <button type="submit" className="btn btn-lime w-full justify-center text-[15px]" disabled={aiLoading} style={{ padding: "14px 22px" }}>
              {aiLoading ? (
                <>Vela is drafting your document…</>
              ) : (
                <>
                  Compose with {VELA} <ArrowIcon size={12} />
                </>
              )}
            </button>
          </div>
          <p className="mt-4 text-center text-[11px] leading-snug" style={{ color: "rgba(255,255,255,0.38)" }}>
            {org
              ? `${VELA} uses your organization’s context and templates to draft instantly.`
              : `${VELA} uses your context and templates to draft instantly.`}
          </p>
        </form>
      </aside>
    </div>
  );
}
