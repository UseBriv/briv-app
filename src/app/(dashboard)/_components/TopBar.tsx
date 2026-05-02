import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { Search, Bell } from "lucide-react";

export function TopBar({ title }: { title: string }) {
  return (
    <header
      className="sticky top-0 z-10 flex items-center justify-between border-b px-8"
      style={{
        height: 64,
        background: "rgba(244, 240, 232, 0.85)",
        backdropFilter: "blur(14px) saturate(140%)",
        WebkitBackdropFilter: "blur(14px) saturate(140%)",
        borderColor: "var(--color-line)",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: 22,
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </div>

      <div className="flex items-center gap-3">
        <div
          className="flex items-center gap-2 rounded-full border px-3 py-1.5"
          style={{
            borderColor: "var(--color-line-strong)",
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            color: "var(--color-muted)",
            minWidth: 240,
          }}
        >
          <Search size={14} />
          <span>Search documents…</span>
          <kbd
            className="ml-auto rounded border px-1.5 py-0.5"
            style={{
              borderColor: "var(--color-line)",
              fontSize: 10,
              color: "var(--color-muted-2)",
            }}
          >
            ⌘K
          </kbd>
        </div>

        <button
          aria-label="Notifications"
          className="grid size-9 place-items-center rounded-full border"
          style={{ borderColor: "var(--color-line-strong)" }}
        >
          <Bell size={14} />
        </button>

        <Link href="/documents/new" className="btn btn-primary" style={{ padding: "8px 14px" }}>
          New document <ArrowIcon size={12} />
        </Link>

        <UserButton
          appearance={{
            elements: { avatarBox: { width: 36, height: 36 } },
          }}
        />
      </div>
    </header>
  );
}
