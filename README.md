# Briv

> AI estimates, proposals & contracts that close themselves.

Briv is the document automation platform for modern service businesses. Generate estimates, send proposals, sign contracts, and get paid — all from one AI-powered workspace.

This is a Next.js 15 monolith: marketing site, dashboard, API, and AI engine in a single deploy.

---

## Stack

| Layer        | Choice                              |
| ------------ | ----------------------------------- |
| Framework    | Next.js 15 (App Router) + React 19  |
| Language     | TypeScript (strict)                 |
| Styling      | Tailwind CSS v4 + custom brand CSS  |
| Auth         | Clerk (orgs, SSO/SAML for Enterprise) |
| Database     | Postgres (Neon) + Prisma 6          |
| AI           | OpenAI (gpt-4o, gpt-4o-mini)        |
| Payments     | Stripe (cards, ACH) + PayPal-ready  |
| Email        | Resend                              |
| Validation   | Zod                                 |
| Hosting      | Vercel-friendly                     |

---

## Project layout

```
briv-app/
├── prisma/schema.prisma         # All models
├── middleware.ts                # Clerk route protection
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout + ClerkProvider + fonts
│   │   ├── globals.css          # Brand tokens (Tailwind v4 @theme) + utilities
│   │   ├── (marketing)/         # Public landing (no sidebar / no auth UI)
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx         # Landing
│   │   │   └── _components/     # Nav, Hero, Marquee, AiDemo, Bento, Workflow, Pricing, FinalCta, Footer
│   │   ├── (auth)/              # Clerk hosted-style sign-in/up
│   │   ├── (dashboard)/         # Authenticated app
│   │   │   ├── layout.tsx       # Sidebar + ensureUserExists()
│   │   │   ├── dashboard/       # Overview
│   │   │   ├── documents/       # List, [id], new (AI studio)
│   │   │   ├── studio/          # AI doc generation
│   │   │   ├── clients/
│   │   │   ├── invoices/
│   │   │   ├── billing/
│   │   │   └── settings/
│   │   ├── p/[slug]/            # Public document view (sign / pay)
│   │   └── api/
│   │       ├── ai/                       # AI endpoints
│   │       │   ├── generate-estimate/
│   │       │   ├── analyze-clauses/
│   │       │   └── detect-pricing-anomaly/
│   │       ├── documents/                # CRUD + sign
│   │       ├── clients/
│   │       ├── webhooks/{clerk,stripe}/  # Identity + payments sync
│   │       └── health/
│   ├── components/
│   │   ├── ui/                  # Logo, ArrowIcon, CheckIcon
│   │   └── Reveal.tsx           # IO-based scroll reveal
│   └── lib/
│       ├── ai/                  # ⭐ The brain
│       │   ├── client.ts        # OpenAI client + model choices
│       │   ├── prompts.ts       # System prompts
│       │   ├── generateEstimate.ts
│       │   ├── analyzeClauses.ts
│       │   ├── detectPricingAnomaly.ts
│       │   ├── types.ts         # Strict TS shapes
│       │   └── index.ts
│       ├── auth.ts              # getCurrentUser, getCurrentOrg, ensureUserExists
│       ├── db.ts                # Prisma singleton
│       ├── stripe.ts
│       ├── email.ts             # Resend wrapper
│       ├── validation.ts        # Zod schemas (input validation)
│       └── utils.ts             # cn(), formatCurrency, formatDate, …
└── package.json
```

`lib/` is the most important folder. All AI logic lives there as pure TypeScript with no UI dependencies — testable, reusable across API routes and server components, and swappable model implementations.

---

## Local setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` → `.env.local` and fill in:

```bash
cp .env.example .env.local
```

You'll need:

- **Clerk**: publishable + secret keys, plus a webhook signing secret (for `/api/webhooks/clerk`)
- **Neon**: a `DATABASE_URL` (pooled) and `DIRECT_URL` (direct) Postgres connection string
- **OpenAI**: `OPENAI_API_KEY` (gpt-4o by default)
- **Stripe**: secret + publishable + webhook secret (only if you want payments locally)
- **Resend**: `RESEND_API_KEY` for transactional emails

### 3. Set up the database

```bash
npm run db:generate   # generate Prisma client
npm run db:push       # push schema to Neon (dev)
# or
npm run db:migrate    # create a versioned migration
```

### 4. Run

```bash
npm run dev
```

App runs at http://localhost:3000.

### 5. Vercel preview deployments and Clerk

**Optional — Clerk Backend API (origins + redirect URLs):** From `briv-app`, with a filled `.env.local` (at least `CLERK_SECRET_KEY`), run `npm run clerk:sync-instance` to `PATCH` default `allowed_origins` / `development_origin` and add **redirect URL** allowlist entries for `http://localhost:3000`, `https://www.usebriv.com`, and the common Vercel preview host. The script does not change the **application name** in the dashboard (set that to “Briv” under Clerk → your app). The API does not accept `https://*.vercel.app` as a **redirect** URL; add other preview hostnames in the [Clerk dashboard](https://dashboard.clerk.com) or extend the script.

PR and branch previews show “Clerk not configured” until auth env vars exist for the **Preview** environment (not only Production).

1. **Vercel** → Project → Settings → Environment Variables: add `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` (same values as local, or use Clerk’s development keys for previews). When creating or editing each variable, enable **Preview** (and usually **Development** for `vercel dev`).
2. **Clerk Dashboard** → your application → configure **Redirect URLs** / **Allowed origins** so preview URLs are permitted — for example `https://*.vercel.app` and/or your team’s stable preview domain.
3. Add other secrets your preview needs (`DATABASE_URL`, `OPENAI_API_KEY`, etc.) to Preview the same way, or previews will fail on protected routes and APIs.

`NEXT_PUBLIC_APP_URL` is optional on Vercel: if unset, the app uses `https://$VERCEL_URL` for canonical URLs on each deployment.

#### Clerk keys via Vercel CLI

Yes — you can upload variables from the terminal instead of the dashboard. They are stored on Vercel’s project, not in your git repo (never commit secrets).

After `npx vercel login`, `npx vercel link`, and a filled `.env.local`, you can sync both Clerk keys to **preview**, **production**, and (unless `SKIP_DEVELOPMENT=1`) **development** in one shot:

```bash
cd briv-app
npm run vercel:sync-clerk-env
```

Manual step-by-step:

```bash
cd briv-app
npx vercel login    # once per machine
npx vercel link     # once: attach this directory to the right Vercel project
```

Add Clerk for **each** environment you use (Preview and Production are separate records):

```bash
npx vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY preview
npx vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY production
npx vercel env add CLERK_SECRET_KEY preview
npx vercel env add CLERK_SECRET_KEY production
```

The CLI will prompt for values. To avoid putting the secret on the command line (and in shell history), pipe from a file and delete the file afterward:

```bash
npx vercel env add CLERK_SECRET_KEY preview < ./clerk-secret.txt
```

For local `vercel dev`, also add the same keys for **development**: `npx vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY development` (and the secret key the same way).

**Deploy after changing env vars:** the CLI does not replace `git push`. Variables apply on the **next** build. Redeploy by pushing a commit, clicking **Redeploy** in the Vercel UI, or running `npx vercel` (preview) / `npx vercel --prod` (production).

| Surface          | URL                          |
| ---------------- | ---------------------------- |
| Landing          | `/`                          |
| Sign in / up     | `/sign-in`, `/sign-up`       |
| Dashboard        | `/dashboard`                 |
| AI studio        | `/studio` or `/documents/new` |
| Public document  | `/p/<publicSlug>`            |
| Health check     | `/api/health`                |

---

## AI engine

Three core functions, all in `src/lib/ai/`:

| Function | Purpose |
| --- | --- |
| `generateEstimate(input)` | Turn a one-line brief into a fully line-itemized estimate with industry-accurate pricing, scope notes, terms, and a confidence score. |
| `analyzeClauses({ contractText })` | Classify clauses, surface risk, and flag missing/non-standard terms from the sender's perspective. |
| `detectPricingAnomaly({ industry, lineItems })` | Compare proposed line items to industry benchmarks; flag deviations as info / warn / alert. |

Each one:

- Uses **structured JSON output** + a Zod parse pass for safety.
- Is callable from API routes, server actions, or background jobs.
- Server-side recomputes financial math (subtotals/tax/totals) so the model can never push bad numbers downstream.

API routes are thin — they auth, validate, and delegate to the lib.

---

## Webhooks

| Provider | Endpoint | Purpose |
| --- | --- | --- |
| Clerk    | `POST /api/webhooks/clerk`  | Mirrors users, orgs, and memberships into Postgres so we can build relations in Prisma. |
| Stripe   | `POST /api/webhooks/stripe` | Marks invoices/documents PAID on `payment_intent.succeeded`. |

Both verify signatures (svix for Clerk, native for Stripe) before mutating the DB.

---

## Roadmap

- [ ] Tiptap-based collaborative editor for proposals & contracts
- [ ] In-app e-signature drawing with audit trail PDF export
- [ ] Stripe Checkout + ACH for the public document view
- [ ] QuickBooks / Xero two-way sync (Stack card)
- [ ] PDF rendering for outbound copies
- [ ] Real-time presence + comments
- [ ] AI Clause v2 (per-jurisdiction)
- [ ] Custom brand voice training (Enterprise)

---

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Prisma generate + Next build |
| `npm run start` | Production server |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run db:push` | Push schema to DB |
| `npm run db:migrate` | Create a migration |
| `npm run db:studio` | Prisma Studio |
| `npm run format` | Prettier (with Tailwind plugin) |
| `npm run vercel:sync-clerk-env` | Push Clerk keys from `.env.local` to Vercel (preview + production + development) |
| `npm run clerk:sync-instance` | Clerk Backend API: instance origins + redirect URL allowlist (see §5) |

---

© 2026 Briv, Inc.
