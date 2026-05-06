#!/usr/bin/env bash
# Push NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY + CLERK_SECRET_KEY from .env.local to Vercel.
# Prerequisites: npx vercel login, npx vercel link (from repo root), and filled .env.local
#
# Usage (from briv-app):
#   bash scripts/sync-clerk-env-vercel.sh
# Optional: SKIP_DEVELOPMENT=1 to skip the development target (e.g. team policy).
# Optional: VERCEL_PREVIEW_GIT_BRANCH=release — Vercel 53+ may require a branch for "preview" envs
#   (set to the branch you deploy for PR previews, e.g. main, release).

set -euo pipefail
PREVIEW_BRANCH="${VERCEL_PREVIEW_GIT_BRANCH:-release}"

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${ROOT}/.env.local"

die() {
  echo "error: $*" >&2
  exit 1
}

[[ -f "$ENV_FILE" ]] || die "missing ${ENV_FILE} — copy .env.example and add Clerk keys"

[[ -d "${ROOT}/.vercel" ]] || die "run \`cd ${ROOT} && npx vercel link\` once to attach this repo to your Vercel project"

npx vercel whoami >/dev/null 2>&1 || die "run \`npx vercel login\` first"

# Read KEY=value from .env.local (first match per key). Strips optional single/double quotes.
read_env_value() {
  local key="$1"
  local line
  line="$(grep -E "^${key}=" "$ENV_FILE" | head -1)" || return 1
  local val="${line#*=}"
  val="${val%$'\r'}"
  if [[ "$val" =~ ^\".*\"$ ]]; then
    val="${val#\"}"
    val="${val%\"}"
  elif [[ "$val" =~ ^\'.*\'$ ]]; then
    val="${val#\'}"
    val="${val%\'}"
  fi
  printf '%s' "$val"
}

PK="$(read_env_value NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)" || die "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY missing in .env.local"
SK="$(read_env_value CLERK_SECRET_KEY)" || die "CLERK_SECRET_KEY missing in .env.local"

[[ "$PK" == pk_* ]] || die "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY must start with pk_"
[[ "$SK" == sk_* ]] || die "CLERK_SECRET_KEY must start with sk_"

push_one() {
  local name="$1"
  local target="$2"
  local value="$3"
  # Vercel 53+ project git linking: preview vars often need a branch (third arg).
  if [[ "$target" == "preview" ]]; then
    npx vercel env add "$name" "$target" "$PREVIEW_BRANCH" --value "$value" --force --yes
  else
    npx vercel env add "$name" "$target" --value "$value" --force --yes
  fi
}

echo "Syncing Clerk env vars to Vercel (preview@${PREVIEW_BRANCH}, production)…"

for target in preview production; do
  echo "  → $target / NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"
  push_one NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY "$target" "$PK"
  echo "  → $target / CLERK_SECRET_KEY"
  push_one CLERK_SECRET_KEY "$target" "$SK"
done

if [[ "${SKIP_DEVELOPMENT:-}" != "1" ]]; then
  echo "Syncing development (for \`vercel dev\`)…"
  echo "  → development / NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"
  push_one NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY development "$PK"
  echo "  → development / CLERK_SECRET_KEY"
  set +e
  push_one CLERK_SECRET_KEY development "$SK"
  dev_sk=$?
  set -e
  if [[ "$dev_sk" -ne 0 ]]; then
    echo "warn: could not set CLERK_SECRET_KEY for development (some teams restrict this). Add it in the Vercel UI if you use \`vercel dev\`." >&2
  fi
fi

echo "Done. Trigger a redeploy (git push or \`npx vercel\`) so new builds pick up the variables."
