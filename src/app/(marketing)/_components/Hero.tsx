import Link from "next/link";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { CheckIcon } from "@/components/ui/CheckIcon";

export function Hero() {
  return (
    <section className="relative overflow-hidden" style={{ padding: "80px 0 100px" }}>
      <div className="pointer-events-none absolute inset-0 z-0">
        <div
          className="absolute"
          style={{
            top: -200,
            left: "50%",
            transform: "translateX(-50%)",
            width: 1100,
            height: 700,
            background:
              "radial-gradient(circle, rgba(212,255,58,0.18) 0%, rgba(212,255,58,0) 65%)",
            filter: "blur(20px)",
          }}
        />
        <div
          className="absolute"
          style={{
            bottom: -100,
            right: -100,
            width: 600,
            height: 600,
            background:
              "radial-gradient(circle, rgba(255,90,31,0.12) 0%, rgba(255,90,31,0) 65%)",
            filter: "blur(40px)",
          }}
        />
      </div>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: 0.4,
          backgroundImage:
            "linear-gradient(to right, var(--color-line) 1px, transparent 1px), linear-gradient(to bottom, var(--color-line) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 30%, black 30%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 30%, black 30%, transparent 75%)",
        }}
      />

      <div
        className="relative z-[2] mx-auto grid items-center gap-[60px] px-7 lg:grid-cols-[1.05fr_0.95fr]"
        style={{ maxWidth: 1320 }}
      >
        <div style={{ animation: "fade-up 800ms 100ms both" }}>
          <span className="pill" style={{ marginBottom: 28 }}>
            <span className="dot" /> NOW WITH AI v2.0 — DOC GEN IN 2.3s
          </span>

          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(48px, 7.2vw, 100px)",
              fontWeight: 400,
              lineHeight: 0.96,
              letterSpacing: "-0.025em",
              marginBottom: 24,
            }}
          >
            Estimates,
            <br />
            proposals &amp;
            <br />
            contracts that{" "}
            <em
              style={{
                position: "relative",
                display: "inline-block",
                fontStyle: "italic",
              }}
            >
              close
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 4,
                  height: 8,
                  background: "var(--color-lime)",
                  zIndex: -1,
                  borderRadius: 3,
                  transform: "skewX(-6deg)",
                }}
              />
            </em>
            <br />
            themselves.
          </h1>

          <p
            style={{
              fontSize: 18,
              lineHeight: 1.5,
              color: "var(--color-muted)",
              maxWidth: 540,
              marginBottom: 36,
            }}
          >
            Briv turns a one-line brief into a signed contract and a paid invoice — without the
            back-and-forth, the ten tabs, or the legal review.
          </p>

          <div
            className="flex flex-wrap items-center"
            style={{ gap: 12, marginBottom: 32 }}
          >
            <Link href="/sign-up" className="btn btn-primary btn-large">
              Start free for 14 days
              <ArrowIcon />
            </Link>
            <Link href="#product" className="btn btn-ghost btn-large">
              <svg
                width={14}
                height={14}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Watch 90s demo
            </Link>
          </div>

          <div
            className="flex flex-wrap"
            style={{
              gap: 24,
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "var(--color-muted-2)",
            }}
          >
            {["No credit card", "5-min setup", "SOC 2 compliant"].map((t) => (
              <span key={t} className="inline-flex items-center" style={{ gap: 6 }}>
                <span
                  className="inline-grid place-items-center rounded-full"
                  style={{
                    color: "var(--color-ink)",
                    background: "var(--color-lime)",
                    width: 14,
                    height: 14,
                  }}
                >
                  <CheckIcon size={8} strokeWidth={4} />
                </span>
                {t}
              </span>
            ))}
          </div>
        </div>

        <HeroDocStage />
      </div>
    </section>
  );
}

function HeroDocStage() {
  return (
    <div
      className="relative"
      style={{ height: 600, animation: "fade-up 800ms 250ms both" }}
    >
      {/* Floating AI prompt chip */}
      <div
        className="absolute"
        style={{
          top: -20,
          right: -20,
          width: 220,
          padding: "14px 18px",
          background: "var(--color-ink)",
          color: "var(--color-cream)",
          border: "1px solid var(--color-ink)",
          borderRadius: "var(--radius-brand-lg)",
          boxShadow: "var(--shadow-float)",
          transform: "rotate(3deg)",
          animation: "float-soft-2 5s ease-in-out infinite",
          overflow: "hidden",
        }}
      >
        <div
          className="flex items-center"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            color: "var(--color-lime)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: 6,
            gap: 6,
          }}
        >
          <span
            aria-hidden
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--color-lime)",
              boxShadow: "0 0 8px var(--color-lime)",
              animation: "pulse-dot 1.6s infinite",
            }}
          />
          Briv AI · drafting
        </div>
        <div
          style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontSize: 16,
            lineHeight: 1.3,
          }}
        >
          “Quote for kitchen reno, $14k budget”
          <span
            aria-hidden
            style={{
              display: "inline-block",
              width: 2,
              height: 14,
              background: "var(--color-lime)",
              verticalAlign: "middle",
              marginLeft: 2,
              animation: "blink 1s steps(2) infinite",
            }}
          />
        </div>
      </div>

      {/* Main invoice */}
      <div
        className="absolute overflow-hidden"
        style={{
          top: 30,
          left: 0,
          right: 0,
          width: "105%",
          maxWidth: 540,
          marginLeft: "-2%",
          background: "var(--color-cream)",
          border: "1px solid var(--color-line)",
          borderRadius: "var(--radius-brand-lg)",
          boxShadow: "var(--shadow-float)",
          transform: "rotate(-1.2deg)",
          transition: "transform 600ms cubic-bezier(0.2, 0.8, 0.2, 1)",
        }}
      >
        <div
          className="flex items-start justify-between"
          style={{
            padding: "24px 28px 16px",
            borderBottom: "1px solid var(--color-line)",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 24,
                letterSpacing: "-0.01em",
              }}
            >
              Northpoint Studio
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: "var(--color-muted-2)",
                marginTop: 2,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Interior design · Brooklyn, NY
            </div>
          </div>
          <div
            style={{
              textAlign: "right",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--color-muted)",
            }}
          >
            <strong
              style={{
                display: "block",
                color: "var(--color-ink)",
                fontSize: 14,
                marginBottom: 4,
              }}
            >
              EST-0421
            </strong>
            April 28, 2026
          </div>
        </div>

        <div style={{ padding: "24px 28px" }}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "var(--color-muted-2)",
              marginBottom: 8,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Billed to
          </div>
          <div
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 18,
              marginBottom: 4,
            }}
          >
            Maya &amp; Theo Reyes
          </div>
          <div
            style={{
              fontSize: 13,
              color: "var(--color-muted)",
              marginBottom: 24,
            }}
          >
            412 Sterling Pl, Brooklyn — Kitchen renovation
          </div>

          <div style={{ width: "100%", borderTop: "1px solid var(--color-line)" }}>
            {[
              { d: "Design consultation & site survey", q: "1 × $850", a: "$850.00" },
              { d: "3D rendering + material spec", q: "1 × $1,400", a: "$1,400.00" },
              {
                d: "Custom millwork — walnut cabinetry",
                q: "1 × $7,800",
                a: "$7,800.00",
                ai: true,
              },
              { d: "Project mgmt + install (3 wks)", q: "1 × $3,200", a: "$3,200.00" },
            ].map((row, idx) => (
              <DocRow key={idx} {...row} />
            ))}
          </div>

          <div
            className="grid"
            style={{
              gridTemplateColumns: "1fr auto",
              gap: "6px 16px",
              padding: "16px 0",
              fontSize: 13,
            }}
          >
            <span style={subLabel}>Subtotal</span>
            <span style={subValue}>$13,250.00</span>
            <span style={subLabel}>Tax (8.875%)</span>
            <span style={subValue}>$1,175.94</span>
            <span style={totalLabel}>Total due</span>
            <span style={totalValue}>$14,425.94</span>
          </div>
        </div>

        <div
          className="flex items-center justify-between"
          style={{
            padding: "16px 28px",
            background: "var(--color-paper-2)",
            borderTop: "1px solid var(--color-line)",
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "var(--color-muted)",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          <span>VIA PAYPAL · STRIPE · ACH</span>
          <span
            className="inline-flex items-center"
            style={{
              background: "var(--color-ink)",
              color: "var(--color-cream)",
              padding: "6px 12px",
              borderRadius: 999,
              fontSize: 10,
              letterSpacing: "0.06em",
              gap: 6,
            }}
          >
            <span
              aria-hidden
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--color-lime)",
                boxShadow: "0 0 6px var(--color-lime)",
              }}
            />
            Pay invoice
          </span>
        </div>
      </div>

      {/* Signature card */}
      <div
        className="absolute"
        style={{
          bottom: 60,
          right: -10,
          width: 240,
          padding: 18,
          background: "var(--color-ink)",
          color: "var(--color-cream)",
          border: "1px solid var(--color-ink)",
          borderRadius: "var(--radius-brand-lg)",
          boxShadow: "var(--shadow-float)",
          transform: "rotate(4deg)",
          animation: "float-soft 6s ease-in-out infinite",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.5)",
            marginBottom: 8,
          }}
        >
          Signed &amp; verified
        </div>
        <div
          style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontSize: 32,
            lineHeight: 1,
            marginBottom: 12,
          }}
        >
          Maya R.
        </div>
        <div
          className="flex justify-between"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "rgba(255,255,255,0.5)",
            paddingTop: 10,
            borderTop: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <span>11:42 AM</span>
          <span style={{ color: "var(--color-lime)" }}>● VERIFIED</span>
        </div>
      </div>
    </div>
  );
}

function DocRow({ d, q, a, ai }: { d: string; q: string; a: string; ai?: boolean }) {
  return (
    <div
      className="grid items-center"
      style={{
        gridTemplateColumns: "1fr auto 80px",
        gap: 16,
        padding: "12px 0",
        borderBottom: "1px solid var(--color-line)",
        fontSize: 13,
        position: "relative",
        background: ai
          ? "linear-gradient(90deg, transparent 0%, rgba(212,255,58,0.18) 50%, transparent 100%)"
          : undefined,
        backgroundSize: ai ? "200% 100%" : undefined,
        animation: ai ? "shimmer-row 2.4s infinite" : undefined,
      }}
    >
      <span style={{ color: "var(--color-ink)" }}>
        {d}
        {ai && (
          <span
            style={{
              display: "inline-block",
              marginLeft: 8,
              padding: "1px 5px",
              background: "var(--color-ink)",
              color: "var(--color-lime)",
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              fontWeight: 600,
              borderRadius: 4,
              letterSpacing: "0.05em",
              verticalAlign: "middle",
            }}
          >
            AI
          </span>
        )}
      </span>
      <span style={{ color: "var(--color-muted)", fontFamily: "var(--font-mono)", fontSize: 11 }}>
        {q}
      </span>
      <span
        style={{
          textAlign: "right",
          fontFamily: "var(--font-mono)",
          fontSize: 12,
        }}
      >
        {a}
      </span>
    </div>
  );
}

const subLabel: React.CSSProperties = {
  color: "var(--color-muted)",
  fontFamily: "var(--font-mono)",
  fontSize: 11,
};
const subValue: React.CSSProperties = {
  textAlign: "right",
  fontFamily: "var(--font-mono)",
  fontSize: 12,
};
const totalLabel: React.CSSProperties = {
  paddingTop: 12,
  borderTop: "1px solid var(--color-line)",
  fontFamily: "var(--font-serif)",
  fontSize: 14,
  color: "var(--color-muted)",
};
const totalValue: React.CSSProperties = {
  paddingTop: 12,
  borderTop: "1px solid var(--color-line)",
  fontFamily: "var(--font-serif)",
  fontSize: 20,
  textAlign: "right",
};
