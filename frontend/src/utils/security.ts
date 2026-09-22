/**
 * KINGSNAME CRM Application Security & Anti-DDoS Utilities
 * OWASP Top 10 client defenses: XSS sanitization, Rate-Limiting, Bot Honeypots, Input Validation
 */

// In-memory sliding-window tracker for client-side rate limiting
const rateLimitMap = new Map<string, number[]>();

/**
 * Client-Side Sliding-Window Rate Limiter
 * Blocks automated button-hammering and rapid-fire API request flooding.
 * 
 * @param actionKey Unique action name, e.g. 'quick_lead_submit'
 * @param maxAttempts Maximum allowed attempts within the window (default: 3)
 * @param windowMs Time window in milliseconds (default: 15000 ms)
 * @returns true if allowed, false if rate limit exceeded
 */
export function checkRateLimit(actionKey: string, maxAttempts = 3, windowMs = 15000): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(actionKey) || [];

  // Evict timestamps outside the sliding window
  const validTimestamps = timestamps.filter(t => now - t < windowMs);

  if (validTimestamps.length >= maxAttempts) {
    rateLimitMap.set(actionKey, validTimestamps);
    return false; // Rate limit exceeded!
  }

  validTimestamps.push(now);
  rateLimitMap.set(actionKey, validTimestamps);
  return true;
}

/**
 * XSS Neutralization & Text Input Sanitization
 * Strips dangerous HTML tags, javascript: protocols, and escapes special entities.
 * Enforces maximum character limits to prevent memory exhaustion payloads.
 * 
 * @param input Raw text string from user input
 * @param maxLength Maximum permitted length (default: 500)
 */
export function sanitizeInput(input: string | undefined | null, maxLength = 500): string {
  if (!input) return '';

  let sanitized = String(input).slice(0, maxLength);

  // Strip script/iframe/object tags
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  sanitized = sanitized.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  sanitized = sanitized.replace(/javascript:/gi, '');
  sanitized = sanitized.replace(/on\w+\s*=/gi, '');

  // Escape special HTML characters
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();

  return sanitized;
}

/**
 * Validates and normalizes phone numbers
 * Only allows digits, +, spaces, hyphens, and parentheses.
 */
export function sanitizePhone(phone: string | undefined | null): string {
  if (!phone) return '';
  return phone.replace(/[^\d+()\-\s]/g, '').slice(0, 30).trim();
}

/**
 * Normalizes Instagram account handle
 */
export function sanitizeInstagram(handle: string | undefined | null): string {
  if (!handle) return '';
  const cleaned = handle.replace(/[^a-zA-Z0-9._]/g, '').slice(0, 30);
  return cleaned ? `@${cleaned}` : '';
}

/**
 * Honeypot Trap Detection
 * Checks if an invisible field meant only for bots was populated.
 */
export function isHoneypotTriggered(honeypotValue: string | undefined | null): boolean {
  return typeof honeypotValue === 'string' && honeypotValue.trim().length > 0;
}
