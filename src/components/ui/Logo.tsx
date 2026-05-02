import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoProps = {
  href?: string;
  size?: "sm" | "md" | "lg";
  variant?: "ink" | "cream";
  className?: string;
};

const sizes = {
  sm: { font: 22, mark: 22, dot: 8 },
  md: { font: 28, mark: 28, dot: 10 },
  lg: { font: 36, mark: 36, dot: 12 },
};

export function Logo({ href = "/", size = "md", variant = "ink", className }: LogoProps) {
  const s = sizes[size];
  const isInk = variant === "ink";

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
      <span
        aria-hidden
        className="relative grid place-items-center"
        style={{
          width: s.mark,
          height: s.mark,
          borderRadius: 8,
          background: isInk ? "var(--color-ink)" : "var(--color-cream)",
          transform: "rotate(-6deg)",
        }}
      >
        <span
          style={{
            width: s.dot,
            height: s.dot,
            borderRadius: 3,
            background: "var(--color-lime)",
            boxShadow: "0 0 12px rgba(212,255,58,0.8)",
          }}
        />
      </span>
      Briv<span style={{ fontStyle: "italic" }}>.</span>
    </span>
  );

  if (!href) return inner;
  return (
    <Link href={href} aria-label="Briv home">
      {inner}
    </Link>
  );
}
