import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { ArrowIcon } from "@/components/ui/ArrowIcon";

export function Nav() {
  return (
    <div
      className="sticky top-0 z-[100] border-b"
      style={{
        background: "rgba(244, 240, 232, 0.78)",
        backdropFilter: "blur(14px) saturate(140%)",
        WebkitBackdropFilter: "blur(14px) saturate(140%)",
        borderColor: "var(--color-line)",
      }}
    >
      <nav
        className="mx-auto flex items-center justify-between px-7"
        style={{ maxWidth: 1320, padding: "18px 28px" }}
      >
        <Logo />
        <div
          className="hidden items-center md:flex"
          style={{
            gap: 36,
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          <Link href="#product" className="text-[color:var(--color-muted)] hover:text-[color:var(--color-ink)] transition-colors">
            Product
          </Link>
          <Link href="#workflow" className="text-[color:var(--color-muted)] hover:text-[color:var(--color-ink)] transition-colors">
            Workflow
          </Link>
          <Link href="#pricing" className="text-[color:var(--color-muted)] hover:text-[color:var(--color-ink)] transition-colors">
            Pricing
          </Link>
          <Link
            href="/dashboard"
            className="relative text-[color:var(--color-muted)] hover:text-[color:var(--color-ink)] transition-colors"
            style={{ paddingLeft: 16 }}
          >
            <span
              aria-hidden
              className="absolute"
              style={{
                left: 0,
                top: "50%",
                transform: "translateY(-50%)",
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "var(--color-lime)",
                boxShadow: "0 0 8px var(--color-lime)",
                animation: "pulse-dot 1.8s infinite",
              }}
            />
            Live demo
          </Link>
        </div>
        <div className="flex items-center" style={{ gap: 12 }}>
          <Link href="/sign-in" className="btn btn-ghost">
            Sign in
          </Link>
          <Link href="/sign-up" className="btn btn-primary">
            Start free
            <ArrowIcon />
          </Link>
        </div>
      </nav>
    </div>
  );
}
