/**
 * Fetches Neon connection URIs for the default (production) and `development` branches,
 * writes development URLs into .env.local (DATABASE_URL + DIRECT_URL),
 * writes production URLs into neon-vercel-production.snippet.env (gitignored) for Vercel Production,
 * then runs `prisma db push` against development DB then production DB.
 *
 * Reads NEON_API_KEY + NEON_PROJECT_ID from .env.local (same as other Neon scripts).
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const envPath = path.join(root, ".env.local");
const snippetPath = path.join(root, "neon-vercel-production.snippet.env");

const API = "https://console.neon.tech/api/v2";

function parseEnvFile(content) {
  /** @type {Record<string, string>} */
  const out = {};
  for (const raw of content.split("\n")) {
    const line = raw.replace(/\r$/, "");
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    out[m[1]] = v;
  }
  return out;
}

function setEnvLine(content, key, value) {
  const escaped = String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  const line = `${key}="${escaped}"`;
  const re = new RegExp(`^${key}=.*$`, "m");
  if (re.test(content)) return content.replace(re, line);
  return `${content.trimEnd()}\n${line}\n`;
}

async function neonFetch(apiKey, pathname, search = "") {
  const url = `${API}${pathname}${search}`;
  const r = await fetch(url, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
    },
  });
  const text = await r.text();
  if (!r.ok) throw new Error(`${r.status} ${pathname}: ${text.slice(0, 500)}`);
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Non-JSON from ${pathname}: ${text.slice(0, 200)}`);
  }
}

async function getConnectionUri(projectId, apiKey, branchId, pooled) {
  const q = new URLSearchParams({
    branch_id: branchId,
    database_name: "neondb",
    role_name: "neondb_owner",
    pooled: pooled ? "true" : "false",
  });
  const j = await neonFetch(apiKey, `/projects/${projectId}/connection_uri`, `?${q}`);
  const uri = j.uri ?? j.connection_uri;
  if (!uri) throw new Error(`No uri in connection_uri response: ${JSON.stringify(j).slice(0, 300)}`);
  return uri;
}

function runPrismaPush(label, databaseUrl, directUrl) {
  console.log(`\n→ prisma db push (${label})…`);
  const r = spawnSync("npx", ["prisma", "db", "push"], {
    cwd: root,
    encoding: "utf8",
    stdio: "inherit",
    env: {
      ...process.env,
      DATABASE_URL: databaseUrl,
      DIRECT_URL: directUrl,
    },
  });
  if (r.status !== 0) {
    console.error(`prisma db push failed (${label}) exit=${r.status}`);
    process.exit(r.status ?? 1);
  }
}

async function main() {
  if (!fs.existsSync(envPath)) throw new Error(`Missing ${envPath}`);
  const envContent = fs.readFileSync(envPath, "utf8");
  const env = parseEnvFile(envContent);
  const apiKey = env.NEON_API_KEY;
  const projectId = env.NEON_PROJECT_ID;
  if (!apiKey?.startsWith("napi_")) throw new Error("NEON_API_KEY missing or invalid in .env.local");
  if (!projectId) throw new Error("NEON_PROJECT_ID missing in .env.local");

  const list = await neonFetch(apiKey, `/projects/${projectId}/branches`, "");
  const branches = list.branches ?? [];
  const defaultBr = branches.find((b) => b.default === true);
  const devBr = branches.find((b) => b.name === "development");
  if (!defaultBr) throw new Error("No default branch in Neon response");
  if (!devBr) throw new Error('No branch named "development" — run npm run neon:development-branch first');

  const [devPool, devDirect, prodPool, prodDirect] = await Promise.all([
    getConnectionUri(projectId, apiKey, devBr.id, true),
    getConnectionUri(projectId, apiKey, devBr.id, false),
    getConnectionUri(projectId, apiKey, defaultBr.id, true),
    getConnectionUri(projectId, apiKey, defaultBr.id, false),
  ]);

  let next = envContent;
  next = setEnvLine(next, "DATABASE_URL", devPool);
  next = setEnvLine(next, "DIRECT_URL", devDirect);
  fs.writeFileSync(envPath, next, "utf8");
  console.log("Updated .env.local → DATABASE_URL / DIRECT_URL use Neon branch **development** (pooled + direct).");

  const snippet = [
    "# Add these in Vercel → briv-app → Settings → Environment Variables",
    "# Target: **Production** only (not Preview).",
    `# Generated ${new Date().toISOString()}`,
    "",
    `DATABASE_URL="${prodPool.replace(/"/g, '\\"')}"`,
    `DIRECT_URL="${prodDirect.replace(/"/g, '\\"')}"`,
    "",
  ].join("\n");
  fs.writeFileSync(snippetPath, snippet, "utf8");
  console.log(`Wrote ${path.basename(snippetPath)} — paste into Vercel **Production** env (file is gitignored).`);

  runPrismaPush("development branch", devPool, devDirect);
  runPrismaPush("production (default branch)", prodPool, prodDirect);

  console.log("\nDone. Local + Prisma use **development** DB. Set Vercel **Preview** to the same URLs as .env.local if you want previews on dev data.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
