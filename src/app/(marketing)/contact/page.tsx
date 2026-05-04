import type { Metadata } from "next";
import Link from "next/link";
import { MarketingPageShell } from "../_components/MarketingPageShell";
import { Mh2, PageHeading, Prose } from "../_components/MarketingSubpageBlocks";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Briv — sales, support, and general inquiries at hello@usebriv.com.",
};

export default function ContactPage() {
  return (
    <MarketingPageShell>
      <PageHeading eyebrow="Contact" title="Talk to the Briv team." />
      <Prose>
        <p style={{ marginBottom: 24 }}>
          For product questions, partnerships, press, or anything else — send us a note. We aim to
          reply within one to two business days.
        </p>
        <Mh2>Email</Mh2>
        <p style={{ marginBottom: 8 }}>
          <a
            href="mailto:hello@usebriv.com"
            style={{
              fontSize: 18,
              color: "var(--color-indigo-brand)",
              fontWeight: 600,
              textUnderlineOffset: 4,
            }}
          >
            hello@usebriv.com
          </a>
        </p>
        <p style={{ marginBottom: 28, fontSize: 14 }}>
          Tip: include your company name and whether you&apos;re asking about pricing, technical
          setup, or security review — we&apos;ll route it faster.
        </p>
        <Mh2>Existing customers</Mh2>
        <p style={{ marginBottom: 18 }}>
          Use the same address for support requests from your workspace admin email when possible so
          we can match your account.
        </p>
        <Mh2>Careers</Mh2>
        <p style={{ margin: 0 }}>
          Interested in joining? See{" "}
          <Link href="/careers" style={{ color: "var(--color-indigo-brand)", textUnderlineOffset: 3 }}>
            Careers
          </Link>{" "}
          for how we hire.
        </p>
      </Prose>
    </MarketingPageShell>
  );
}
