import type { ReactNode } from "react";

const prose: React.CSSProperties = {
  color: "var(--color-muted)",
  fontSize: 16,
  lineHeight: 1.7,
};

const h2: React.CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontSize: 24,
  letterSpacing: "-0.02em",
  color: "var(--color-ink)",
  marginTop: 36,
  marginBottom: 12,
};

const h3: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: 15,
  fontWeight: 600,
  color: "var(--color-ink)",
  marginTop: 24,
  marginBottom: 8,
};

export function PageHeading({ title, eyebrow }: { title: string; eyebrow?: string }) {
  return (
    <header style={{ marginBottom: 40 }}>
      {eyebrow ? (
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--color-muted-2)",
            marginBottom: 12,
          }}
        >
          {eyebrow}
        </p>
      ) : null}
      <h1
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "clamp(2rem, 4vw, 2.75rem)",
          letterSpacing: "-0.02em",
          color: "var(--color-ink)",
          lineHeight: 1.15,
        }}
      >
        {title}
      </h1>
    </header>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return <div style={prose}>{children}</div>;
}

export function Mh2({ children }: { children: ReactNode }) {
  return <h2 style={h2}>{children}</h2>;
}

export function Mh3({ children }: { children: ReactNode }) {
  return <h3 style={h3}>{children}</h3>;
}

export function LastUpdated({ date }: { date: string }) {
  return (
    <p
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 12,
        color: "var(--color-muted-2)",
        marginBottom: 28,
      }}
    >
      Last updated {date}
    </p>
  );
}
