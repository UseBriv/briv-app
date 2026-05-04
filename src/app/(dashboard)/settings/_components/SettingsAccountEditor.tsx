"use client";

import { useUser } from "@clerk/nextjs";
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
  initialFirstName: string;
  initialLastName: string;
  initialEmail: string;
};

export function SettingsAccountEditor({ initialFirstName, initialLastName, initialEmail }: Props) {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    if (!isLoaded || !user) return;
    setFirstName(user.firstName ?? "");
    setLastName(user.lastName ?? "");
  }, [isLoaded, user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const email =
    user?.primaryEmailAddress?.emailAddress ?? user?.emailAddresses[0]?.emailAddress ?? initialEmail;

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setMessage(null);
    try {
      await user.update({
        firstName: firstName.trim() || undefined,
        lastName: lastName.trim() || undefined,
      });
      setMessage({ type: "ok", text: "Saved." });
      router.refresh();
    } catch (err) {
      const text = err instanceof Error ? err.message : "Could not save profile.";
      setMessage({ type: "err", text });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSave} className="grid gap-3">
      <FieldRow label="First name">
        <input
          aria-label="First name"
          name="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          style={inputStyle}
          disabled={!isLoaded}
          autoComplete="given-name"
        />
      </FieldRow>
      <FieldRow label="Last name">
        <input
          aria-label="Last name"
          name="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          style={inputStyle}
          disabled={!isLoaded}
          autoComplete="family-name"
        />
      </FieldRow>
      <FieldRow label="Email">
        <div className="grid gap-1">
          <span style={{ fontSize: 14 }}>{email || "—"}</span>
          <span style={{ fontSize: 12, color: "var(--color-muted)" }}>
            To change your email, use the profile menu (avatar) → Manage account.
          </span>
        </div>
      </FieldRow>
      <div className="flex flex-wrap items-center gap-3 pt-1">
        <button className="btn btn-primary" type="submit" disabled={saving || !isLoaded}>
          {saving ? "Saving…" : "Save account"}
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
