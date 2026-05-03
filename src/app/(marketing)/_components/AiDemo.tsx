export function AiDemo() {
  return (
    <section
      id="product"
      className="relative overflow-hidden"
      style={{
        background: "var(--color-ink)",
        color: "var(--color-cream)",
        padding: "120px 0",
      }}
    >
      <div
        aria-hidden
        className="absolute"
        style={{
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: "linear-gradient(90deg, transparent, var(--color-lime), transparent)",
        }}
      />
      <div className="container-brand">
        <div className="reveal" style={{ marginBottom: 64, maxWidth: 720 }}>
          <span
            className="pill"
            style={{
              marginBottom: 24,
              background: "rgba(212,255,58,0.1)",
              borderColor: "rgba(212,255,58,0.3)",
              color: "var(--color-lime)",
            }}
          >
            <span className="dot" /> AI ENGINE
          </span>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(38px, 5vw, 64px)",
              fontWeight: 400,
              lineHeight: 1.02,
              letterSpacing: "-0.02em",
              marginBottom: 20,
              color: "var(--color-cream)",
            }}
          >
            Type a sentence.
            <br />
            Get a <em style={{ fontStyle: "italic", color: "var(--color-lime)" }}>complete</em>
            <br />
            document.
          </h2>
          <p
            style={{
              fontSize: 18,
              maxWidth: 580,
              color: "rgba(255,255,255,0.65)",
            }}
          >
            Briv&apos;s models are trained on 2M+ service contracts. Describe the job in plain
            English — get a fully line-itemized estimate with industry-accurate pricing, scope,
            and terms.
          </p>
        </div>

        <div
          className="reveal grid items-center md:grid-cols-2"
          style={{ gap: 60, marginTop: 40 }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "var(--radius-brand)",
              padding: 24,
              fontFamily: "var(--font-mono)",
              fontSize: 13,
              color: "rgba(255,255,255,0.85)",
              lineHeight: 1.7,
              position: "relative",
            }}
          >
            <div
              style={{
                fontSize: 10,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--color-lime)",
                marginBottom: 12,
              }}
            >
              → User prompt
            </div>
            <p>
              &ldquo;Build me an estimate for a 3-bedroom kitchen remodel in Brooklyn. Walnut
              cabinets, quartz counters, three-week timeline. Around $14k budget. Client: Maya
              Reyes.&rdquo;
              <span
                aria-hidden
                style={{ color: "var(--color-lime)", animation: "blink 1s infinite" }}
              >
                |
              </span>
            </p>
          </div>

          <div
            className="relative"
            style={{
              background: "var(--color-cream)",
              color: "var(--color-ink)",
              borderRadius: "var(--radius-brand)",
              padding: 28,
              boxShadow: "0 30px 80px -20px rgba(212,255,58,0.2)",
            }}
          >
            <div
              className="absolute"
              style={{
                top: -10,
                right: 20,
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
              GENERATED IN 2.3s
            </div>
            <h4
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 24,
                marginBottom: 4,
                letterSpacing: "-0.01em",
              }}
            >
              Kitchen renovation
            </h4>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: "var(--color-muted)",
                marginBottom: 20,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              EST-0421 · MAYA REYES · 4 LINE ITEMS
            </div>
            {[
              ["Design consultation & site survey", "$850"],
              ["3D rendering + material spec", "$1,400"],
              ["Custom millwork — walnut", "$7,800"],
              ["Project mgmt + install", "$3,200"],
            ].map(([desc, price]) => (
              <div
                key={desc}
                className="grid"
                style={{
                  gridTemplateColumns: "1fr auto",
                  padding: "10px 0",
                  borderBottom: "1px dashed var(--color-line)",
                  fontSize: 13,
                }}
              >
                <span>{desc}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>{price}</span>
              </div>
            ))}
            <div
              className="flex items-baseline justify-between"
              style={{
                marginTop: 16,
                paddingTop: 14,
                borderTop: "2px solid var(--color-ink)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Total
              </span>
              <span style={{ fontFamily: "var(--font-serif)", fontSize: 32 }}>$14,425.94</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
