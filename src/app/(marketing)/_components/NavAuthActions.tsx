"use client";

import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowIcon } from "@/components/ui/ArrowIcon";

export function NavAuthActions() {
  return (
    <div className="flex items-center" style={{ gap: 12 }}>
      <SignedIn>
        <Link href="/dashboard" className="btn btn-primary">
          Workspace
          <ArrowIcon />
        </Link>
        <UserButton
          appearance={{
            elements: { avatarBox: { width: 32, height: 32 } },
          }}
        />
      </SignedIn>
      <SignedOut>
        <Link href="/sign-in" className="btn btn-ghost">
          Sign in
        </Link>
        <Link href="/sign-up" className="btn btn-primary">
          Start free
          <ArrowIcon />
        </Link>
      </SignedOut>
    </div>
  );
}
