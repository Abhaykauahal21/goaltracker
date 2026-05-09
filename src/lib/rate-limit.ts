// Simple in-memory rate limiter
// Note: In a production serverless environment (like Vercel), this will only 
// rate limit per-instance. For a global rate limit, consider using Redis (Upstash).

const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

/**
 * Checks if a user has exceeded their request limit.
 * @param userId - The unique identifier for the user (e.g., Clerk userId)
 * @param limit - Maximum number of requests allowed within the window
 * @param windowMs - Time window in milliseconds (default 10 minutes)
 * @returns boolean - true if limited, false otherwise
 */
export function isRateLimited(userId: string, limit: number = 5, windowMs: number = 600000): boolean {
  const now = Date.now();
  const userData = rateLimitMap.get(userId) || { count: 0, lastReset: now };

  // If the window has passed, reset the counter
  if (now - userData.lastReset > windowMs) {
    userData.count = 0;
    userData.lastReset = now;
  }

  // Check if limit exceeded
  if (userData.count >= limit) {
    return true;
  }

  // Increment count and update map
  userData.count++;
  rateLimitMap.set(userId, userData);

  return false;
}
