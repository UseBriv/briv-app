import { ArrowIcon } from "@/components/ui/ArrowIcon";

const STEPS = [
  {
    num: "01 — DRAFT",
    title: ["Brief the ", "AI"],
    body: "Type the job, the client, the rough budget. Briv drafts the rest.",
  },
  {
    num: "02 — SEND",
    title: ["Branded ", "proposal"],
    body: "One-click send. Client gets a beautiful interactive doc, not a dusty PDF.",
  },
  {
    num: "03 — NEGOTIATE",
    title: ["Track & ", "redline"],
    body: "See opens, edits, and questions in real time. No more “did you get my email?”",
  },
  {
    num: "04 — SIGN",
    title: ["Legally ", "binding"],
    body: "E-signature with audit trail. Counter-signs auto-trigger the invoice.",
  },
  {
    num: "05 — GET PAID",
    title: ["Money ", "in"],
    body: "PayPal, Stripe, ACH. Auto-reminders. Reconciles to your books.",
  },
];

const STATS = [
  { num: "12", em: "min", label: "Avg time, brief → sent" },
  { num: "3", em: "×", label: "Faster payment cycle" },
  { num: "94", em: "%", label: "Proposal acceptance rate" },
  { num: "$0", em: "", label: "Setup or onboarding fees" },
];

export function Workflow() {
  return (
    <section
      id="workflow"
      style={{
        padding: "120px 0",
        background: "var(--color-cream)",
        borderTop: "1px solid var(--color-line)",
        borderBottom: "1px solid var(--color-line)",
      }}
    >
      <div className="container-brand">
        <div className="reveal" style={{ marginBottom: 64, maxWidth: 720 }}>
          <span className="pill" style={{ marginBottom: 24 }}>
            <span className="dot" /> THE FLOW
          </span>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(38px, 5vw, 64px)",
              fontWeight: 400,
              lineHeight: 1.02,
              letterSpacing: "-0.02em",
              marginBottom: 20,
            }}
          >
            From brief
            <br />
            to <em style={{ fontStyle: "italic", color: "var(--color-ember)" }}>paid</em>, in five.
          </h2>
          <p style={{ fontSize: 18, color: "var(--color-muted)", maxWidth: 580 }}>
            Each step is one click. The whole flow takes about as long as making coffee.
          </p>
        </div>

        <div
          className="reveal workflow-track"
          style={{
            marginTop: 32,
            border: "1px solid var(--color-line)",
            borderRadius: "var(--radius-brand-lg)",
            overflow: "hidden",
            background: "var(--color-paper)",
          }}
        >
          {STEPS.map((step, i) => (
            <div
              key={step.num}
              className="wf-step"
              style={{
                padding: "32px 24px",
                position: "relative",
                background: "var(--color-cream)",
                transition: "background 240ms",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--color-muted-2)",
                  marginBottom: 12,
                  letterSpacing: "0.08em",
                }}
              >
                {step.num}
              </div>
              <h4
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 26,
                  lineHeight: 1.05,
                  marginBottom: 8,
                  fontWeight: 400,
                  letterSpacing: "-0.01em",
                }}
              >
                {step.title[0]}
                <em style={{ fontStyle: "italic", color: "var(--color-ember)" }}>
                  {step.title[1]}
                </em>
              </h4>
              <p style={{ fontSize: 13, color: "var(--color-muted)", lineHeight: 1.5 }}>
                {step.body}
              </p>
              {i < STEPS.length - 1 && (
                <div
                  className="wf-arrow grid place-items-center"
                  style={{
                    position: "absolute",
                    right: -10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 20,
                    height: 20,
                    background: "var(--color-paper)",
                    border: "1px solid var(--color-line)",
                    borderRadius: "50%",
                    zIndex: 2,
                    color: "var(--color-muted)",
                  }}
                >
                  <ArrowIcon size={10} strokeWidth={2.5} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="reveal" style={{ marginTop: 80 }}>
          <div className="stats-grid">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="stat-cell"
                style={{ padding: "36px 28px" }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "clamp(48px, 5vw, 72px)",
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                    marginBottom: 8,
                  }}
                >
                  {stat.num}
                  {stat.em && (
                    <em style={{ fontStyle: "italic", color: "var(--color-ember)" }}>
                      {stat.em}
                    </em>
                  )}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: "var(--color-muted)",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .workflow-track {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 0;
        }
        .wf-step { border-right: 1px solid var(--color-line); }
        .wf-step:last-child { border-right: none; }
        .wf-step:hover { background: var(--color-paper) !important; }
        @media (max-width: 900px) {
          .workflow-track { grid-template-columns: 1fr; }
          .wf-step { border-right: none; border-bottom: 1px solid var(--color-line); }
          .wf-step:last-child { border-bottom: none; }
          .wf-arrow { display: none !important; }
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
          border: 1px solid var(--color-line);
          border-radius: var(--radius-brand-lg);
          overflow: hidden;
          background: var(--color-cream);
        }
        .stat-cell { border-right: 1px solid var(--color-line); }
        .stat-cell:last-child { border-right: none; }
        @media (max-width: 720px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </section>
  );
}
