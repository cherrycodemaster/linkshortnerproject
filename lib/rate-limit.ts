type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type RateLimitResult = {
  allowed: boolean;
  retryAfterSeconds: number;
};

const rateLimits = new Map<string, RateLimitEntry>();
const MAX_TRACKED_KEYS = 10_000;

function removeExpiredEntries(now: number) {
  for (const [key, entry] of rateLimits) {
    if (entry.resetAt <= now) {
      rateLimits.delete(key);
    }
  }
}

/**
 * Limits requests in this server process. Use a shared backing store when the
 * application is deployed to more than one instance.
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  const entry = rateLimits.get(key);

  if (!entry || entry.resetAt <= now) {
    if (rateLimits.size >= MAX_TRACKED_KEYS) {
      removeExpiredEntries(now);
    }

    if (rateLimits.size >= MAX_TRACKED_KEYS) {
      return { allowed: true, retryAfterSeconds: 0 };
    }

    rateLimits.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (entry.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
    };
  }

  entry.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}
