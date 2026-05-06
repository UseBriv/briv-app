import Link from "next/link";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { CheckIcon } from "@/components/ui/CheckIcon";

type Plan = {
  name: string;
  amount: React.ReactNode;
  period: React.ReactNode;
  annualNote?: React.ReactNode;
  tagline: string;
  cta: { label: string; href: string; variant: "ghost" | "lime" };
  features: string[];
  featured?: boolean;
};

const PLANS: Plan[] = [
  {
    name: "Starter",
    amount: "$0",
    period: "Forever free · no card required",
    tagline:
      "Send a few polished estimates and contracts each month — Briv branding on docs, 1% on payments.",
    cta: { label: "Start free", href: "/sign-up", variant: "ghost" },
    features: [
      "5 documents / month",
      "AI estimates, e-sign & Stripe/PayPal",
      "1 seat · Briv branding required",
      "1% platform fee on payments",
    ],
  },
  {
    name: "Growth",
    amount: (
      <>
        $<em style={{ fontStyle: "italic", color: "var(--color-lime)" }}>29</em>
        <span style={{ fontSize: "0.45em", fontFamily: "var(--font-sans)", fontWeight: 500 }}>/mo</span>
      </>
    ),
    period: "Month to month, or save with annual billing",
    annualNote: (
      <>
        <strong style={{ fontWeight: 600 }}>$278/yr</strong> billed annually (−20% vs $348)
      </>
    ),
    tagline: "Unlimited docs, custom branding, accounting sync — the sweet spot for growing teams.",
    cta: { label: "Start 14-day trial", href: "/sign-up?plan=growth", variant: "lime" },
    features: [
      "Unlimited documents",
      "Custom branding · no Briv watermark",
      "0% platform fees on payments",
      "QuickBooks & Xero sync",
      "Up to 10 team seats",
    ],
    featured: true,
  },
  {
    name: "Pro",
    amount: (
      <>
        $<em style={{ fontStyle: "italic", color: "var(--color-ember)" }}>79</em>
        <span style={{ fontSize: "0.45em", fontFamily: "var(--font-sans)", fontWeight: 500 }}>/mo</span>
      </>
    ),
    period: "Month to month, or save with annual billing",
    annualNote: (
      <>
        <strong style={{ fontWeight: 600 }}>$758/yr</strong> billed annually (−20% vs $948)
      </>
    ),
    tagline: "Agencies and multi-job teams — custom AI training on your contracts plus priority support.",
    cta: { label: "Get Pro", href: "/sign-up?plan=pro", variant: "ghost" },
    features: [
      "Everything in Growth",
      "Custom AI training on your docs",
      "Up to 25 team seats",
      "Priority support",
    ],
  },
];

type Cell = string | React.ReactNode;

const COMPARISON_ROWS: { feature: string; starter: Cell; growth: Cell; pro: Cell }[] = [
  { feature: "Documents per month", starter: "5", growth: "Unlimited", pro: "Unlimited" },
  { feature: "AI estimate generation", starter: "✓", growth: "✓", pro: "✓" },
  { feature: "E-signature", starter: "✓", growth: "✓", pro: "✓" },
  { feature: "Online payments (Stripe / PayPal)", starter: "✓", growth: "✓", pro: "✓" },
  { feature: "Custom branding", starter: "—", growth: "✓", pro: "✓" },
  {
    feature: "Briv branding on docs",
    starter: "Required",
    growth: "Removed",
    pro: "Removed",
  },
  { feature: "Platform fees on payments", starter: "1%", growth: "0%", pro: "0%" },
  { feature: "Team seats", starter: "1", growth: "Up to 10", pro: "Up to 25" },
  { feature: "QuickBooks / Xero sync", starter: "—", growth: "✓", pro: "✓" },
  { feature: "Custom AI training", starter: "—", growth: "—", pro: "✓" },
  { feature: "Priority support", starter: "—", growth: "—", pro: "✓" },
];

export function Pricing() {
  return (
    <section id="pricing" style={{ padding: "120px 0" }}>
      <div className="container-brand">
        <div className="reveal" style={{ marginBottom: 48, maxWidth: 800 }}>
          <span className="pill" style={{ marginBottom: 24 }}>
            <span className="dot" /> PRICING
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
            Three tiers.
            <br />
            <em style={{ fontStyle: "italic", color: "var(--color-ember)" }}>Price-competitive</em>,
            AI-margin-safe.
          </h2>
          <p style={{ fontSize: 18, color: "var(--color-muted)", maxWidth: 640, lineHeight: 1.55 }}>
            Starter for acquisition, Growth as the default, Pro for power users. Annual billing saves
            20% on paid plans. Cancel anytime; your docs stay yours.
          </p>
        </div>

        <div className="pricing-grid">
          {PLANS.map((plan) => (
            <PriceCard key={plan.name} plan={plan} />
          ))}
        </div>

        <div id="pricing-compare" className="reveal" style={{ marginTop: 72 }}>
          <h3
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(26px, 3.5vw, 36px)",
              fontWeight: 400,
              letterSpacing: "-0.02em",
              marginBottom: 8,
            }}
          >
            Tier comparison
          </h3>
          <p style={{ fontSize: 14, color: "var(--color-muted)", marginBottom: 24, maxWidth: 560 }}>
            Same core product on every tier — limits scale with how much you ship and how big your
            crew is.
          </p>
          <div className="pricing-table-wrap">
            <table className="pricing-table">
              <thead>
                <tr>
                  <th scope="col" className="pricing-th-feature">
                    Feature
                  </th>
                  <th scope="col">Starter</th>
                  <th scope="col" className="pricing-th-spotlight">
                    Growth <span aria-hidden>★</span>
                  </th>
                  <th scope="col">Pro</th>
                </tr>
              </thead>
              <tbody>
                <tr className="pricing-row-price">
                  <th scope="row">Monthly price</th>
                  <td>—</td>
                  <td className="pricing-td-spotlight">$29</td>
                  <td>$79</td>
                </tr>
                <tr>
                  <th scope="row">Annual (list ×12)</th>
                  <td>—</td>
                  <td className="pricing-td-spotlight">$348</td>
                  <td>$948</td>
                </tr>
                <tr>
                  <th scope="row">Billed annually (−20%)</th>
                  <td>—</td>
                  <td className="pricing-td-spotlight">$278</td>
                  <td>$758</td>
                </tr>
                {COMPARISON_ROWS.map((row) => (
                  <tr key={row.feature}>
                    <th scope="row">{row.feature}</th>
                    <td>{row.starter}</td>
                    <td className="pricing-td-spotlight">{row.growth}</td>
                    <td>{row.pro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div
          className="reveal grid items-center"
          style={{
            background: "var(--color-ink)",
            color: "var(--color-cream)",
            borderRadius: "var(--radius-brand-xl)",
            padding: 48,
            marginTop: 56,
            gridTemplateColumns: "1fr auto",
            gap: 32,
          }}
        >
          <div>
            <h3
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 36,
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                fontWeight: 400,
              }}
            >
              Built for teams who outgrew{" "}
              <em style={{ fontStyle: "italic", color: "var(--color-lime)" }}>QuickBooks</em>,
              FreshBooks &amp; HoneyBook.
            </h3>
            <p style={{ color: "rgba(255,255,255,0.6)", marginTop: 12, fontSize: 15 }}>
              Get enterprise-grade document automation at small-business pricing — without the
              spreadsheets, the duct-tape integrations, or the QuickBooks tab purgatory.
            </p>
          </div>
          <Link href="/sign-up" className="btn btn-lime btn-large">
            Get started <ArrowIcon />
          </Link>
        </div>
      </div>

      <style>{`
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-top: 48px;
        }
        @media (max-width: 900px) {
          .pricing-grid { grid-template-columns: 1fr; }
        }
        .pricing-table-wrap {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          border-radius: var(--radius-brand-lg);
          border: 1px solid var(--color-line);
          background: var(--color-cream);
        }
        .pricing-table {
          width: 100%;
          min-width: 520px;
          border-collapse: collapse;
          font-size: 14px;
        }
        .pricing-table th,
        .pricing-table td {
          padding: 12px 16px;
          text-align: left;
          border-bottom: 1px solid var(--color-line);
        }
        .pricing-table thead th {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--color-muted);
          background: var(--color-paper-2);
          border-bottom: 1px solid var(--color-line-strong);
        }
        .pricing-th-feature {
          width: 36%;
        }
        .pricing-th-spotlight,
        .pricing-td-spotlight {
          background: rgba(212, 255, 58, 0.12);
          color: var(--color-ink);
        }
        .pricing-table tbody th[scope="row"] {
          font-weight: 500;
          color: var(--color-ink);
          background: var(--color-paper);
        }
        .pricing-table tbody td {
          color: var(--color-muted);
        }
        .pricing-row-price td,
        .pricing-row-price th {
          font-weight: 600;
          color: var(--color-ink);
        }
        .pricing-table tr:last-child th,
        .pricing-table tr:last-child td {
          border-bottom: none;
        }
      `}</style>
    </section>
  );
}

function PriceCard({ plan }: { plan: Plan }) {
  const featured = plan.featured;
  return (
    <div
      className="reveal relative"
      style={{
        background: featured ? "var(--color-ink)" : "var(--color-cream)",
        color: featured ? "var(--color-cream)" : "var(--color-ink)",
        border: featured ? "1px solid var(--color-ink)" : "1px solid var(--color-line)",
        borderRadius: "var(--radius-brand-lg)",
        padding: 36,
        transition: "all 220ms",
      }}
    >
      {featured && (
        <span
          className="absolute"
          style={{
            top: -12,
            left: 36,
            background: "var(--color-lime)",
            color: "var(--color-ink)",
            padding: "4px 12px",
            borderRadius: 999,
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: "0.06em",
            fontWeight: 600,
            textTransform: "uppercase",
          }}
        >
          Best value
        </span>
      )}
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: featured ? "rgba(255,255,255,0.6)" : "var(--color-muted)",
          marginBottom: 12,
        }}
      >
        {plan.name}
      </div>
      <div
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: 64,
          lineHeight: 1,
          letterSpacing: "-0.025em",
          marginBottom: 4,
        }}
      >
        {plan.amount}
      </div>
      <div
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 13,
          color: featured ? "rgba(255,255,255,0.65)" : "var(--color-muted)",
          marginBottom: plan.annualNote ? 6 : 20,
          lineHeight: 1.45,
        }}
      >
        {plan.period}
      </div>
      {plan.annualNote && (
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: featured ? "rgba(255,255,255,0.5)" : "var(--color-muted-2)",
            marginBottom: 20,
            letterSpacing: "0.02em",
            lineHeight: 1.4,
          }}
        >
          {plan.annualNote}
        </div>
      )}
      <p
        style={{
          fontSize: 14,
          color: featured ? "rgba(255,255,255,0.7)" : "var(--color-muted)",
          marginBottom: 28,
          lineHeight: 1.5,
        }}
      >
        {plan.tagline}
      </p>
      <Link
        href={plan.cta.href}
        className={`btn ${plan.cta.variant === "lime" ? "btn-lime" : "btn-ghost"}`}
        style={{
          width: "100%",
          justifyContent: "center",
          ...(featured
            ? {}
            : plan.name === "Pro"
              ? {
                  borderColor: "var(--color-line-strong)",
                  color: "var(--color-ink)",
                }
              : {}),
        }}
      >
        {plan.cta.label}
      </Link>
      <ul
        style={{
          listStyle: "none",
          marginTop: 28,
          paddingTop: 28,
          borderTop: featured
            ? "1px solid rgba(255,255,255,0.12)"
            : "1px solid var(--color-line)",
        }}
      >
        {plan.features.map((f) => (
          <li
            key={f}
            className="flex items-start"
            style={{
              padding: "8px 0",
              fontSize: 13,
              gap: 10,
              color: featured ? "rgba(255,255,255,0.85)" : "var(--color-ink)",
            }}
          >
            <span
              aria-hidden
              style={{
                color: featured ? "var(--color-lime)" : "var(--color-ember)",
                flexShrink: 0,
                marginTop: 2,
              }}
            >
              <CheckIcon />
            </span>
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}
