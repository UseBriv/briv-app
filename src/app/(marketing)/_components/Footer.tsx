import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

const COLS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Estimates", href: "/#product" },
      { label: "Proposals", href: "/#product" },
      { label: "Contracts", href: "/#product" },
      { label: "Invoicing", href: "/#product" },
      { label: "Integrations", href: "/#product" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Templates", href: "/templates" },
      { label: "Guides", href: "/guides" },
      { label: "API docs", href: "/docs" },
      { label: "Changelog", href: "/changelog" },
      { label: "Status", href: "https://status.usebriv.com" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer
      className="relative"
      style={{
        background: "var(--color-ink)",
        color: "var(--color-cream)",
        padding: "80px 0 40px",
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
          background: "linear-gradient(90deg, transparent, rgba(212,255,58,0.4), transparent)",
        }}
      />
      <div className="container-brand">
        <div className="footer-grid" style={{ marginBottom: 48 }}>
          <div>
            <Logo variant="cream" />
            <p
              style={{
                color: "rgba(255,255,255,0.55)",
                fontSize: 14,
                maxWidth: 320,
                lineHeight: 1.5,
                marginTop: 16,
              }}
            >
              The AI document workspace for modern service businesses.
            </p>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <h5
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--color-lime)",
                  marginBottom: 16,
                  fontWeight: 500,
                }}
              >
                {col.title}
              </h5>
              <ul style={{ listStyle: "none", padding: 0 }}>
                {col.links.map((link) => (
                  <li key={link.label} style={{ marginBottom: 10 }}>
                    <Link
                      href={link.href}
                      style={{
                        color: "rgba(255,255,255,0.7)",
                        textDecoration: "none",
                        fontSize: 14,
                        transition: "color 160ms",
                      }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="flex flex-wrap items-center justify-between"
          style={{
            paddingTop: 24,
            borderTop: "1px solid rgba(255,255,255,0.1)",
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "rgba(255,255,255,0.4)",
            letterSpacing: "0.04em",
            gap: 12,
          }}
        >
          <span>© 2026 BRIV, INC. ALL RIGHTS RESERVED.</span>
          <span>BUILT WITH ☉ FOR THE SERVICE INDUSTRY</span>
        </div>
      </div>

      <style>{`
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 40px;
        }
        @media (max-width: 800px) {
          .footer-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </footer>
  );
}
