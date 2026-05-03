import { env } from "@/lib/env";

export function ConfigBanner() {
  const missing: string[] = [];
  if (!env.hasClerk) missing.push("Clerk");
  if (!env.hasDatabase) missing.push("Neon (DATABASE_URL)");
  if (!env.hasOpenAI) missing.push("OpenAI");
  if (!env.hasStripe) missing.push("Stripe");
  if (!env.hasResend) missing.push("Resend");

  if (missing.length === 0) return null;

  return (
    <div
      className="flex items-center justify-between gap-4 px-8 py-3"
      style={{
        background: "var(--color-ink)",
        color: "var(--color-cream)",
        fontFamily: "var(--font-mono)",
        fontSize: 12,
        letterSpacing: "0.04em",
      }}
    >
      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span
          aria-hidden
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "var(--color-ember)",
            boxShadow: "0 0 8px var(--color-ember)",
          }}
        />
        Preview mode · {missing.join(" · ")} not configured
      </span>
      <a
        href="https://github.com/UseBriv/briv-app#local-setup"
        target="_blank"
        rel="noreferrer"
        style={{ color: "var(--color-lime)" }}
      >
        Setup guide →
      </a>
    </div>
  );
}
