#!/usr/bin/env bash
# Push app env vars from a local file to the linked Vercel project (CLI).
#
# Usage (from repo root, after `npx vercel link`):
#   npm run vercel:sync-env
#
# Optional:
#   VERCEL_ENV_FILE=.env.production.local   # defaults to .env.local
#   VERCEL_PREVIEW_GIT_BRANCH=release     # preview target branch (Vercel 53+)
#   SKIP_DEVELOPMENT=1                    # skip Vercel "development" target
#   SKIP_KEYS=OPENAI_API_KEY,STRIPE_SECRET_KEY   # comma-separated keys to skip
#
# Skipped always: NEON_API_KEY, NEON_PROJECT_ID (local Neon scripts only), NODE_ENV (platform).

set -euo pipefail

PREVIEW_BRANCH="${VERCEL_PREVIEW_GIT_BRANCH:-release}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${VERCEL_ENV_FILE:-${ROOT}/.env.local}"

die() {
  echo "error: $*" >&2
  exit 1
}

[[ -f "$ENV_FILE" ]] || die "missing ${ENV_FILE}"

[[ -d "${ROOT}/.vercel" ]] || die "run \`cd ${ROOT} && npx vercel link\` once"

npx vercel whoami >/dev/null 2>&1 || die "run \`npx vercel login\` first"

# Keys we sync when present and non-empty (order preserved).
ALLOWLIST=(
  DATABASE_URL
  DIRECT_URL
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  CLERK_SECRET_KEY
  CLERK_WEBHOOK_SECRET
  NEXT_PUBLIC_CLERK_SIGN_IN_URL
  NEXT_PUBLIC_CLERK_SIGN_UP_URL
  NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL
  NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL
  NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL
  NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL
  OPENAI_API_KEY
  OPENAI_MODEL
  OPENAI_MODEL_FAST
  STRIPE_SECRET_KEY
  STRIPE_WEBHOOK_SECRET
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  RESEND_API_KEY
  RESEND_FROM_EMAIL
  NEXT_PUBLIC_APP_URL
)

should_skip_key() {
  local k="$1"
  case "$k" in
    NEON_* | NODE_ENV) return 0 ;;
  esac
  if [[ -n "${SKIP_KEYS:-}" ]]; then
    IFS=',' read -ra _sk <<< "${SKIP_KEYS}"
    for s in "${_sk[@]}"; do
      [[ "${s// /}" == "$k" ]] && return 0
    done
  fi
  return 1
}

read_env_value() {
  local key="$1"
  local line
  line="$(grep -E "^${key}=" "$ENV_FILE" | head -1)" || return 1
  local val="${line#"${key}="}"
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

push_one() {
  local name="$1"
  local target="$2"
  local value="$3"
  if [[ "$target" == "preview" ]]; then
    npx vercel env add "$name" "$target" "$PREVIEW_BRANCH" --value "$value" --force --yes
  else
    npx vercel env add "$name" "$target" --value "$value" --force --yes
  fi
}

echo "Syncing from ${ENV_FILE} → Vercel (preview@${PREVIEW_BRANCH}, production)…"
if [[ "$ENV_FILE" == *".env.local" ]]; then
  echo "note: Production will get the same values as this file. Use VERCEL_ENV_FILE=.env.production.local if prod DB URLs differ." >&2
fi

synced=0
skipped=0

for key in "${ALLOWLIST[@]}"; do
  if should_skip_key "$key"; then
    continue
  fi
  val="$(read_env_value "$key" 2>/dev/null || true)"
  if [[ -z "${val:-}" ]]; then
    echo "  (skip empty) $key"
    skipped=$((skipped + 1))
    continue
  fi
  for target in preview production; do
    echo "  → $target / $key"
    push_one "$key" "$target" "$val"
    synced=$((synced + 1))
  done
done

if [[ "${SKIP_DEVELOPMENT:-}" != "1" ]]; then
  echo "Syncing development (for \`vercel dev\`)…"
  for key in "${ALLOWLIST[@]}"; do
    if should_skip_key "$key"; then
      continue
    fi
    val="$(read_env_value "$key" 2>/dev/null || true)"
    [[ -n "${val:-}" ]] || continue
    echo "  → development / $key"
    set +e
    push_one "$key" development "$val"
    dev_rc=$?
    set -e
    if [[ "$dev_rc" -ne 0 ]]; then
      echo "warn: could not set $key for development (team policy?). Set in Vercel UI if needed." >&2
    fi
  done
fi

echo "Done (${synced} pushes, ${skipped} empty skips). Redeploy so builds pick up NEXT_PUBLIC_* and server env."
