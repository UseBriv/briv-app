import { existsSync, readFileSync, statSync } from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaResolvedUrl: string | undefined;
};

let envLocalCache: { mtimeMs: number; databaseUrl: string | undefined } | null = null;

/** In development, re-read DATABASE_URL from .env.local when the file changes so Prisma is not stuck on a pre-edit URL. */
function readDatabaseUrlFromEnvLocal(): string | undefined {
  if (process.env.NODE_ENV === "production") return undefined;
  const envPath = path.join(process.cwd(), ".env.local");
  if (!existsSync(envPath)) return undefined;
  const mtimeMs = statSync(envPath).mtimeMs;
  if (envLocalCache && envLocalCache.mtimeMs === mtimeMs) {
    return envLocalCache.databaseUrl;
  }
  let databaseUrl: string | undefined;
  const raw = readFileSync(envPath, "utf8");
  for (const line of raw.split("\n")) {
    const m = line.match(/^DATABASE_URL=(.*)$/);
    if (!m) continue;
    let v = m[1].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    databaseUrl = v || undefined;
    break;
  }
  envLocalCache = { mtimeMs, databaseUrl };
  return databaseUrl;
}

function resolvedDatabaseUrl(): string | undefined {
  return readDatabaseUrlFromEnvLocal() ?? process.env.DATABASE_URL;
}

function getPrismaClient(): PrismaClient {
  const url = resolvedDatabaseUrl();
  if (!url) {
    if (!globalForPrisma.prisma || globalForPrisma.prismaResolvedUrl !== undefined) {
      void globalForPrisma.prisma?.$disconnect().catch(() => undefined);
      globalForPrisma.prisma = new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
      });
      globalForPrisma.prismaResolvedUrl = undefined;
    }
    return globalForPrisma.prisma;
  }
  if (!globalForPrisma.prisma || globalForPrisma.prismaResolvedUrl !== url) {
    void globalForPrisma.prisma?.$disconnect().catch(() => undefined);
    globalForPrisma.prisma = new PrismaClient({
      datasourceUrl: url,
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
    globalForPrisma.prismaResolvedUrl = url;
  }
  return globalForPrisma.prisma;
}

export const db = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrismaClient();
    const value = Reflect.get(client, prop, client);
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  },
});

/** True if Prisma can open a connection (invalid placeholder URLs fail here). */
export async function checkDatabaseReachable(): Promise<boolean> {
  try {
    await getPrismaClient().$queryRaw`SELECT 1`;
    return true;
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[db] checkDatabaseReachable failed:", e);
    }
    return false;
  }
}
