"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";
import {
  FileText,
  Sparkles,
  Users,
  Settings,
  LayoutDashboard,
  CreditCard,
  Receipt,
} from "lucide-react";

type SidebarProps = {
  /** Current workspace; when set, the footer shows org + plan instead of a generic plan upsell. */
  orgName?: string | null;
  planLabel?: string | null;
};

const NAV: { label: string; href: string; icon: React.ComponentType<{ size?: number }> }[] = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Documents", href: "/documents", icon: FileText },
  { label: "AI studio", href: "/studio", icon: Sparkles },
  { label: "Clients", href: "/clients", icon: Users },
  { label: "Invoices", href: "/invoices", icon: Receipt },
  { label: "Billing", href: "/billing", icon: CreditCard },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar({ orgName = null, planLabel = null }: SidebarProps) {
  const pathname = usePathname();
  const hasOrg = Boolean(orgName?.trim());

  return (
    <aside
      className="flex h-screen flex-col border-r"
      style={{
        width: 248,
        background: "var(--color-cream)",
        borderColor: "var(--color-line)",
        position: "sticky",
        top: 0,
      }}
    >
      <div className="px-5 py-6">
        <Logo size="sm" />
      </div>

      <nav className="flex-1 px-3" style={{ paddingTop: 8 }}>
        {NAV.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-[10px] px-3 py-2 transition-colors",
              )}
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 14,
                color: active ? "var(--color-ink)" : "var(--color-muted)",
                background: active ? "var(--color-paper-2)" : "transparent",
                fontWeight: active ? 500 : 400,
              }}
            >
              <Icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-5" style={{ borderColor: "var(--color-line)" }}>
        {hasOrg ? (
          <div
            className="rounded-[12px] px-3 py-2.5"
            style={{
              background: "var(--color-paper-2)",
              border: "1px solid var(--color-line)",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 14,
                fontWeight: 500,
                color: "var(--color-ink)",
                lineHeight: 1.3,
                marginBottom: 4,
              }}
            >
              {orgName}
            </div>
            {planLabel ? (
              <div
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 12,
                  color: "var(--color-muted)",
                }}
              >
                {planLabel}
              </div>
            ) : null}
          </div>
        ) : (
          <>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: "var(--color-muted-2)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              Plan · Starter
            </div>
            <Link
              href="/billing"
              className="block rounded-[10px] px-3 py-2"
              style={{
                background: "var(--color-ink)",
                color: "var(--color-cream)",
                fontSize: 13,
                textAlign: "center",
              }}
            >
              Upgrade to Growth
            </Link>
          </>
        )}
      </div>
    </aside>
  );
}
