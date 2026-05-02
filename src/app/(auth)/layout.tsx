import type { ReactNode } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { env } from "@/lib/env";

export const dynamic = "force-dynamic";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="grid min-h-screen"
      style={{
        gridTemplateColumns: "1fr 1fr",
        background: "var(--color-paper)",
      }}
    >
      <div className="flex flex-col p-10">
        <Link href="/" className="mb-12">
          <Logo />
        </Link>
        <div className="flex flex-1 items-center justify-center">
          {env.hasClerk ? children : <ClerkNotConfigured />}
        </div>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--color-muted-2)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          © 2026 Briv, Inc.
        </div>
      </div>
      <div
        className="relative hidden overflow-hidden md:block"
        style={{ background: "var(--color-ink)", color: "var(--color-cream)" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 30%, rgba(212,255,58,0.18) 0%, transparent 70%)",
          }}
        />
        <div className="relative flex h-full items-center px-16">
          <div>
            <span
              className="pill"
              style={{
                background: "rgba(212,255,58,0.1)",
                borderColor: "rgba(212,255,58,0.3)",
                color: "var(--color-lime)",
              }}
            >
              <span className="dot" /> WELCOME BACK
            </span>
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 56,
                lineHeight: 1.02,
                letterSpacing: "-0.02em",
                marginTop: 24,
                color: "var(--color-cream)",
              }}
            >
              Estimates,
              <br />
              proposals &amp;{" "}
              <em style={{ fontStyle: "italic", color: "var(--color-lime)" }}>contracts</em>
              <br />
              that close themselves.
            </h2>
            <p style={{ color: "rgba(255,255,255,0.65)", marginTop: 18, maxWidth: 420 }}>
              Briv turns a one-line brief into a signed contract and a paid invoice — without
              the back-and-forth.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ClerkNotConfigured() {
  return (
    <div
      className="rounded-[16px] border p-8 text-center"
      style={{
        background: "var(--color-cream)",
        borderColor: "var(--color-line)",
        maxWidth: 420,
      }}
    >
      <span className="pill" style={{ marginBottom: 16 }}>
        <span className="dot" /> PREVIEW MODE
      </span>
      <h3
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: 28,
          letterSpacing: "-0.01em",
          marginBottom: 8,
        }}
      >
        Auth not yet configured
      </h3>
      <p style={{ color: "var(--color-muted)", fontSize: 14 }}>
        Add <code>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code> + <code>CLERK_SECRET_KEY</code> in
        Vercel project settings to enable sign-in.
      </p>
    </div>
  );
}
