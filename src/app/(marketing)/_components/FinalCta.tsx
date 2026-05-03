import Link from "next/link";
import { ArrowIcon } from "@/components/ui/ArrowIcon";

export function FinalCta() {
  return (
    <section
      className="relative overflow-hidden text-center"
      style={{ padding: "140px 0" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(212,255,58,0.18) 0%, transparent 70%)",
        }}
      />
      <div className="container-narrow relative z-[2]">
        <span className="pill" style={{ marginBottom: 32 }}>
          <span className="dot" /> READY WHEN YOU ARE
        </span>
        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(60px, 9vw, 140px)",
            lineHeight: 0.92,
            letterSpacing: "-0.03em",
            marginBottom: 32,
            position: "relative",
            zIndex: 2,
          }}
        >
          Send your first
          <br />
          doc in{" "}
          <em
            style={{
              fontStyle: "italic",
              position: "relative",
              display: "inline-block",
            }}
          >
            five
            <span
              aria-hidden
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 8,
                height: 14,
                background: "var(--color-lime)",
                zIndex: -1,
                borderRadius: 6,
                transform: "skewX(-6deg)",
              }}
            />
          </em>
          .
        </h2>
        <p
          style={{
            fontSize: 19,
            color: "var(--color-muted)",
            maxWidth: 520,
            margin: "0 auto 40px",
          }}
        >
          No card required. No &ldquo;talk to sales.&rdquo; Just a working AI document
          workspace, in five minutes.
        </p>
        <Link
          href="/sign-up"
          className="btn btn-primary btn-large"
          style={{ fontSize: 16, padding: "18px 32px" }}
        >
          Start free for 14 days <ArrowIcon />
        </Link>
      </div>
    </section>
  );
}
