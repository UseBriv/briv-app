import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { env, getAppUrl } from "@/lib/env";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(getAppUrl()),
  title: {
    default: "Briv — AI estimates, proposals & contracts that close themselves",
    template: "%s · Briv",
  },
  description:
    "The document automation platform for modern service businesses. Generate estimates, send proposals, sign contracts, and get paid — all from one AI-powered workspace.",
  keywords: [
    "AI proposals",
    "AI estimates",
    "contract automation",
    "e-signature",
    "invoicing",
    "service business",
    "Briv",
  ],
  openGraph: {
    title: "Briv — AI estimates, proposals & contracts that close themselves",
    description:
      "The document automation platform for modern service businesses.",
    type: "website",
    siteName: "Briv",
  },
  twitter: {
    card: "summary_large_image",
    title: "Briv",
    description:
      "AI estimates, proposals & contracts that close themselves.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // ClerkProvider must live inside <body> (not wrapping <html>). When keys are missing,
  // skip the provider so marketing + builds still work.
  const body = env.hasClerk ? (
    <ClerkProvider signInFallbackRedirectUrl="/dashboard" signUpFallbackRedirectUrl="/dashboard">
      {children}
    </ClerkProvider>
  ) : (
    children
  );

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{body}</body>
    </html>
  );
}
