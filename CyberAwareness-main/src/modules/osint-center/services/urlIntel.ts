import { IntelligenceResult } from '../types/ciw.types';
import { scanUrl } from '../../../services/virustotal';

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

const DEFAULT_TIMEOUT = 10000;

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const id = setTimeout(() => reject(new Error('timeout')), ms);
    p.then((v) => {
      clearTimeout(id);
      resolve(v);
    }).catch((e) => {
      clearTimeout(id);
      reject(e);
    });
  });
}

interface RedirectChain {
  redirects: string[];
  finalUrl: string;
  count: number;
}

// Calculate Shannon entropy for URL analysis
function calculateEntropy(str: string): number {
  const len = str.length;
  const frequencies: Record<string, number> = {};

  for (const char of str) {
    frequencies[char] = (frequencies[char] || 0) + 1;
  }

  let entropy = 0;
  for (const freq of Object.values(frequencies)) {
    const p = freq / len;
    entropy -= p * Math.log2(p);
  }

  return entropy;
}

// Analyze redirect chain
async function analyzeRedirects(url: string): Promise<RedirectChain> {
  const chain: string[] = [];
  let currentUrl = url;
  const visited = new Set<string>();
  let count = 0;
  const maxRedirects = 5;

  while (count < maxRedirects && !visited.has(currentUrl)) {
    visited.add(currentUrl);
    chain.push(currentUrl);

    try {
      const response = await withTimeout(fetch(currentUrl, { redirect: 'manual' }), 5000);

      // Check for redirect status codes
      if ([301, 302, 303, 307, 308].includes(response.status)) {
        const location = response.headers.get('location');
        if (location) {
          currentUrl = new URL(location, currentUrl).toString();
          count++;
        } else {
          break;
        }
      } else {
        break;
      }
    } catch {
      break;
    }
  }

  return {
    redirects: chain.slice(0, -1),
    finalUrl: currentUrl,
    count: count,
  };
}

function buildPhishingIndicators(url: string): string[] {
  const suspiciousTerms = [
    'login',
    'secure',
    'account',
    'verify',
    'confirm',
    'bank',
    'update',
    'pay',
    'webscr',
    'service',
    'support',
    'signin',
    'auth',
    'validate',
  ];
  const indicators: string[] = [];
  const normalized = url.toLowerCase();
  for (const term of suspiciousTerms) {
    if (normalized.includes(term)) indicators.push(term);
  }
  return indicators;
}

// Detect suspicious TLDs
function isSuspiciousTLD(url: string): { suspicious: boolean; tld: string } {
  const suspiciousTLDs = ['tk', 'ml', 'ga', 'cf', 'xyz', 'top', 'download', 'review', 'faith', 'racing'];
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname || '';
    const tld = hostname.split('.').pop()?.toLowerCase() || '';

    return {
      suspicious: suspiciousTLDs.includes(tld),
      tld,
    };
  } catch {
    return { suspicious: false, tld: '' };
  }
}

// Detect homograph attacks (Unicode domain spoofing)
function detectHomographAttack(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname || '';
    // Check for mixed scripts or confusing characters
    return /[а-яА-ЯёЁ]|[α-ωΑ-Ω]/.test(hostname);
  } catch {
    return false;
  }
}

// Check if URL is using IP address
function isIPBasedURL(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname || '';
    return /^\d+\.\d+\.\d+\.\d+$/.test(hostname);
  } catch {
    return false;
  }
}

function estimateUrlScore(
  detectionCount: number,
  reputation: number,
  phishingIndicators: string[],
  suspiciousTLD: boolean,
  homograph: boolean,
  ipBased: boolean
): number {
  let score = 0;

  // VirusTotal detections
  score += Math.min(40, detectionCount * 10);

  // Reputation
  score += Math.max(0, 20 - reputation);

  // Phishing indicators
  score += Math.min(15, phishingIndicators.length * 5);

  // Suspicious TLD
  if (suspiciousTLD) score += 15;

  // Homograph attack
  if (homograph) score += 25;

  // IP-based URL
  if (ipBased) score += 20;

  return Math.min(100, score);
}

export async function lookup(payload: string): Promise<IntelligenceResult[]> {
  const out: IntelligenceResult[] = [];
  const url = payload.trim();
  if (!url) return out;

  try {
    const metaResults: Array<{ sourceName: string; fetchedAt: string; raw?: unknown }> = [];

    // Validate URL
    let urlObj;
    try {
      urlObj = new URL(url);
    } catch {
      return out; // Invalid URL
    }

    // Parallel analysis
    const [vtResult, redirectChain] = await Promise.all([
      scanUrl(url).catch(() => ({
        malicious: 0,
        suspicious: 0,
        harmless: 0,
        undetected: 0,
        reputation: 0,
      })),
      analyzeRedirects(url).catch(() => ({
        redirects: [],
        finalUrl: url,
        count: 0,
      })),
    ]);

    // URL analysis
    const phishingIndicators = buildPhishingIndicators(url);
    const { suspicious: suspiciousTLD, tld } = isSuspiciousTLD(url);
    const homograph = detectHomographAttack(url);
    const ipBased = isIPBasedURL(url);
    const entropy = calculateEntropy(urlObj.hostname || '');

    // Score calculation
    const score = estimateUrlScore(
      vtResult.malicious + vtResult.suspicious,
      vtResult.reputation,
      phishingIndicators,
      suspiciousTLD,
      homograph,
      ipBased
    );

    // Add metadata
    metaResults.push({
      sourceName: 'virustotal',
      fetchedAt: new Date().toISOString(),
      raw: vtResult,
    });

    if (redirectChain.count > 0) {
      metaResults.push({
        sourceName: 'redirect-analysis',
        fetchedAt: new Date().toISOString(),
        raw: redirectChain,
      });
    }

    metaResults.push({
      sourceName: 'url-analysis',
      fetchedAt: new Date().toISOString(),
      raw: {
        phishingIndicators,
        suspiciousTLD,
        tld,
        homograph,
        ipBased,
        entropy: entropy.toFixed(2),
      },
    });

    // Create result
    const intel: IntelligenceResult = {
      id: makeId('url-intel'),
      queryId: makeId('q-url'),
      source: 'url',
      title: `URL Intelligence: ${urlObj.hostname}`,
      summary: `Detections: ${vtResult.malicious + vtResult.suspicious} | Redirects: ${redirectChain.count} | Threats: ${
        [
          phishingIndicators.length > 0 ? 'phishing' : null,
          suspiciousTLD ? 'suspicious-tld' : null,
          homograph ? 'homograph' : null,
          ipBased ? 'ip-based' : null,
        ]
          .filter(Boolean)
          .join(', ') || 'none'
      }`,
      score,
      meta: metaResults,
    };

    out.push(intel);
  } catch (error) {
    console.warn('urlIntel.lookup failed:', (error as Error).message);
  }

  return out;
}
