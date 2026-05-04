"use client";

import { useMemo, useState } from "react";

type SendDocumentActionsProps = {
  documentId: string;
  initialStatus: string;
  initialSentAt: string | null;
  initialShareUrl: string;
};

export function SendDocumentActions({
  documentId,
  initialStatus,
  initialSentAt,
  initialShareUrl,
}: SendDocumentActionsProps) {
  const [status, setStatus] = useState(initialStatus);
  const [sentAt, setSentAt] = useState(initialSentAt);
  const [shareUrl, setShareUrl] = useState(initialShareUrl);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copyLabel, setCopyLabel] = useState("Copy signer link");

  const canSend = status !== "SIGNED" && status !== "PAID" && status !== "VOID";
  const sendLabel = status === "SENT" || sentAt ? "Resend" : "Send document";

  const sentText = useMemo(() => {
    if (!sentAt) return null;
    try {
      return new Date(sentAt).toLocaleString();
    } catch {
      return sentAt;
    }
  }, [sentAt]);

  async function onSend() {
    setIsSending(true);
    setError(null);
    try {
      const res = await fetch(`/api/documents/${documentId}/send`, { method: "POST" });
      if (!res.ok) {
        const body = await res.text();
        setError(body || "Unable to send this document.");
        return;
      }
      const data = (await res.json()) as { status?: string; sentAt?: string; shareUrl?: string };
      setStatus(data.status ?? "SENT");
      if (data.sentAt) setSentAt(data.sentAt);
      if (data.shareUrl) setShareUrl(data.shareUrl);
    } catch {
      setError("Network error while sending. Please try again.");
    } finally {
      setIsSending(false);
    }
  }

  async function onCopyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopyLabel("Copied!");
      setTimeout(() => setCopyLabel("Copy signer link"), 1500);
    } catch {
      setError("Could not copy link. You can copy it manually below.");
    }
  }

  return (
    <div
      className="mt-4 rounded-[12px] border p-4"
      style={{ background: "var(--color-cream)", borderColor: "var(--color-line)" }}
    >
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={!canSend || isSending}
          onClick={onSend}
          className="btn btn-primary"
          style={{ padding: "8px 14px", opacity: !canSend || isSending ? 0.6 : 1 }}
        >
          {isSending ? "Sending..." : sendLabel}
        </button>
        <button
          type="button"
          onClick={onCopyLink}
          className="btn btn-ghost"
          style={{ padding: "8px 14px" }}
        >
          {copyLabel}
        </button>
      </div>

      <div style={{ marginTop: 10, fontSize: 12, color: "var(--color-muted)" }}>
        {sentText ? `Sent ${sentText}` : "Not sent yet"}
      </div>
      <div
        style={{
          marginTop: 6,
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "var(--color-muted-2)",
          wordBreak: "break-all",
        }}
      >
        {shareUrl}
      </div>
      {error ? <div style={{ marginTop: 8, color: "#b22727", fontSize: 12 }}>{error}</div> : null}
    </div>
  );
}
