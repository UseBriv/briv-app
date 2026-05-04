"use client";

import { useOrganization } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const inputStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: 360,
  padding: "8px 10px",
  fontSize: 14,
  borderRadius: 8,
  border: "1px solid var(--color-line-strong)",
  background: "var(--color-cream)",
  color: "var(--color-ink)",
};

type Props = {
  planLabel: string;
  initialName: string;
};

export function SettingsWorkspaceEditor({ planLabel, initialName }: Props) {
  const router = useRouter();
  const { organization, isLoaded } = useOrganization();
  const [name, setName] = useState(initialName);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    if (!organization) return;
    setName(organization.name);
  }, [organization?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (!organization) return;
    const trimmed = name.trim();
    if (!trimmed) {
      setMessage({ type: "err", text: "Workspace name is required." });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      await organization.update({ name: trimmed });
      setMessage({ type: "ok", text: "Saved." });
      router.refresh();
    } catch (err) {
      const text = err instanceof Error ? err.message : "Could not update workspace.";
      setMessage({ type: "err", text });
    } finally {
      setSaving(false);
    }
  }

  if (!isLoaded) {
    return (
      <p style={{ color: "var(--color-muted)", fontSize: 14 }}>Loading workspace…</p>
    );
  }

  if (!organization) {
    return (
      <p style={{ color: "var(--color-muted)", fontSize: 14, lineHeight: 1.5 }}>
        No active workspace. Create or select an organization from the switcher in the header to
        manage its name here.
      </p>
    );
  }

  return (
    <form onSubmit={onSave} className="grid gap-3">
      <FieldRow label="Name">
        <input
          aria-label="Workspace name"
          name="workspaceName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
          autoComplete="organization"
        />
      </FieldRow>
      <FieldRow label="Plan">
        <span style={{ fontSize: 14 }}>{planLabel}</span>
      </FieldRow>
      <div className="flex flex-wrap items-center gap-3 pt-1">
        <button className="btn btn-primary" type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save workspace"}
        </button>
        {message && (
          <span
            style={{
              fontSize: 13,
              color: message.type === "ok" ? "var(--color-muted)" : "var(--color-ember)",
            }}
          >
            {message.text}
          </span>
        )}
      </div>
    </form>
  );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      className="grid items-start sm:items-center"
      style={{
        gridTemplateColumns: "minmax(0, 180px) 1fr",
        padding: "10px 0",
        borderTop: "1px solid var(--color-line)",
        gap: 8,
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "var(--color-muted-2)",
          paddingTop: 6,
        }}
      >
        {label}
      </span>
      <div>{children}</div>
    </div>
  );
}
