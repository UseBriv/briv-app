const SectionHead = () => (
  <div className="reveal" style={{ marginBottom: 64, maxWidth: 720 }}>
    <span className="pill" style={{ marginBottom: 24 }}>
      <span className="dot" /> THE PLATFORM
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
      Everything between
      <br />
      &ldquo;<em style={{ fontStyle: "italic", color: "var(--color-ember)" }}>hello</em>&rdquo; and &ldquo;paid.&rdquo;
    </h2>
    <p style={{ fontSize: 18, color: "var(--color-muted)", maxWidth: 580 }}>
      One workspace for the whole document lifecycle. No exporting, no copy-pasting, no
      QuickBooks tab purgatory.
    </p>
  </div>
);

type CardProps = {
  span: string;
  label: string;
  title: React.ReactNode;
  body: string;
  dark?: boolean;
  chips?: string[];
  activeChip?: string;
  icon: React.ReactNode;
};

function BentoCard({ span, label, title, body, dark, chips, activeChip, icon }: CardProps) {
  return (
    <div
      className="reveal flex flex-col justify-between overflow-hidden"
      style={{
        gridColumn: span,
        background: dark ? "var(--color-ink)" : "var(--color-cream)",
        color: dark ? "var(--color-cream)" : "var(--color-ink)",
        border: dark ? "1px solid var(--color-ink)" : "1px solid var(--color-line)",
        borderRadius: "var(--radius-brand-lg)",
        padding: 28,
        position: "relative",
        transition: "all 280ms cubic-bezier(0.2, 0.8, 0.2, 1)",
      }}
    >
      <span
        className="absolute"
        style={{
          top: 20,
          right: 20,
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: dark ? "rgba(255,255,255,0.4)" : "var(--color-muted-2)",
        }}
      >
        {label}
      </span>
      <div>
        <div
          className="grid place-items-center"
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: dark ? "rgba(212,255,58,0.15)" : "var(--color-paper-2)",
            marginBottom: 20,
          }}
        >
          {icon}
        </div>
        <h3
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: 26,
            lineHeight: 1.1,
            letterSpacing: "-0.01em",
            marginBottom: 10,
            fontWeight: 400,
            color: dark ? "var(--color-cream)" : "var(--color-ink)",
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontSize: 14,
            color: dark ? "rgba(255,255,255,0.6)" : "var(--color-muted)",
            lineHeight: 1.5,
          }}
        >
          {body}
        </p>
      </div>
      {chips && (
        <div className="mt-6 flex flex-wrap" style={{ gap: 8 }}>
          {chips.map((chip) => {
            const isActive = activeChip === chip;
            return (
              <span
                key={chip}
                style={{
                  padding: "8px 14px",
                  background: isActive ? "var(--color-ink)" : "var(--color-paper-2)",
                  color: isActive ? "var(--color-lime)" : undefined,
                  borderRadius: 999,
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  letterSpacing: "0.04em",
                }}
              >
                {chip}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function Bento() {
  return (
    <section className="container-brand" style={{ padding: "120px 0" }}>
      <SectionHead />
      <div className="bento-grid">
        <BentoCard
          dark
          span="span 3 / span 3"
          label="01 / AI"
          title={
            <>
              Generate full <em style={{ fontStyle: "italic", color: "var(--color-lime)" }}>estimates</em> from a sentence.
            </>
          }
          body="Briv AI drafts itemized scopes with industry-accurate pricing in seconds. Trained on 2M+ service contracts across construction, design, legal, and creative."
          chips={["Construction", "Design", "Legal", "Photography", "Consulting"]}
          activeChip="Construction"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--color-lime)" strokeWidth={2} width={20} height={20}>
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          }
        />
        <BentoCard
          span="span 3 / span 3"
          label="02 / SIGN"
          title={
            <>
              Legally binding <em style={{ fontStyle: "italic", color: "var(--color-ember)" }}>e-signatures.</em>
            </>
          }
          body="ESIGN & UETA compliant. Audit trail, IP logging, and identity verification — included on every plan."
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--color-ember)" strokeWidth={2} width={20} height={20}>
              <path d="M3 17l6-6 4 4 8-8" />
              <path d="M17 7h4v4" />
            </svg>
          }
        />
        <BentoCard
          span="span 2 / span 2"
          label="03 / PAY"
          title={
            <>
              Get paid <em style={{ fontStyle: "italic", color: "var(--color-ember)" }}>3× faster.</em>
            </>
          }
          body="PayPal, Stripe, ACH, and cards built in. No platform fees on Growth or Pro."
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--color-ember)" strokeWidth={2} width={20} height={20}>
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <path d="M2 10h20" />
            </svg>
          }
        />
        <BentoCard
          span="span 2 / span 2"
          label="04 / TEMPLATES"
          title={<>Smart templates.</>}
          body="Save a winning scope once, parameterize client, totals, and terms — then spin up polished docs in one click."
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--color-ember)" strokeWidth={2} width={20} height={20}>
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18M9 21V9" />
            </svg>
          }
        />
        <BentoCard
          span="span 2 / span 2"
          label="05 / TEAM"
          title={
            <>
              Real-time <em style={{ fontStyle: "italic", color: "var(--color-ember)" }}>collaboration.</em>
            </>
          }
          body="Comments, redlines, and approvals — all in the doc."
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--color-ember)" strokeWidth={2} width={20} height={20}>
              <circle cx="9" cy="7" r="4" />
              <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
              <circle cx="17" cy="7" r="3" />
              <path d="M22 21v-2a3 3 0 00-2-3" />
            </svg>
          }
        />
        <BentoCard
          span="span 6 / span 6"
          label="06 / STACK"
          title={
            <>
              Plays nice with the <em style={{ fontStyle: "italic", color: "var(--color-ember)" }}>tools you already use.</em>
            </>
          }
          body="QuickBooks, Xero, FreshBooks, HubSpot, Slack, Gmail, PayPal, Stripe. Two-way sync, no zaps required."
          chips={[
            "QuickBooks",
            "Xero",
            "PayPal",
            "Stripe",
            "HubSpot",
            "Slack",
            "Gmail",
            "+ 40 more",
          ]}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--color-ember)" strokeWidth={2} width={20} height={20}>
              <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
            </svg>
          }
        />
      </div>

      <style>{`
        .bento-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          grid-auto-rows: minmax(160px, auto);
          gap: 16px;
          align-items: stretch;
        }
        /* Row-two cards: equal thirds (2+2+2 on 6 cols) — avoids narrow “04” column + stray empty track */
        .bento-grid > :nth-child(3),
        .bento-grid > :nth-child(4),
        .bento-grid > :nth-child(5) {
          min-height: 220px;
        }
        @media (max-width: 900px) {
          .bento-grid { grid-template-columns: repeat(2, 1fr); }
          .bento-grid > div { grid-column: span 2 !important; grid-row: auto !important; min-height: 0 !important; }
        }
      `}</style>
    </section>
  );
}
