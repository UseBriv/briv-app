import type { Metadata } from "next";
import Link from "next/link";
import { MarketingPageShell } from "../_components/MarketingPageShell";
import { Mh2, PageHeading, Prose } from "../_components/MarketingSubpageBlocks";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join Briv — we're building the AI document workspace for service businesses. See open roles and how to get in touch.",
};

export default function CareersPage() {
  return (
    <MarketingPageShell>
      <PageHeading eyebrow="Careers" title="Help us ship the future of client documents." />
      <Prose>
        <p style={{ marginBottom: 18 }}>
          We&apos;re a small team obsessed with workflow, clear writing, and tools that respect how
          real businesses close deals. If that sounds like you, we&apos;d love to hear from you —
          even when we don&apos;t have a published opening.
        </p>
        <Mh2>Open roles</Mh2>
        <p style={{ marginBottom: 16 }}>
          We don&apos;t maintain a separate job board yet. When roles open, we&apos;ll list them here.
          In the meantime, send a short note and link to your work — we read every message.
        </p>
        <div
          className="rounded-[var(--radius-brand)] border p-6"
          style={{
            borderColor: "var(--color-line-strong)",
            background: "rgba(255,255,255,0.45)",
            marginBottom: 28,
          }}
        >
          <p style={{ margin: 0, color: "var(--color-ink)", fontWeight: 600, marginBottom: 8 }}>
            General applications
          </p>
          <p style={{ margin: 0, marginBottom: 16 }}>
            Engineering, design, customer success, and go‑to‑market — tell us what you&apos;d bring to
            Briv.
          </p>
          <a
            href="mailto:hello@usebriv.com?subject=Careers%20at%20Briv"
            className="btn btn-primary"
            style={{ display: "inline-flex" }}
          >
            Email hello@usebriv.com
          </a>
        </div>
        <Mh2>Where we work</Mh2>
        <p style={{ marginBottom: 18 }}>
          We operate as a distributed team with overlap hours for collaboration. Remote‑friendly by
          default; we care about output and communication, not postcode.
        </p>
        <p style={{ margin: 0 }}>
          Questions? Visit{" "}
          <Link href="/contact" style={{ color: "var(--color-indigo-brand)", textUnderlineOffset: 3 }}>
            Contact
          </Link>{" "}
          or write to{" "}
          <a href="mailto:hello@usebriv.com" style={{ color: "var(--color-indigo-brand)" }}>
            hello@usebriv.com
          </a>
          .
        </p>
      </Prose>
    </MarketingPageShell>
  );
}
