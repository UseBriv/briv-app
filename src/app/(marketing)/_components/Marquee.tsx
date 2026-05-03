const ITEMS = [
  ["North", "point", " Studio"],
  ["Hawthorn & Co."],
  ["Field", "note", " Architects"],
  ["Stillwater Build"],
  ["Plum", "tree", " Legal"],
  ["Atlas Photo Co."],
  ["Re", "vere", " Consulting"],
] as const;

export function Marquee() {
  const renderItems = (key: string) =>
    ITEMS.flatMap((parts, i) => [
      <span
        key={`${key}-${i}-item`}
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: 32,
          color: "var(--color-muted)",
          whiteSpace: "nowrap",
          letterSpacing: "-0.01em",
          transition: "color 200ms",
        }}
      >
        {parts.map((p, j) =>
          j === 1 && parts.length > 1 ? (
            <em key={j} style={{ fontStyle: "italic" }}>
              {p}
            </em>
          ) : (
            <span key={j}>{p}</span>
          ),
        )}
      </span>,
      <span
        key={`${key}-${i}-dot`}
        aria-hidden
        style={{
          display: "inline-block",
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "var(--color-ink)",
          margin: "0 12px",
          verticalAlign: "middle",
        }}
      />,
    ]);

  return (
    <section
      style={{
        padding: "60px 0",
        borderTop: "1px solid var(--color-line)",
        borderBottom: "1px solid var(--color-line)",
        background: "var(--color-cream)",
      }}
    >
      <div
        style={{
          textAlign: "center",
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--color-muted-2)",
          marginBottom: 32,
        }}
      >
        Trusted by 4,200+ service teams
      </div>
      <div
        style={{
          overflow: "hidden",
          maskImage:
            "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        }}
      >
        <div
          className="flex"
          style={{
            gap: 80,
            animation: "marquee 35s linear infinite",
            width: "max-content",
          }}
        >
          {renderItems("a")}
          {renderItems("b")}
        </div>
      </div>
    </section>
  );
}
