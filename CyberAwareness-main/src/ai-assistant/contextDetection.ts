export type ContextType =
  | 'phishing'
  | 'qr-scam'
  | 'deepfake'
  | 'cyber-law'
  | 'reporting'
  | 'awareness'
  | 'general';

export interface PageContext {
  type: ContextType;
  path: string;
  topic?: string;
}

export function detectContext(pathname: string): PageContext {
  const path = pathname.toLowerCase().trim();

  // Phishing pages
  if (path.includes('/phishing')) {
    return { type: 'phishing', path, topic: 'Phishing scams' };
  }

  // QR scam pages
  if (path.includes('/qr')) {
    return { type: 'qr-scam', path, topic: 'QR code scams' };
  }

  // Deepfake pages
  if (path.includes('/deepfake')) {
    return { type: 'deepfake', path, topic: 'Deepfake awareness' };
  }

  // Cyber law pages
  if (path.includes('/laws') || path.includes('/indian cyber law')) {
    return { type: 'cyber-law', path, topic: 'Indian cyber laws' };
  }

  // Reporting module
  if (path.includes('/reporting')) {
    return { type: 'reporting', path, topic: 'Incident reporting' };
  }

  // UPI module
  if (path.includes('/upi')) {
    return { type: 'awareness', path, topic: 'UPI fraud' };
  }

  // Awareness pages
  if (path.includes('/awareness')) {
    const topic = extractAwarenessTopic(path);
    return { type: 'awareness', path, topic };
  }

  return { type: 'general', path };
}

function extractAwarenessTopic(path: string): string {
  if (path.includes('phishing')) return 'Phishing';
  if (path.includes('upi-fraud')) return 'UPI fraud';
  if (path.includes('qr-scam')) return 'QR scams';
  if (path.includes('social-media')) return 'Social media scams';
  if (path.includes('deepfake')) return 'Deepfake';
  if (path.includes('identity-theft')) return 'Identity theft';
  if (path.includes('password-mfa')) return 'Password and MFA';
  return 'Cyber awareness';
}

export function getCurrentContext(): PageContext {
  return detectContext(window.location.pathname);
}
