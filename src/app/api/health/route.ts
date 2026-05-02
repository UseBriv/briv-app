export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({
    status: "ok",
    service: "briv",
    time: new Date().toISOString(),
  });
}
