#!/usr/bin/env bash
# Configure Clerk dev instance via Backend API using CLERK_SECRET_KEY from .env.local:
#   - PATCH /v1/instance — development_origin + allowed_origins
#   - POST /v1/redirect_urls — localhost, production, known Vercel preview host
#
# Application display name (e.g. "Briv"): Clerk Dashboard only — not exposed on PATCH /v1/instance.
# Wildcard redirect URLs are rejected by the API; add each preview host separately.
#
# Usage:  bash scripts/clerk-sync-instance-config.sh

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${ROOT}/.env.local"

die() { echo "error: $*" >&2; exit 1; }

[[ -f "$ENV_FILE" ]] || die "missing $ENV_FILE"

SK="$(grep -E '^CLERK_SECRET_KEY=' "$ENV_FILE" | head -1 | cut -d= -f2-)"
[[ -n "$SK" ]] || die "CLERK_SECRET_KEY missing in .env.local"

API="https://api.clerk.com/v1"

echo "PATCH $API/instance …"
curl -sS -X PATCH "$API/instance" \
  -H "Authorization: Bearer $SK" \
  -H "Content-Type: application/json" \
  -d '{
    "development_origin": "http://localhost:3000",
    "allowed_origins": [
      "http://localhost:3000",
      "https://www.usebriv.com",
      "https://briv-app-git-release-briv-group.vercel.app",
      "https://*.vercel.app"
    ]
  }' -w "\nHTTP %{http_code}\n"

REDIRECTS=(
  "http://localhost:3000"
  "https://www.usebriv.com"
  "https://briv-app-git-release-briv-group.vercel.app"
)

echo "Ensuring redirect URLs…"
EXISTING="$(curl -sS "$API/redirect_urls" -H "Authorization: Bearer $SK")"

for url in "${REDIRECTS[@]}"; do
  if echo "$EXISTING" | grep -Fq "\"url\":\"$url\""; then
    echo "  (skip) $url"
    continue
  fi
  echo "  (add)  $url"
  curl -sS -X POST "$API/redirect_urls" \
    -H "Authorization: Bearer $SK" \
    -H "Content-Type: application/json" \
    -d "{\"url\":\"$url\"}" -w "\nHTTP %{http_code}\n"
done

echo "Done."
