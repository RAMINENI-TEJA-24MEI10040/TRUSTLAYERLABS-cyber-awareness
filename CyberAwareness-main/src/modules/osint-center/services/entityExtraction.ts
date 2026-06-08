/**
 * Entity Extraction Service
 * Extracts emails, domains, IPs, wallets, mobile numbers, and usernames from evidence
 */

export interface ExtractedEntity {
  type: 'email' | 'domain' | 'ip' | 'wallet' | 'mobile' | 'username';
  value: string;
  confidence: number; // 0-1
  source?: string; // where it was found
}

export interface ExtractionResult {
  evidenceId: string;
  rawContent: string;
  entities: ExtractedEntity[];
  summary: {
    emailCount: number;
    domainCount: number;
    ipCount: number;
    walletCount: number;
    mobileCount: number;
    usernameCount: number;
  };
}

// Regex patterns for entity extraction
const PATTERNS = {
  email: /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g,
  // Domain patterns (simple - catches most common cases)
  domain: /(?:(?:https?:\/\/)?(?:www\.)?)?([a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(?:\/[^\s]*)?\b/gi,
  // IPv4
  ip: /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g,
  // Bitcoin, Ethereum addresses
  wallet: /\b(?:(?:0x[a-fA-F0-9]{40})|(?:1[a-km-zA-HJ-NP-Z1-9]{25,34})|(?:3[a-km-zA-HJ-NP-Z1-9]{25,34})|(?:bc1[a-z0-9]{39,59}))\b/g,
  // Indian phone (10 digits or +91 prefix)
  mobile: /\b(?:\+91[-.\s]?)?(?:[0-9][-.\s]?){9}[0-9]\b/g,
  // Usernames (alphanumeric, underscore, hyphen, 3-32 chars, word boundaries)
  username: /\b[a-zA-Z0-9_-]{3,32}\b/g,
};

/**
 * Extract emails from content
 */
function extractEmails(content: string): ExtractedEntity[] {
  const matches = content.match(PATTERNS.email) || [];
  const unique = Array.from(new Set(matches.map((m) => m.toLowerCase())));
  return unique.map((email) => ({
    type: 'email',
    value: email,
    confidence: 0.95, // Very high confidence for emails
  }));
}

/**
 * Extract domains from content
 */
function extractDomains(content: string): ExtractedEntity[] {
  const matches = content.match(PATTERNS.domain) || [];
  const unique = Array.from(new Set(matches.map((m) => m.toLowerCase())));

  // Filter out common words that match domain pattern
  const commonWords = new Set(['the', 'and', 'for', 'with', 'from', 'but', 'that', 'this']);
  return unique
    .filter((domain) => !commonWords.has(domain) && domain.includes('.'))
    .map((domain) => {
      // Extract just the domain part if URL is included
      const match = domain.match(/(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i);
      const cleanDomain = match ? match[1].toLowerCase() : domain.toLowerCase();
      return {
        type: 'domain',
        value: cleanDomain,
        confidence: 0.85,
      };
    });
}

/**
 * Extract IPv4 addresses from content
 */
function extractIPs(content: string): ExtractedEntity[] {
  const matches = content.match(PATTERNS.ip) || [];
  const unique = Array.from(new Set(matches));

  // Filter out common non-routable IPs
  const nonRoutable = /^(0\.|127\.|169\.254|172\.(1[6-9]|2[0-9]|3[01])|192\.168|224\.)/;
  return unique
    .filter((ip) => !nonRoutable.test(ip))
    .map((ip) => ({
      type: 'ip',
      value: ip,
      confidence: 0.98, // Very high confidence for IPs
    }));
}

/**
 * Extract cryptocurrency wallets from content
 */
function extractWallets(content: string): ExtractedEntity[] {
  const matches = content.match(PATTERNS.wallet) || [];
  const unique = Array.from(new Set(matches));
  return unique.map((wallet) => ({
    type: 'wallet',
    value: wallet,
    confidence: 0.99, // Very high confidence for wallet addresses
  }));
}

/**
 * Extract mobile numbers from content
 */
function extractMobileNumbers(content: string): ExtractedEntity[] {
  const matches = content.match(PATTERNS.mobile) || [];
  const unique = Array.from(new Set(matches.map((m) => m.replace(/[\s.-]/g, ''))));

  // Filter for valid Indian numbers (10-12 digits)
  return unique
    .filter((mobile) => /^(\+91)?[0-9]{10,12}$/.test(mobile))
    .map((mobile) => ({
      type: 'mobile',
      value: mobile,
      confidence: 0.9,
    }));
}

/**
 * Extract usernames from content
 * Note: This is conservative to avoid false positives
 */
function extractUsernames(content: string): ExtractedEntity[] {
  // Extract context-aware usernames (mentions after @, in quotes, after = or :)
  const patterns = [
    /@([a-zA-Z0-9_-]{3,32})/g, // @mentions
    /(?:username|user|account|id|login|account_id)[:\s=]+([a-zA-Z0-9_-]{3,32})/gi, // Labeled usernames
    /["']([a-zA-Z0-9_-]{5,32})["']/g, // Quoted strings that look like usernames
  ];

  const matches = new Set<string>();
  patterns.forEach((pattern) => {
    let match;
    // eslint-disable-next-line no-cond-assign
    while ((match = pattern.exec(content)) !== null) {
      const username = match[1].toLowerCase();
      // Filter common words
      if (!/^(the|and|for|with|from|that|this|your|user)$/i.test(username)) {
        matches.add(username);
      }
    }
  });

  return Array.from(matches).map((username) => ({
    type: 'username',
    value: username,
    confidence: 0.7, // Lower confidence for usernames (more false positives)
  }));
}

/**
 * Convert evidence content to string for extraction
 */
function contentToString(content: unknown): string {
  if (typeof content === 'string') {
    return content;
  }
  if (content === null || content === undefined) {
    return '';
  }
  if (typeof content === 'object') {
    try {
      return JSON.stringify(content);
    } catch {
      return String(content);
    }
  }
  return String(content);
}

/**
 * Extract all entities from evidence content
 */
export function extractEntitiesFromEvidence(evidenceId: string, content: unknown, title?: string): ExtractionResult {
  const contentStr = contentToString(content);
  const titleStr = title ? contentToString(title) : '';
  const fullContent = [titleStr, contentStr].filter((s) => s.length > 0).join('\n');

  const entities: ExtractedEntity[] = [
    ...extractEmails(fullContent),
    ...extractDomains(fullContent),
    ...extractIPs(fullContent),
    ...extractWallets(fullContent),
    ...extractMobileNumbers(fullContent),
    ...extractUsernames(fullContent),
  ];

  // Remove duplicates by (type, value)
  const uniqueMap = new Map<string, ExtractedEntity>();
  entities.forEach((entity) => {
    const key = `${entity.type}:${entity.value}`;
    if (!uniqueMap.has(key) || entity.confidence > (uniqueMap.get(key)?.confidence || 0)) {
      uniqueMap.set(key, entity);
    }
  });

  const uniqueEntities = Array.from(uniqueMap.values());

  // Count by type
  const summary = {
    emailCount: uniqueEntities.filter((e) => e.type === 'email').length,
    domainCount: uniqueEntities.filter((e) => e.type === 'domain').length,
    ipCount: uniqueEntities.filter((e) => e.type === 'ip').length,
    walletCount: uniqueEntities.filter((e) => e.type === 'wallet').length,
    mobileCount: uniqueEntities.filter((e) => e.type === 'mobile').length,
    usernameCount: uniqueEntities.filter((e) => e.type === 'username').length,
  };

  return {
    evidenceId,
    rawContent: fullContent,
    entities: uniqueEntities,
    summary,
  };
}

/**
 * Extract entities from multiple evidence items
 */
export function extractFromMultipleEvidence(
  evidenceItems: Array<{
    id: string;
    title: string;
    summary?: string;
    raw?: unknown;
  }>,
): Map<string, ExtractionResult> {
  const results = new Map<string, ExtractionResult>();

  evidenceItems.forEach((item) => {
    const content = item.summary || item.raw || item.title;
    const result = extractEntitiesFromEvidence(item.id, content, item.title);
    results.set(item.id, result);
  });

  return results;
}

/**
 * Calculate similarity between two extraction results
 */
export function calculateExtractionSimilarity(result1: ExtractionResult, result2: ExtractionResult): number {
  const set1 = new Set(result1.entities.map((e) => `${e.type}:${e.value}`));
  const set2 = new Set(result2.entities.map((e) => `${e.type}:${e.value}`));

  const intersection = new Set([...set1].filter((x) => set2.has(x)));
  const union = new Set([...set1, ...set2]);

  if (union.size === 0) return 0;
  return intersection.size / union.size;
}

/**
 * Get all unique entities across multiple extraction results
 */
export function getAllUniqueEntities(results: ExtractionResult[]): ExtractedEntity[] {
  const map = new Map<string, ExtractedEntity>();

  results.forEach((result) => {
    result.entities.forEach((entity) => {
      const key = `${entity.type}:${entity.value}`;
      if (!map.has(key)) {
        map.set(key, entity);
      }
    });
  });

  return Array.from(map.values());
}
