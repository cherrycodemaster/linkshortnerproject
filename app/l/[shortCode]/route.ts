import { NextResponse } from "next/server";
import { getLinkByShortCode } from "@/data/links";
import { checkRateLimit } from "@/lib/rate-limit";

const REDIRECT_RATE_LIMIT = 120;
const REDIRECT_RATE_LIMIT_WINDOW_MS = 60_000;

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip") ?? "unknown";
}

function isHttpUrl(value: string) {
  try {
    const { protocol } = new URL(value);
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ shortCode: string }> },
) {
  const rateLimit = checkRateLimit(
    `link-redirects:${getClientIp(request)}`,
    REDIRECT_RATE_LIMIT,
    REDIRECT_RATE_LIMIT_WINDOW_MS,
  );

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
      },
    );
  }

  const { shortCode } = await params;
  const link = await getLinkByShortCode(shortCode);

  if (!link || !isHttpUrl(link.originalUrl)) {
    return NextResponse.json({ error: "Link not found" }, { status: 404 });
  }

  return NextResponse.redirect(link.originalUrl);
}
