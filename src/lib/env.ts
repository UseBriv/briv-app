// Centralized "is this configured?" flags.
// Used to make the app build-safe even when secrets aren't set yet
// (for preview deploys before env vars are wired up).

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
