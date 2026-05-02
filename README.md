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

---

© 2026 Briv, Inc.
