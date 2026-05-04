#!/usr/bin/env bash
# Create a Neon *development* branch from the project default branch (usually production / main).
#
# Neon model: one project → default branch ≈ production DB, extra branch ≈ dev DB (separate URLs).
# Do NOT commit API keys. Set them only in your shell for this run:
#   export NEON_API_KEY="napi_..."   # Neon Console → Account settings → API keys
#   export NEON_PROJECT_ID="..."   # From URL: console.neon.tech/app/projects/<id>/...
#
# Requires: curl, jq
#
# After success: Neon Console → project → Branches → copy pooled connection string for each branch
# into Vercel / .env.local (DATABASE_URL + DIRECT_URL per environment).

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_LOCAL="${REPO_ROOT}/.env.local"

# Allow NEON_* from environment or from .env.local (never commit keys).
read_env_val() {
  local key="$1"
  local file="$2"
  [[ -f "$file" ]] || return 1
  local line
  line="$(grep -m1 "^${key}=" "$file" 2>/dev/null)" || return 1
  local v="${line#*=}"
  v="${v%$'\r'}"
  if [[ "${v}" == \"*\" ]]; then v="${v#\"}"; v="${v%\"}"; elif [[ "${v}" == \'*\' ]]; then v="${v#\'}"; v="${v%\'}"; fi
  printf "%s" "$v"
}

if [[ -z "${NEON_API_KEY:-}" && -f "$ENV_LOCAL" ]]; then
  NEON_API_KEY="$(read_env_val NEON_API_KEY "$ENV_LOCAL" || true)"
fi
if [[ -z "${NEON_PROJECT_ID:-}" && -f "$ENV_LOCAL" ]]; then
  NEON_PROJECT_ID="$(read_env_val NEON_PROJECT_ID "$ENV_LOCAL" || true)"
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "jq is required (brew install jq)" >&2
  exit 1
fi

: "${NEON_API_KEY:?Set NEON_API_KEY in the shell or in .env.local (Neon Console → Account → API keys)}"
: "${NEON_PROJECT_ID:?Set NEON_PROJECT_ID in the shell or in .env.local (project id from console URL)}"

API="https://console.neon.tech/api/v2/projects/${NEON_PROJECT_ID}"
HDR=(
  -H "Accept: application/json"
  -H "Authorization: Bearer ${NEON_API_KEY}"
  -H "Content-Type: application/json"
)

LIST=$(curl -fsS "${API}/branches" "${HDR[@]}")
DEFAULT_BR=$(echo "$LIST" | jq -r '.branches[] | select(.default == true) | .id' | head -n1)

if [[ -z "${DEFAULT_BR}" || "${DEFAULT_BR}" == "null" ]]; then
  echo "Could not resolve default branch id. Raw response:" >&2
  echo "$LIST" | jq . >&2
  exit 1
fi

EXIST=$(echo "$LIST" | jq -r '.branches[] | select(.name == "development") | .id' | head -n1)
if [[ -n "${EXIST}" && "${EXIST}" != "null" ]]; then
  echo "Branch 'development' already exists (${EXIST}). Nothing to do."
  exit 0
fi

BODY=$(jq -n \
  --arg parent "${DEFAULT_BR}" \
  '{ branch: { name: "development", parent_id: $parent }, endpoints: [ { type: "read_write" } ] }')

RESP=$(curl -fsS -X POST "${API}/branches" "${HDR[@]}" -d "${BODY}")
echo "$RESP" | jq .

echo ""
echo "Done. In Neon Console → your project → Branches:"
echo "  • Default branch → use its connection string for PRODUCTION (Vercel Production env)."
echo "  • development   → use its connection string for LOCAL / Preview (Vercel Preview env)."
echo "Run: npx prisma db push   (against each database once, or migrate as you prefer)."
