/**
 * Security Utilities
 * Input sanitization, output escaping, and query validation
 */

/**
 * Escape HTML special characters to prevent XSS
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
  };
  return text.replace(/[&<>"'\/]/g, (char) => map[char]);
}

/**
 * Sanitize user input - remove potentially dangerous characters
 */
export function sanitizeInput(input: string, options?: { maxLength?: number; allowSpecial?: boolean }): string {
  let sanitized = input.trim();

  // Limit length
  const maxLength = options?.maxLength || 1000;
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  // Remove control characters
  sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, '');

  // Optional: Remove special characters
  if (!options?.allowSpecial) {
    sanitized = sanitized.replace(/[<>{}[\]"'`;\\]/g, '');
  }

  return sanitized;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate IPv4 address
 */
export function isValidIPv4(ip: string): boolean {
  const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipRegex.test(ip);
}

/**
 * Validate domain name
 */
export function isValidDomain(domain: string): boolean {
  const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i;
  return domainRegex.test(domain);
}

/**
 * Validate cryptocurrency address (Bitcoin, Ethereum)
 */
export function isValidCryptoAddress(address: string): boolean {
  // Bitcoin address (P2PKH, P2SH)
  const bitcoinRegex = /^(1|3)[1-9A-HJ-NP-Z]{25,34}$/;
  // Bitcoin segwit
  const bech32Regex = /^bc1[a-z0-9]{39,59}$/i;
  // Ethereum
  const ethereumRegex = /^0x[a-fA-F0-9]{40}$/;

  return bitcoinRegex.test(address) || bech32Regex.test(address) || ethereumRegex.test(address);
}

/**
 * Validate mobile number (India format)
 */
export function isValidMobileNumber(mobile: string): boolean {
  const mobileRegex = /^(\+91)?[6-9]\d{9}$/;
  const cleaned = mobile.replace(/[\s.-]/g, '');
  return mobileRegex.test(cleaned);
}

/**
 * Validate query parameter to prevent injection attacks
 */
export function validateQueryParam(
  param: string,
  type: 'email' | 'domain' | 'ip' | 'wallet' | 'mobile' | 'username',
): boolean {
  // First check: basic sanitization
  if (param.length > 255 || param.includes('\x00')) {
    return false;
  }

  switch (type) {
    case 'email':
      return isValidEmail(param);
    case 'domain':
      return isValidDomain(param);
    case 'ip':
      return isValidIPv4(param);
    case 'wallet':
      return isValidCryptoAddress(param);
    case 'mobile':
      return isValidMobileNumber(param);
    case 'username':
      // Username: alphanumeric, hyphen, underscore, 3-32 chars
      return /^[a-zA-Z0-9_-]{3,32}$/.test(param);
    default:
      return false;
  }
}

/**
 * Escape text for use in PDFs
 */
export function escapePdfText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/\r\n/g, '\n')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, ' '); // Remove control chars except LF
}

/**
 * Validate URL to prevent SSRF attacks
 */
export function isValidRedirectUrl(url: string): boolean {
  try {
    const parsed = new URL(url, window.location.href);
    // Only allow same-origin redirects
    return parsed.origin === window.location.origin;
  } catch {
    return false;
  }
}

/**
 * Generate CSRF token (simplified - use more robust solution in production)
 */
export function generateCsrfToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Content Security Policy (CSP) compliant way to execute code
 */
export async function executeWithTimeout<T>(
  fn: () => Promise<T>,
  timeoutMs: number = 5000,
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error(`Operation timeout after ${timeoutMs}ms`)), timeoutMs);
  });

  return Promise.race([fn(), timeoutPromise]);
}

/**
 * Sanitize object for JSON serialization (prevents prototype pollution)
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized = {} as T;

  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) {
      continue;
    }

    const value = obj[key];

    // Skip prototype pollution attempts
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      continue;
    }

    if (value === null || value === undefined) {
      sanitized[key] = value;
    } else if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value) as any;
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}
