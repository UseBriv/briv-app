import Link from "next/link";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { CheckIcon } from "@/components/ui/CheckIcon";

type Plan = {
  name: string;
  amount: React.ReactNode;
  period: string;
  tagline: string;
  cta: { label: string; href: string; variant: "ghost" | "lime" };
  features: string[];
  featured?: boolean;
};

const PLANS: Plan[] = [
  {
    name: "Starter",
    amount: "$0",
    period: "Forever free",
    tagline: "For solo operators sending their first invoice.",
    cta: { label: "Start free", href: "/sign-up", variant: "ghost" },
    features: [
      "5 documents / month",
      "AI estimate generation",
      "E-signature & payments",
      "Briv branding",
    ],
  },
  {
    name: "Growth",
    amount: (
      <>
        $<em style={{ fontStyle: "italic", color: "var(--color-lime)" }}>29</em>
      </>
    ),
    period: "Per user / month, billed annually",
    tagline: "For growing service teams who need it all.",
    cta: { label: "Start 14-day trial", href: "/sign-up?plan=growth", variant: "lime" },
    features: [
      "Unlimited documents",
      "Custom branding & templates",
      "Zero platform fees on payments",
      "QuickBooks & Xero sync",
      "Team collaboration (up to 10)",
      "Priority support",
    ],
    featured: true,
  },
  {
    name: "Enterprise",
    amount: "Custom",
    period: "Volume pricing — let’s talk",
    tagline: "For larger teams with custom workflows & security needs.",
    cta: { label: "Book a call", href: "mailto:hello@usebriv.com", variant: "ghost" },
    features: [
      "Everything in Growth",
      "SSO + SAML",
      "Custom AI training on your contracts",
      "Dedicated CSM & uptime SLA",
      "HIPAA, SOC 2 Type II",
    ],
  },
];

export function Pricing() {
  return (
    <section id="pricing" style={{ padding: "120px 0" }}>
      <div className="container-brand">
        <div className="reveal" style={{ marginBottom: 48, maxWidth: 720 }}>
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
            Honest pricing.
            <br />
            Built for{" "}
            <em style={{ fontStyle: "italic", color: "var(--color-ember)" }}>small teams</em>.
          </h2>
          <p style={{ fontSize: 18, color: "var(--color-muted)", maxWidth: 580 }}>
            No per-seat games. No &ldquo;contact us&rdquo; for basic features. Cancel anytime,
            keep your docs forever.
          </p>
        </div>

        <div className="pricing-grid">
          {PLANS.map((plan) => (
            <PriceCard key={plan.name} plan={plan} />
          ))}
        </div>

        <div
          className="reveal grid items-center"
          style={{
            background: "var(--color-ink)",
            color: "var(--color-cream)",
            borderRadius: "var(--radius-brand-xl)",
            padding: 48,
            marginTop: 80,
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
            See full comparison <ArrowIcon />
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
          Most popular
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
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: featured ? "rgba(255,255,255,0.55)" : "var(--color-muted)",
          marginBottom: 28,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        {plan.period}
      </div>
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
        style={{ width: "100%", justifyContent: "center" }}
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
