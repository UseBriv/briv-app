import type { Metadata } from "next";
import Link from "next/link";
import { MarketingPageShell } from "../_components/MarketingPageShell";
import { LastUpdated, Mh2, Mh3, PageHeading, Prose } from "../_components/MarketingSubpageBlocks";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Briv collects, uses, and protects personal information when you use usebriv.com and related services.",
};

export default function PrivacyPage() {
  return (
    <MarketingPageShell>
      <PageHeading eyebrow="Legal" title="Privacy Policy" />
      <LastUpdated date="May 3, 2026" />
      <Prose>
        <p style={{ marginBottom: 20 }}>
          This Privacy Policy describes how Briv, Inc. (“Briv,” “we,” “us”) handles information when
          you visit{" "}
          <Link href="/" style={{ color: "var(--color-indigo-brand)", textUnderlineOffset: 3 }}>
            usebriv.com
          </Link>
          , use our applications, or communicate with us. By using our services, you agree to this
          policy along with our{" "}
          <Link href="/terms" style={{ color: "var(--color-indigo-brand)", textUnderlineOffset: 3 }}>
            Terms of Service
          </Link>
          .
        </p>

        <Mh2>Information we collect</Mh2>
        <Mh3>Account & workspace data</Mh3>
        <p style={{ marginBottom: 16 }}>
          When you create an account or join a workspace, we process identifiers such as your name,
          email address, organization name, and role — typically through our authentication and
          organization provider. This lets you sign in and collaborate with your team.
        </p>
        <Mh3>Content you provide</Mh3>
        <p style={{ marginBottom: 16 }}>
          We store the documents, client information, line items, messages, and other content you
          create in the product so the service can function (drafting, sending, signatures, billing,
          etc.).
        </p>
        <Mh3>Usage & technical data</Mh3>
        <p style={{ marginBottom: 16 }}>
          Like most SaaS products, we collect logs and diagnostics (IP address, browser type,
          timestamps, approximate region, error reports) to operate, secure, and improve the
          service.
        </p>

        <Mh2>How we use information</Mh2>
        <ul style={{ paddingLeft: 22, marginBottom: 18 }}>
          <li style={{ marginBottom: 10 }}>Provide, maintain, and improve features you request.</li>
          <li style={{ marginBottom: 10 }}>Authenticate users, manage workspaces, and enforce access control.</li>
          <li style={{ marginBottom: 10 }}>Process payments and subscriptions where applicable.</li>
          <li style={{ marginBottom: 10 }}>Send service-related messages (e.g. security, product updates); marketing only where permitted and with opt-out where required.</li>
          <li style={{ marginBottom: 10 }}>Comply with law, respond to lawful requests, and protect rights and safety.</li>
        </ul>

        <Mh2>AI features</Mh2>
        <p style={{ marginBottom: 18 }}>
          If you use AI-assisted drafting or analysis, the inputs you provide may be sent to model
          providers to generate output. We configure these integrations to support the product; you
          should not submit sensitive data you are not allowed to share.
        </p>

        <Mh2>Sharing</Mh2>
        <p style={{ marginBottom: 16 }}>
          We share information with service providers that help us run the product (e.g. hosting,
          database, email delivery, authentication, payments, analytics). They may process data only
          as instructed and subject to appropriate safeguards. We may disclose information if
          required by law or to protect users and the public.
        </p>

        <Mh2>Retention</Mh2>
        <p style={{ marginBottom: 18 }}>
          We keep information for as long as your account is active and as needed to provide the
          service, comply with legal obligations, resolve disputes, and enforce agreements. You can
          request deletion where applicable; some records may be retained where the law requires.
        </p>

        <Mh2>Security</Mh2>
        <p style={{ marginBottom: 18 }}>
          We use industry-standard measures for a cloud SaaS product. No method of transmission or
          storage is 100% secure; we work to protect your data in line with the sensitivity of the
          service.
        </p>

        <Mh2>Your rights</Mh2>
        <p style={{ marginBottom: 18 }}>
          Depending on where you live, you may have rights to access, correct, delete, or export
          personal data, or to object to or restrict certain processing. Contact us to exercise these
          rights. You may also have the right to complain to a supervisory authority.
        </p>

        <Mh2>Children</Mh2>
        <p style={{ marginBottom: 18 }}>
          Briv is not directed at children under 16, and we do not knowingly collect their personal
          information.
        </p>

        <Mh2>International transfers</Mh2>
        <p style={{ marginBottom: 18 }}>
          We may process information in the United States and other countries where we or our vendors
          operate. Where required, we use appropriate transfer mechanisms.
        </p>

        <Mh2>Changes</Mh2>
        <p style={{ marginBottom: 18 }}>
          We may update this policy from time to time. We will post the revised version on this page
          and adjust the “Last updated” date.
        </p>

        <Mh2>Contact</Mh2>
        <p style={{ margin: 0 }}>
          Questions about privacy:{" "}
          <a href="mailto:hello@usebriv.com" style={{ color: "var(--color-indigo-brand)" }}>
            hello@usebriv.com
          </a>
          .
        </p>
      </Prose>
    </MarketingPageShell>
  );
}
