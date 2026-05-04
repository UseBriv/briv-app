import type { Metadata } from "next";
import { MarketingPageShell } from "../_components/MarketingPageShell";
import { Mh2, Mh3, PageHeading, Prose } from "../_components/MarketingSubpageBlocks";

export const metadata: Metadata = {
  title: "About",
  description:
    "Briv helps service businesses turn briefs into estimates, proposals, contracts, and invoices — with AI and e‑signature in one workspace.",
};

export default function AboutPage() {
  return (
    <MarketingPageShell>
      <PageHeading eyebrow="Company" title="Built for teams who live in documents." />
      <Prose>
        <p style={{ marginBottom: 18 }}>
          Briv is the AI document workspace for modern service businesses — agencies, contractors,
          consultants, and anyone who sells scoped work. We connect drafting, client review,
          e‑signature, and billing so you spend less time chasing paperwork and more time delivering.
        </p>
        <Mh2>Why we exist</Mh2>
        <p style={{ marginBottom: 18 }}>
          Estimates, proposals, and contracts shouldn&apos;t live in ten different tools. Briv brings
          them together with a workflow your team can repeat: brief → polished doc → sent → signed →
          paid — with context that carries across every step.
        </p>
        <Mh2>How we think about AI</Mh2>
        <p style={{ marginBottom: 18 }}>
          AI should accelerate drafting and consistency, not replace your judgment. Briv uses models to
          turn rough inputs into structured documents you still control — brand, terms, pricing, and
          tone stay yours.
        </p>
        <Mh3>Security & trust</Mh3>
        <p>
          Identity and organizations are handled through industry-standard authentication. Your data is
          isolated per workspace and stored with infrastructure designed for production SaaS workloads.
          See our{" "}
          <a href="/privacy" style={{ color: "var(--color-indigo-brand)", textUnderlineOffset: 3 }}>
            Privacy Policy
          </a>{" "}
          for details on how we process information.
        </p>
      </Prose>
    </MarketingPageShell>
  );
}
