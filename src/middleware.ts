import { NextResponse, type NextRequest } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { env } from "@/lib/env";

const isPublicRoute = createRouteMatcher([
  "/",
  "/pricing",
  "/about",
  "/careers",
  "/contact",
  "/privacy",
  "/terms",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/p/(.*)", // public document share links
  "/api/webhooks/(.*)",
  "/api/health",
]);

const protectedMiddleware = clerkMiddleware(
  async (auth, req) => {
    if (!isPublicRoute(req)) {
      await auth.protect();
    }
  },
  { signInUrl: "/sign-in", signUpUrl: "/sign-up" },
);

// When Clerk isn't configured, run an inert middleware so the app still
// boots (marketing + public pages work; protected pages render but the
// in-page auth helpers return null → user sees gentle "configure Clerk" UI).
function passthrough(_req: NextRequest) {
  return NextResponse.next();
}

const middleware = env.hasClerk ? protectedMiddleware : passthrough;
export default middleware;

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
