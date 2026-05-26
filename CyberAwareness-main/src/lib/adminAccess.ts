/**

 * Admin access allowlist — configure via VITE_ADMIN_EMAILS (comma-separated).

 * Example: VITE_ADMIN_EMAILS=admin@trustlayerlabs.com,ops@example.com

 */

const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS ?? '')

  .split(',')

  .map((e: string) => e.trim().toLowerCase())

  .filter(Boolean);



export function isAdminEmail(email?: string | null) {

  if (!email) return false;

  return ADMIN_EMAILS.includes(email.trim().toLowerCase());

}


