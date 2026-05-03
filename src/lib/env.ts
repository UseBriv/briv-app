// Centralized "is this configured?" flags.
// Used to make the app build-safe even when secrets aren't set yet
// (for preview deploys before env vars are wired up).

/** Canonical site URL for metadata and absolute links. On Vercel, falls back to VERCEL_URL when NEXT_PUBLIC_APP_URL is unset (typical for preview branches). */
export function getAppUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    const host = vercel.replace(/^https?:\/\//, "");
    return `https://${host}`;
  }
  return "http://localhost:3000";
}

export const env = {
  hasClerk: Boolean(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.startsWith("pk_") &&
      process.env.CLERK_SECRET_KEY?.startsWith("sk_"),
  ),
  hasDatabase: Boolean(process.env.DATABASE_URL),
  hasOpenAI: Boolean(process.env.OPENAI_API_KEY),
  hasStripe: Boolean(process.env.STRIPE_SECRET_KEY),
  hasResend: Boolean(process.env.RESEND_API_KEY),
};
