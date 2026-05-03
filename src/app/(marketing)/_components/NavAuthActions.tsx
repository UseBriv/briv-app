"use client";

import { useAuth, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowIcon } from "@/components/ui/ArrowIcon";

function MarketingAuthLinks() {
  return (
    <>
      <Link href="/sign-in" className="btn btn-ghost">
        Sign in
      </Link>
      <Link href="/sign-up" className="btn btn-primary">
        Start free
        <ArrowIcon />
      </Link>
    </>
  );
}

export function NavAuthActions() {
  const { isLoaded, userId } = useAuth();

  // SignedOut only renders when userId === null, not while auth is loading — show links until we know.
  if (!isLoaded) {
    return (
      <div className="flex items-center" style={{ gap: 12 }}>
        <MarketingAuthLinks />
      </div>
    );
  }

  if (userId) {
    return (
      <div className="flex items-center" style={{ gap: 12 }}>
        <Link href="/dashboard" className="btn btn-primary">
          Workspace
          <ArrowIcon />
        </Link>
        <UserButton
          appearance={{
            elements: { avatarBox: { width: 32, height: 32 } },
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex items-center" style={{ gap: 12 }}>
      <MarketingAuthLinks />
    </div>
  );
}
