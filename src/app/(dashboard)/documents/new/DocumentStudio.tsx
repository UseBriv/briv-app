"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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

/** Branded AI assistant for the document studio (shown in the sidebar co-pilot panel). */
const ASSISTANT_NAME = "Brivy";

function emptyLineItem(): LineItem {
  return { description: "", quantity: "1", unitAmount: "0" };
}

export function DocumentStudio() {
  const router = useRouter();
  const [type, setType] = useState<DocumentType>("INVOICE");
  const [title, setTitle] = useState("New document");
  const [currency, setCurrency] = useState("USD");
  const [taxRatePercent, setTaxRatePercent] = useState("0");
  const [lineItems, setLineItems] = useState<LineItem[]>([emptyLineItem()]);
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
      note: undefined,
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

  return (
    <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
      <section
        className="lg:col-span-8 rounded-[20px] border p-8"
        style={{ background: "var(--color-cream)", borderColor: "var(--color-line)" }}
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span
              className="pill"
              style={{
                background: "rgba(26,26,27,0.06)",
                borderColor: "var(--color-line)",
                color: "var(--color-muted)",
                marginBottom: 10,
              }}
            >
              <span className="dot" /> Live document
            </span>
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 30,
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
              }}
            >
              One canvas — edit everything before you publish
            </h2>
            <p style={{ color: "var(--color-muted)", marginTop: 8, maxWidth: 520 }}>
              Templates and {ASSISTANT_NAME} both write into this same draft. Nothing ships until you
              create the document.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ fontSize: 12, color: "var(--color-muted)" }}>Type</span>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as DocumentType)}
              className="rounded-[10px] border px-3 py-2"
              style={{ borderColor: "var(--color-line)" }}
            >
              {Object.entries(TYPE_LABEL).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ fontSize: 12, color: "var(--color-muted)" }}>Title</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-[10px] border px-3 py-2"
              style={{ borderColor: "var(--color-line)" }}
            />
          </label>
          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ fontSize: 12, color: "var(--color-muted)" }}>Currency</span>
            <input
              value={currency}
              maxLength={3}
              onChange={(e) => setCurrency(e.target.value.toUpperCase())}
              className="rounded-[10px] border px-3 py-2"
              style={{ borderColor: "var(--color-line)" }}
            />
          </label>
          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ fontSize: 12, color: "var(--color-muted)" }}>Tax %</span>
            <input
              type="number"
              min={0}
              step={0.01}
              value={taxRatePercent}
              onChange={(e) => setTaxRatePercent(e.target.value)}
              className="rounded-[10px] border px-3 py-2"
              style={{ borderColor: "var(--color-line)" }}
            />
          </label>
        </div>

        <div className="mt-5 rounded-[12px] border p-4" style={{ borderColor: "var(--color-line)" }}>
          <div className="flex flex-wrap items-end gap-3">
            <label style={{ display: "grid", gap: 6, minWidth: 240, flex: 1 }}>
              <span style={{ fontSize: 12, color: "var(--color-muted)" }}>
                Templates ({loadingTemplates ? "…" : filteredTemplates.length} for this type)
              </span>
              <select
                value={templateId}
                onChange={(e) => setTemplateId(e.target.value)}
                className="rounded-[10px] border px-3 py-2"
                style={{ borderColor: "var(--color-line)" }}
              >
                <option value="">Select template</option>
                {filteredTemplates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={applyTemplate}
              disabled={!templateId}
            >
              Apply
            </button>
          </div>
          <div className="mt-3 flex flex-wrap items-end gap-3">
            <label style={{ display: "grid", gap: 6, minWidth: 240, flex: 1 }}>
              <span style={{ fontSize: 12, color: "var(--color-muted)" }}>Save as template</span>
              <input
                placeholder="Template name"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="rounded-[10px] border px-3 py-2"
                style={{ borderColor: "var(--color-line)" }}
              />
            </label>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={saveTemplate}
              disabled={savingTemplate}
            >
              {savingTemplate ? "Saving…" : "Save template"}
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-3">
          <div
            className="grid"
            style={{
              gridTemplateColumns: "1.5fr 120px 140px auto",
              gap: 8,
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--color-muted-2)",
              textTransform: "uppercase",
            }}
          >
            <span>Description</span>
            <span>Qty</span>
            <span>Unit</span>
            <span />
          </div>
          {lineItems.map((li, i) => (
            <div key={i}>
              <div
                className="grid"
                style={{
                  gridTemplateColumns: "1.5fr 120px 140px auto",
                  gap: 8,
                  alignItems: "start",
                }}
              >
                <div>
                  <input
                    value={li.description}
                    onChange={(e) => updateLineItem(i, { description: e.target.value })}
                    className="w-full rounded-[10px] border px-3 py-2"
                    style={{ borderColor: "var(--color-line)" }}
                  />
                  {li.note ? (
                    <div style={{ fontSize: 12, color: "var(--color-muted-2)", marginTop: 4 }}>
                      {li.note}
                    </div>
                  ) : null}
                </div>
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  value={li.quantity}
                  onChange={(e) => updateLineItem(i, { quantity: e.target.value })}
                  className="rounded-[10px] border px-3 py-2"
                  style={{ borderColor: "var(--color-line)" }}
                />
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  value={li.unitAmount}
                  onChange={(e) => updateLineItem(i, { unitAmount: e.target.value })}
                  className="rounded-[10px] border px-3 py-2"
                  style={{ borderColor: "var(--color-line)" }}
                />
                <button
                  type="button"
                  className="btn btn-ghost"
                  disabled={lineItems.length === 1}
                  onClick={() => setLineItems((prev) => prev.filter((_, idx) => idx !== i))}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setLineItems((prev) => [...prev, emptyLineItem()])}
          >
            Add line item
          </button>
        </div>

        {aiMeta ? (
          <div className="mt-5 rounded-[12px] border p-4" style={{ borderColor: "var(--color-line)" }}>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-2 text-left"
              onClick={() => setShowAiNotes((v) => !v)}
            >
              <span style={{ fontFamily: "var(--font-serif)", fontSize: 18 }}>
                {ASSISTANT_NAME} · {Math.round(aiMeta.confidence * 100)}% confidence
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
                      Terms (reference — add to body in editor later)
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
            {formatCurrency(totals.subtotalCents, currency)}
          </span>
          <span style={{ color: "var(--color-muted)", fontSize: 13 }}>Tax</span>
          <span style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 12 }}>
            {formatCurrency(totals.taxCents, currency)}
          </span>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: 18 }}>Total</span>
          <span style={{ textAlign: "right", fontFamily: "var(--font-serif)", fontSize: 24 }}>
            {formatCurrency(totals.totalCents, currency)}
          </span>
        </div>

        {error ? (
          <div
            style={{
              color: "#b22727",
              marginTop: 12,
              fontSize: 13,
              fontFamily: "var(--font-mono)",
            }}
          >
            {error}
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3">
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
              Clear {ASSISTANT_NAME}
            </button>
          ) : null}
        </div>
      </section>

      <aside className="lg:col-span-4 lg:sticky lg:top-24">
        <form
          onSubmit={handleAiDraft}
          className="rounded-[20px] border p-6 lg:p-8"
          style={{
            background: "var(--color-ink)",
            color: "var(--color-cream)",
            borderColor: "var(--color-ink)",
          }}
        >
          <span
            className="pill"
            style={{
              background: "rgba(212,255,58,0.1)",
              borderColor: "rgba(212,255,58,0.3)",
              color: "var(--color-lime)",
              marginBottom: 14,
            }}
          >
            <span className="dot" /> {ASSISTANT_NAME}
          </span>
          <h3
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 26,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              marginBottom: 8,
            }}
          >
            Describe the job — we fill the lines next to you
          </h3>
          <p style={{ opacity: 0.75, fontSize: 13, marginBottom: 16 }}>
            Draft appears in the live document. Tweak numbers, switch type to invoice, then create.
          </p>

          <textarea
            required
            rows={5}
            placeholder='e.g. "Kitchen remodel — walnut cabinets, quartz, 3 weeks, client Maya Reyes, ~$14k."'
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full rounded-[12px] border px-4 py-3"
            style={{
              background: "rgba(255,255,255,0.04)",
              borderColor: "rgba(255,255,255,0.12)",
              color: "var(--color-cream)",
              fontFamily: "var(--font-mono)",
              fontSize: 13,
              resize: "vertical",
            }}
          />

          <div className="mt-4 grid gap-3">
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
              {(
                [
                  "construction",
                  "design",
                  "legal",
                  "photography",
                  "consulting",
                  "other",
                ] as const
              ).map((opt) => (
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

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button type="submit" className="btn btn-lime" disabled={aiLoading}>
              {aiLoading ? "Drafting…" : "Fill document"} <ArrowIcon size={12} />
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}
