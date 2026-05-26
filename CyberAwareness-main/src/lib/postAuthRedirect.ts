import { isAdminEmail } from './adminAccess';

const AUTH_PATHS = new Set(['/login', '/signup']);

/** Where to send the user after an explicit login or signup succeeds. */
export function getPostAuthPath(
  email: string | null | undefined,
  fromPath?: string
): string {
  const safeFrom =
    fromPath && !AUTH_PATHS.has(fromPath) ? fromPath : undefined;

  if (fromPath === '/admin') {
    return isAdminEmail(email) ? '/admin' : '/';
  }

  if (isAdminEmail(email)) {
    return '/admin';
  }

  return safeFrom ?? '/';
}
