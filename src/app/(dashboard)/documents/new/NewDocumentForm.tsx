"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { formatCurrency } from "@/lib/utils";
import type { AiEstimate } from "@/lib/ai/types";

export function NewDocumentForm() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [industry, setIndustry] = useState<AiEstimate["industry"]>("construction");
  const [budget, setBudget] = useState("");
  const [estimate, setEstimate] = useState<AiEstimate | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setEstimate(null);
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
      setEstimate(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!estimate) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          type: "ESTIMATE",
          title: estimate.title,
          currency: estimate.currency,
          taxRate: estimate.taxRate,
          lineItems: estimate.lineItems.map((li) => ({
            description: li.description,
            quantity: li.quantity,
            unitCents: li.unitCents,
          })),
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const doc = await res.json();
      router.push(`/documents/${doc.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-6">
      <form
        onSubmit={handleGenerate}
        className="rounded-[20px] border p-8"
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
            marginBottom: 18,
          }}
        >
          <span className="dot" /> AI STUDIO
        </span>

        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: 36,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            marginBottom: 18,
          }}
        >
          Describe the job. Briv writes the rest.
        </h2>

        <textarea
          required
          rows={4}
          placeholder='e.g. "3-bedroom kitchen remodel in Brooklyn — walnut cabinets, quartz, 3-week timeline, $14k budget. Client: Maya Reyes."'
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full rounded-[12px] border px-4 py-3"
          style={{
            background: "rgba(255,255,255,0.04)",
            borderColor: "rgba(255,255,255,0.12)",
            color: "var(--color-cream)",
            fontFamily: "var(--font-mono)",
            fontSize: 14,
            resize: "vertical",
          }}
        />

        <div className="mt-4 grid gap-3 md:grid-cols-2">
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
            placeholder="Budget (USD)"
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

        <div className="mt-5 flex items-center gap-3">
          <button type="submit" className="btn btn-lime" disabled={loading}>
            {loading ? "Drafting…" : "Generate estimate"} <ArrowIcon size={12} />
          </button>
          {error && (
            <span
              style={{
                color: "var(--color-ember)",
                fontFamily: "var(--font-mono)",
                fontSize: 12,
              }}
            >
              {error}
            </span>
          )}
        </div>
      </form>

      {estimate && (
        <div
          className="relative rounded-[20px] border p-8"
          style={{
            background: "var(--color-cream)",
            borderColor: "var(--color-line)",
          }}
        >
          <div
            className="absolute"
            style={{
              top: -12,
              right: 24,
              background: "var(--color-lime)",
              color: "var(--color-ink)",
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.08em",
              padding: "4px 10px",
              borderRadius: 999,
              fontWeight: 600,
            }}
          >
            DRAFT · {Math.round(estimate.confidence * 100)}% confidence
          </div>

          <h3
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 30,
              letterSpacing: "-0.01em",
              marginBottom: 4,
            }}
          >
            {estimate.title}
          </h3>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--color-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: 24,
            }}
          >
            {estimate.industry} · {estimate.lineItems.length} line items
            {estimate.estimatedTimeline ? ` · ${estimate.estimatedTimeline}` : ""}
          </div>

          <table className="w-full">
            <tbody>
              {estimate.lineItems.map((li, i) => (
                <tr key={i} style={{ borderTop: "1px solid var(--color-line)" }}>
                  <td style={{ padding: "12px 0" }}>
                    <div>{li.description}</div>
                    {li.rationale && (
                      <div
                        style={{
                          fontSize: 12,
                          color: "var(--color-muted-2)",
                          marginTop: 2,
                        }}
                      >
                        {li.rationale}
                      </div>
                    )}
                  </td>
                  <td
                    style={{
                      padding: "12px 0",
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                      color: "var(--color-muted)",
                      textAlign: "right",
                      whiteSpace: "nowrap",
                      paddingLeft: 16,
                    }}
                  >
                    {li.quantity} × {formatCurrency(li.unitCents, estimate.currency)}
                  </td>
                  <td
                    style={{
                      padding: "12px 0",
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                      textAlign: "right",
                      whiteSpace: "nowrap",
                      paddingLeft: 16,
                    }}
                  >
                    {formatCurrency(li.totalCents, estimate.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div
            className="grid"
            style={{
              gridTemplateColumns: "1fr auto",
              gap: "6px 16px",
              padding: "16px 0",
              fontSize: 13,
              borderTop: "1px solid var(--color-line)",
              marginTop: 12,
            }}
          >
            <span style={{ color: "var(--color-muted)" }}>Subtotal</span>
            <span
              style={{
                textAlign: "right",
                fontFamily: "var(--font-mono)",
                fontSize: 12,
              }}
            >
              {formatCurrency(estimate.subtotalCents, estimate.currency)}
            </span>
            <span style={{ color: "var(--color-muted)" }}>
              Tax ({(estimate.taxRate * 100).toFixed(2)}%)
            </span>
            <span
              style={{
                textAlign: "right",
                fontFamily: "var(--font-mono)",
                fontSize: 12,
              }}
            >
              {formatCurrency(estimate.taxCents, estimate.currency)}
            </span>
            <span
              style={{
                paddingTop: 10,
                borderTop: "1px solid var(--color-line)",
                fontFamily: "var(--font-serif)",
                fontSize: 18,
              }}
            >
              Total
            </span>
            <span
              style={{
                paddingTop: 10,
                borderTop: "1px solid var(--color-line)",
                fontFamily: "var(--font-serif)",
                fontSize: 24,
                textAlign: "right",
              }}
            >
              {formatCurrency(estimate.totalCents, estimate.currency)}
            </span>
          </div>

          {estimate.scopeNotes.length > 0 && (
            <div className="mt-4">
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--color-muted-2)",
                  marginBottom: 8,
                }}
              >
                Scope notes
              </div>
              <ul style={{ paddingLeft: 18, color: "var(--color-muted)", fontSize: 13 }}>
                {estimate.scopeNotes.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <button onClick={handleSave} className="btn btn-primary" disabled={saving}>
              {saving ? "Saving…" : "Save as draft"} <ArrowIcon size={12} />
            </button>
            <button
              onClick={() => setEstimate(null)}
              className="btn btn-ghost"
              type="button"
            >
              Discard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
