"use client";

import { FormEvent, useMemo, useState } from "react";

type PublicSignatureFormProps = {
  documentId: string;
  shareToken: string;
  defaultName?: string;
  defaultEmail?: string;
};

export function PublicSignatureForm({
  documentId,
  shareToken,
  defaultName,
  defaultEmail,
}: PublicSignatureFormProps) {
  const [signerName, setSignerName] = useState(defaultName ?? "");
  const [signerEmail, setSignerEmail] = useState(defaultEmail ?? "");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signedAt, setSignedAt] = useState<string | null>(null);

  const signedLabel = useMemo(() => {
    if (!signedAt) return null;
    try {
      return new Date(signedAt).toLocaleString();
    } catch {
      return signedAt;
    }
  }, [signedAt]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!acceptTerms) {
      setError("Please accept the e-sign disclosure before signing.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/documents/${documentId}/sign`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          signerName: signerName.trim(),
          signerEmail: signerEmail.trim(),
          shareToken,
          acceptTerms: true,
        }),
      });
      if (!res.ok) {
        const body = await res.text();
        setError(body || "Unable to sign this document.");
        return;
      }
      const data = (await res.json()) as { signedAt?: string };
      setSignedAt(data.signedAt ?? new Date().toISOString());
    } catch {
      setError("Network error while signing. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (signedAt) {
    return (
      <div
        className="mt-8 rounded-[18px] border p-6"
        style={{ background: "var(--color-cream)", borderColor: "var(--color-line)" }}
      >
        <div style={{ fontFamily: "var(--font-serif)", fontSize: 22 }}>Signature complete</div>
        <p style={{ marginTop: 6, color: "var(--color-muted)" }}>
          This document was signed successfully {signedLabel ? `on ${signedLabel}` : ""}.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mt-8 rounded-[18px] border p-6"
      style={{ background: "var(--color-cream)", borderColor: "var(--color-line)" }}
    >
      <div style={{ fontFamily: "var(--font-serif)", fontSize: 22 }}>Sign this document</div>
      <p style={{ marginTop: 6, color: "var(--color-muted)" }}>
        Review details above, then complete your legal e-signature below.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontSize: 12, color: "var(--color-muted)" }}>Full name</span>
          <input
            required
            value={signerName}
            maxLength={200}
            onChange={(e) => setSignerName(e.target.value)}
            className="rounded-[10px] border px-3 py-2"
            style={{ borderColor: "var(--color-line)", background: "var(--color-paper)" }}
          />
        </label>
        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontSize: 12, color: "var(--color-muted)" }}>Email</span>
          <input
            required
            type="email"
            value={signerEmail}
            maxLength={320}
            onChange={(e) => setSignerEmail(e.target.value)}
            className="rounded-[10px] border px-3 py-2"
            style={{ borderColor: "var(--color-line)", background: "var(--color-paper)" }}
          />
        </label>
      </div>

      <label className="mt-4 flex items-start gap-3" style={{ fontSize: 13, color: "var(--color-muted)" }}>
        <input
          type="checkbox"
          checked={acceptTerms}
          onChange={(e) => setAcceptTerms(e.target.checked)}
          style={{ marginTop: 3 }}
        />
        <span>
          By checking this box and clicking sign, I agree this electronic signature is legally
          binding for this document.
        </span>
      </label>

      {error ? (
        <p style={{ marginTop: 10, color: "#b22727", fontSize: 13 }}>{error}</p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 rounded-[12px] px-4 py-2"
        style={{
          background: "var(--color-ink)",
          color: "var(--color-paper)",
          opacity: isSubmitting ? 0.65 : 1,
          cursor: isSubmitting ? "not-allowed" : "pointer",
        }}
      >
        {isSubmitting ? "Signing..." : "Sign document"}
      </button>
    </form>
  );
}
