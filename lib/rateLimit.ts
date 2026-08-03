// Rate limit đơn giản trong bộ nhớ tiến trình. Phù hợp cho 1 instance Railway.
// Nếu sau này scale nhiều instance, cần chuyển sang Redis hoặc dịch vụ rate-limit riêng.

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 60;

const hits = new Map<string, number[]>();

export function checkRateLimit(identifier: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const timestamps = (hits.get(identifier) || []).filter((time) => now - time < WINDOW_MS);

  if (timestamps.length >= MAX_REQUESTS) {
    hits.set(identifier, timestamps);
    return { allowed: false, remaining: 0 };
  }

  timestamps.push(now);
  hits.set(identifier, timestamps);
  return { allowed: true, remaining: MAX_REQUESTS - timestamps.length };
}
