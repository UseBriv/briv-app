import type { Metadata } from "next";
import Link from "next/link";
import { MarketingPageShell } from "../_components/MarketingPageShell";
import { LastUpdated, Mh2, PageHeading, Prose } from "../_components/MarketingSubpageBlocks";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms governing your use of Briv’s websites, applications, and related services at usebriv.com.",
};

export default function TermsPage() {
  return (
    <MarketingPageShell>
      <PageHeading eyebrow="Legal" title="Terms of Service" />
      <LastUpdated date="May 3, 2026" />
      <Prose>
        <p style={{ marginBottom: 20 }}>
          These Terms of Service (“Terms”) govern your access to and use of the websites, applications,
          and services offered by Briv, Inc. (“Briv,” “we,” “us”) at{" "}
          <Link href="/" style={{ color: "var(--color-indigo-brand)", textUnderlineOffset: 3 }}>
            usebriv.com
          </Link>{" "}
          and related properties (collectively, the “Services”). By using the Services, you agree to
          these Terms and our{" "}
          <Link href="/privacy" style={{ color: "var(--color-indigo-brand)", textUnderlineOffset: 3 }}>
            Privacy Policy
          </Link>
          .
        </p>

        <Mh2>Eligibility</Mh2>
        <p style={{ marginBottom: 18 }}>
          You must be able to form a binding contract and meet any minimum age requirements in your
          jurisdiction. If you use the Services on behalf of an organization, you represent that you
          have authority to bind that organization.
        </p>

        <Mh2>Accounts & workspaces</Mh2>
        <p style={{ marginBottom: 18 }}>
          You are responsible for safeguarding credentials and for activity under your account. You
          must provide accurate information and keep it current. We may suspend or terminate accounts
          that violate these Terms or pose risk to the Services or other users.
        </p>

        <Mh2>Acceptable use</Mh2>
        <p style={{ marginBottom: 12 }}>
          You agree not to misuse the Services, including by:
        </p>
        <ul style={{ paddingLeft: 22, marginBottom: 18 }}>
          <li style={{ marginBottom: 10 }}>Violating applicable law or third-party rights.</li>
          <li style={{ marginBottom: 10 }}>
            Uploading malware, probing or attacking systems, or bypassing access controls.
          </li>
          <li style={{ marginBottom: 10 }}>
            Scraping, data mining, or reselling the Services in violation of our policies or
            technical limits.
          </li>
          <li style={{ marginBottom: 10 }}>
            Using AI features to generate unlawful, deceptive, or infringing content.
          </li>
        </ul>

        <Mh2>Your content</Mh2>
        <p style={{ marginBottom: 18 }}>
          You retain rights to content you submit. You grant Briv a worldwide license to host, process,
          transmit, and display your content solely to operate, secure, and improve the Services as you
          instruct. You represent that you have the rights needed for that content.
        </p>

        <Mh2>Fees & trials</Mh2>
        <p style={{ marginBottom: 18 }}>
          Paid plans are billed according to the pricing presented at purchase and your payment
          provider’s terms. Taxes may apply. We may change pricing with reasonable notice where
          required.
        </p>

        <Mh2>Third-party services</Mh2>
        <p style={{ marginBottom: 18 }}>
          The Services may integrate with third parties (e.g. authentication, payments, AI providers).
          Their terms and privacy practices apply to your use of those features.
        </p>

        <Mh2>Disclaimers</Mh2>
        <p style={{ marginBottom: 18 }}>
          THE SERVICES ARE PROVIDED “AS IS” AND “AS AVAILABLE.” TO THE MAXIMUM EXTENT PERMITTED BY
          LAW, BRIV DISCLAIMS ALL WARRANTIES, WHETHER EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY,
          FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
        </p>

        <Mh2>Limitation of liability</Mh2>
        <p style={{ marginBottom: 18 }}>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, BRIV WILL NOT BE LIABLE FOR ANY INDIRECT,
          INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR EXEMPLARY DAMAGES, OR FOR LOST PROFITS, DATA, OR
          GOODWILL. OUR AGGREGATE LIABILITY FOR CLAIMS RELATING TO THE SERVICES WILL NOT EXCEED THE
          GREATER OF AMOUNTS YOU PAID US FOR THE SERVICES IN THE TWELVE MONTHS BEFORE THE CLAIM OR
          ONE HUNDRED U.S. DOLLARS.
        </p>

        <Mh2>Indemnity</Mh2>
        <p style={{ marginBottom: 18 }}>
          You will defend and indemnify Briv against claims arising from your content, your use of the
          Services in violation of these Terms, or your violation of law or third-party rights.
        </p>

        <Mh2>Termination</Mh2>
        <p style={{ marginBottom: 18 }}>
          You may stop using the Services at any time. We may suspend or terminate access for conduct
          that violates these Terms or threatens the Services. Provisions that by their nature should
          survive will survive termination.
        </p>

        <Mh2>Governing law</Mh2>
        <p style={{ marginBottom: 18 }}>
          These Terms are governed by the laws of the State of Delaware, USA, excluding conflict-of-law
          rules, unless mandatory consumer protections in your jurisdiction say otherwise. Courts in
          Delaware have exclusive jurisdiction except where prohibited.
        </p>

        <Mh2>Changes</Mh2>
        <p style={{ marginBottom: 18 }}>
          We may modify these Terms by posting an updated version. Continued use after the effective
          date constitutes acceptance of the revised Terms where permitted by law.
        </p>

        <Mh2>Contact</Mh2>
        <p style={{ margin: 0 }}>
          Legal inquiries:{" "}
          <a href="mailto:hello@usebriv.com" style={{ color: "var(--color-indigo-brand)" }}>
            hello@usebriv.com
          </a>
          .
        </p>
      </Prose>
    </MarketingPageShell>
  );
}
