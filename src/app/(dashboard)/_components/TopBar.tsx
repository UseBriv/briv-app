"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Bell, ChevronDown, Search } from "lucide-react";
import { env } from "@/lib/env";
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";

export function TopBar({
  title,
  studio,
}: {
  title: string;
  studio?: { lastSaved: string };
}) {
  return (
    <header
      className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b px-8"
      style={{
        minHeight: 64,
        background: "rgba(249, 247, 242, 0.88)",
        backdropFilter: "blur(14px) saturate(140%)",
        WebkitBackdropFilter: "blur(14px) saturate(140%)",
        borderColor: "var(--color-line)",
      }}
    >
      <div className="min-w-0 flex-1">
        <div
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: 22,
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </div>
        {studio ? (
          <div
            className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1"
            style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}
          >
            <span
              className="pill"
              style={{
                background: "rgba(26,26,27,0.06)",
                borderColor: "var(--color-line)",
                color: "var(--color-muted)",
                padding: "4px 10px",
              }}
            >
              <span className="dot" /> Live document
            </span>
            <span style={{ color: "var(--color-muted-2)" }}>Last saved {studio.lastSaved}</span>
          </div>
        ) : null}
      </div>

      <div className="flex items-center gap-3">
        {env.hasClerk && <WorkspaceSwitcher />}
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
          + New document <ChevronDown size={14} strokeWidth={2} aria-hidden />
        </Link>

        {env.hasClerk ? (
          <UserButton
            appearance={{
              elements: { avatarBox: { width: 36, height: 36 } },
            }}
          />
        ) : (
          <div
            aria-hidden
            className="grid size-9 place-items-center rounded-full"
            style={{
              background: "var(--color-paper-2)",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--color-muted-2)",
            }}
          >
            ?
          </div>
        )}
      </div>
    </header>
  );
}
