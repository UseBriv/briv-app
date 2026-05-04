import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoProps = {
  /** Omit or pass a path to wrap in `<Link>`. Pass `null` for no link (e.g. public share header). */
  href?: string | null;
  size?: "sm" | "md" | "lg";
  variant?: "ink" | "cream";
  className?: string;
};

const sizes = {
  sm: { font: 22, mark: 22 },
  md: { font: 28, mark: 28 },
  lg: { font: 36, mark: 36 },
};

/** Concept 03: document sheet + lime folded corner (matches Briv product). */
function BrivMark({ sizePx, isInk }: { sizePx: number; isInk: boolean }) {
  const docFill = isInk ? "var(--color-ink)" : "var(--color-cream)";
  const docStroke = isInk ? "transparent" : "rgba(255,255,255,0.14)";
  const w = Math.round(sizePx * 0.78);
  const h = Math.round(sizePx * 0.88);
  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 32 32"
      aria-hidden
      className="shrink-0"
      style={{ display: "block" }}
    >
      <rect x="5" y="8" width="16" height="19" rx="2.25" fill={docFill} stroke={docStroke} strokeWidth="0.75" />
      <path d="M 21 8 L 27 8 L 27 14.5 L 21 9.25 Z" fill="var(--color-lime)" />
      <path
        d="M 21 8 L 27 14.5"
        stroke="rgba(11,11,12,0.22)"
        strokeWidth="0.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Logo({ href, size = "md", variant = "ink", className }: LogoProps) {
  const s = sizes[size];
  const isInk = variant === "ink";
  const resolvedHref = href === null ? null : (href ?? "/");

  const inner = (
    <span
      className={cn("inline-flex items-center gap-[10px] no-underline", className)}
      style={{
        fontFamily: "var(--font-serif)",
        fontSize: s.font,
        letterSpacing: "-0.01em",
        color: isInk ? "var(--color-ink)" : "var(--color-cream)",
      }}
    >
      <span className="relative inline-grid shrink-0 place-items-center" style={{ width: s.mark, height: s.mark }}>
        <BrivMark sizePx={s.mark} isInk={isInk} />
      </span>
      Briv<span style={{ fontStyle: "italic" }}>.</span>
    </span>
  );

  if (resolvedHref === null) return inner;
  return (
    <Link href={resolvedHref} aria-label="Briv home">
      {inner}
    </Link>
  );
}
