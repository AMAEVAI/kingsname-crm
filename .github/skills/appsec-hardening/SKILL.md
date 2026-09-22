---
name: appsec-hardening
description: Comprehensive web security and application hardening skill. Covers client and server anti-DDoS mitigation, bot protection, OWASP Top 10 defense, XSS sanitization, CSRF/Clickjacking protection, Content Security Policy (CSP), rate limiting, and secure input handling.
---

# KINGSNAME CRM Application Security & DDoS Hardening Playbook

This skill defines the security engineering standards and defensive controls required across KINGSNAME CRM (both Frontend Vue 3 and Backend Spring Boot 3).

## 1. Threat Vectors & Defense Matrix

| Threat Vector | Real-World Impact | Primary Defense |
|---|---|---|
| **L7 DDoS & Form Flooding** | Database resource exhaustion, API spam | Token-bucket IP rate limiter, sliding-window client limiter, invisible honeypot traps |
| **XSS (Cross-Site Scripting)** | Session hijacking, client credential theft | Strict CSP, `sanitizeInput()`, context-aware HTML escaping, zero `v-html` on untrusted input |
| **Brute Force Code Guessing** | Unauthorized access to CRM terminals | 3-attempt lockout with 15-minute freeze, client IP tracking, signed JWT |
| **Clickjacking** | UI redress attacks via malicious iframes | `X-Frame-Options: DENY`, CSP `frame-ancestors 'none'` |
| **MIME-Type Sniffing** | Malicious content interpreted as executable scripts | `X-Content-Type-Options: nosniff` |
| **CORS Misconfiguration** | Third-party origin reads authenticated data | Disallow `*` with credentials, restrict allowed origins to trusted production domains |
| **Privilege Escalation** | Low-privilege users generating master access codes | Role-Based Access Control (`roleCode == 'admin'`) enforced on backend APIs |

---

## 2. Anti-DDoS & Bot Mitigation Protocol

### A. Invisible Honeypot Trap
Add off-screen input fields with `tabIndex={-1}` and `autoComplete="off"` that automated bots fill in, but humans cannot see:
```html
<div class="kn-hp-trap" aria-hidden="true" style="position: absolute; opacity: 0; pointer-events: none; height: 0; width: 0; overflow: hidden; z-index: -999;">
  <label for="form_hp">Leave empty</label>
  <input id="form_hp" name="form_hp" type="text" tabindex="-1" autocomplete="off" v-model="honeypot" />
</div>
```
*Rule:* If `honeypot.trim().length > 0`, silently return success without persisting to database or calling downstream APIs.

### B. Client-Side Sliding-Window Rate Limiter
Throttle submission actions to prevent rapid button hammering:
```ts
if (!checkRateLimit('quick_lead_submit', 3, 30000)) {
  ElMessage.warning('Слишком много запросов. Пожалуйста, подождите несколько секунд.');
  return;
}
```

### C. Server-Side Token Bucket Rate Limiter
Protect public endpoints like `/admin-api/kings/auth/login-by-code` using an in-memory IP rate limiter filter (max 20 requests per minute per IP for login).

---

## 3. Input Sanitization & XSS Defense

1. **Sanitize Text Inputs**:
   Always strip raw `<script>`, HTML tags, and attribute escapes before storing or submitting:
   ```ts
   export function sanitizeInput(input: string, maxLength = 500): string {
     if (!input) return '';
     return input
       .slice(0, maxLength)
       .replace(/</g, '&lt;')
       .replace(/>/g, '&gt;')
       .replace(/"/g, '&quot;')
       .replace(/'/g, '&#x27;')
       .trim();
   }
   ```
2. **Never use `v-html`** for user-generated strings (client names, tailor notes, phone numbers).

---

## 4. HTTP Security Headers
Every production response must deliver:
- `Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https:; connect-src 'self' ws: wss: http: https:; frame-ancestors 'none'; object-src 'none';`
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()`
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
