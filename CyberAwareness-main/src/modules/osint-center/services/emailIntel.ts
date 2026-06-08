import { IntelligenceResult } from '../types/ciw.types';
import hibpService, { BreachResponse, PasteData } from '../../../services/hibp';

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

// Simple MD5 hash for Gravatar (browser-compatible)
function md5(message: string): string {
  function rotateLeft(lValue: number, iShiftBits: number) {
    return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
  }

  function addUnsigned(lX: number, lY: number) {
    const lX4 = lX & 0x40000000;
    const lY4 = lY & 0x40000000;
    const lX8 = lX & 0x80000000;
    const lY8 = lY & 0x80000000;
    const lResult = (lX & 0x3fffffff) + (lY & 0x3fffffff);
    if (lX4 & lY4) {
      return lResult ^ 0x80000000 ^ lX8 ^ lY8;
    }
    if (lX4 | lY4) {
      if (lResult & 0x40000000) {
        return lResult ^ 0xc0000000 ^ lX8 ^ lY8;
      }
      return lResult ^ 0x40000000 ^ lX8 ^ lY8;
    }
    return lResult ^ lX8 ^ lY8;
  }

  function f(x: number, y: number, z: number) {
    return (x & y) | (~x & z);
  }

  function g(x: number, y: number, z: number) {
    return (x & z) | (y & ~z);
  }

  function h(x: number, y: number, z: number) {
    return x ^ y ^ z;
  }

  function i(x: number, y: number, z: number) {
    return y ^ (x | ~z);
  }

  function convertToWordArray(str: string) {
    const lMessageLength = str.length;
    const lNumberOfWordsTemp1 = lMessageLength + 8;
    const lNumberOfWordsTemp2 = ((lNumberOfWordsTemp1 - (lNumberOfWordsTemp1 % 64)) / 64 + 1) * 16;
    const lWordArray = new Array<number>(lNumberOfWordsTemp2 - 1);
    let lBytePosition = 0;
    let lByteCount = 0;

    while (lByteCount < lMessageLength) {
      const lWordCount = (lByteCount - (lByteCount % 4)) / 4;
      lBytePosition = (lByteCount % 4) * 8;
      lWordArray[lWordCount] = (lWordArray[lWordCount] || 0) | (str.charCodeAt(lByteCount) << lBytePosition);
      lByteCount += 1;
    }

    const lWordCount = (lByteCount - (lByteCount % 4)) / 4;
    lBytePosition = (lByteCount % 4) * 8;
    lWordArray[lWordCount] = (lWordArray[lWordCount] || 0) | (0x80 << lBytePosition);
    lWordArray[lNumberOfWordsTemp2 - 2] = lMessageLength << 3;
    lWordArray[lNumberOfWordsTemp2 - 1] = lMessageLength >>> 29;
    return lWordArray;
  }

  function wordToHex(lValue: number) {
    let wordToHexValue = '';
    for (let i = 0; i <= 3; i += 1) {
      const byte = (lValue >>> (i * 8)) & 255;
      const hex = byte.toString(16);
      wordToHexValue += hex.length === 1 ? `0${hex}` : hex;
    }
    return wordToHexValue;
  }

  function utf8Encode(str: string) {
    return unescape(encodeURIComponent(str));
  }

  const x = convertToWordArray(utf8Encode(message));
  let a = 0x67452301;
  let b = 0xefcdab89;
  let c = 0x98badcfe;
  let d = 0x10325476;

  for (let k = 0; k < x.length; k += 16) {
    const aa = a;
    const bb = b;
    const cc = c;
    const dd = d;

    a = ff(a, b, c, d, x[k + 0], 7, 0xd76aa478);
    d = ff(d, a, b, c, x[k + 1], 12, 0xe8c7b756);
    c = ff(c, d, a, b, x[k + 2], 17, 0x242070db);
    b = ff(b, c, d, a, x[k + 3], 22, 0xc1bdceee);
    a = ff(a, b, c, d, x[k + 4], 7, 0xf57c0faf);
    d = ff(d, a, b, c, x[k + 5], 12, 0x4787c62a);
    c = ff(c, d, a, b, x[k + 6], 17, 0xa8304613);
    b = ff(b, c, d, a, x[k + 7], 22, 0xfd469501);
    a = ff(a, b, c, d, x[k + 8], 7, 0x698098d8);
    d = ff(d, a, b, c, x[k + 9], 12, 0x8b44f7af);
    c = ff(c, d, a, b, x[k + 10], 17, 0xffff5bb1);
    b = ff(b, c, d, a, x[k + 11], 22, 0x895cd7be);
    a = ff(a, b, c, d, x[k + 12], 7, 0x6b901122);
    d = ff(d, a, b, c, x[k + 13], 12, 0xfd987193);
    c = ff(c, d, a, b, x[k + 14], 17, 0xa679438e);
    b = ff(b, c, d, a, x[k + 15], 22, 0x49b40821);

    a = gg(a, b, c, d, x[k + 1], 5, 0xf61e2562);
    d = gg(d, a, b, c, x[k + 6], 9, 0xc040b340);
    c = gg(c, d, a, b, x[k + 11], 14, 0x265e5a51);
    b = gg(b, c, d, a, x[k + 0], 20, 0xe9b6c7aa);
    a = gg(a, b, c, d, x[k + 5], 5, 0xd62f105d);
    d = gg(d, a, b, c, x[k + 10], 9, 0x02441453);
    c = gg(c, d, a, b, x[k + 15], 14, 0xd8a1e681);
    b = gg(b, c, d, a, x[k + 4], 20, 0xe7d3fbc8);
    a = gg(a, b, c, d, x[k + 9], 5, 0x21e1cde6);
    d = gg(d, a, b, c, x[k + 14], 9, 0xc33707d6);
    c = gg(c, d, a, b, x[k + 3], 14, 0xf4d50d87);
    b = gg(b, c, d, a, x[k + 8], 20, 0x455a14ed);
    a = gg(a, b, c, d, x[k + 13], 5, 0xa9e3e905);
    d = gg(d, a, b, c, x[k + 2], 9, 0xfcefa3f8);
    c = gg(c, d, a, b, x[k + 7], 14, 0x676f02d9);
    b = gg(b, c, d, a, x[k + 12], 20, 0x8d2a4c8a);

    a = hh(a, b, c, d, x[k + 5], 4, 0xfffa3942);
    d = hh(d, a, b, c, x[k + 8], 11, 0x8771f681);
    c = hh(c, d, a, b, x[k + 11], 16, 0x6d9d6122);
    b = hh(b, c, d, a, x[k + 14], 23, 0xfde5380c);
    a = hh(a, b, c, d, x[k + 1], 4, 0xa4beea44);
    d = hh(d, a, b, c, x[k + 4], 11, 0x4bdecfa9);
    c = hh(c, d, a, b, x[k + 7], 16, 0xf6bb4b60);
    b = hh(b, c, d, a, x[k + 10], 23, 0xbebfbc70);
    a = hh(a, b, c, d, x[k + 13], 4, 0x289b7ec6);
    d = hh(d, a, b, c, x[k + 0], 11, 0xeaa127fa);
    c = hh(c, d, a, b, x[k + 3], 16, 0xd4ef3085);
    b = hh(b, c, d, a, x[k + 6], 23, 0x04881d05);
    a = hh(a, b, c, d, x[k + 9], 4, 0xd9d4d039);
    d = hh(d, a, b, c, x[k + 12], 11, 0xe6db99e5);
    c = hh(c, d, a, b, x[k + 15], 16, 0x1fa27cf8);
    b = hh(b, c, d, a, x[k + 2], 23, 0xc4ac5665);

    a = ii(a, b, c, d, x[k + 0], 6, 0xf4292244);
    d = ii(d, a, b, c, x[k + 7], 10, 0x432aff97);
    c = ii(c, d, a, b, x[k + 14], 15, 0xab9423a7);
    b = ii(b, c, d, a, x[k + 5], 21, 0xfc93a039);
    a = ii(a, b, c, d, x[k + 12], 6, 0x655b59c3);
    d = ii(d, a, b, c, x[k + 3], 10, 0x8f0ccc92);
    c = ii(c, d, a, b, x[k + 10], 15, 0xffeff47d);
    b = ii(b, c, d, a, x[k + 1], 21, 0x85845dd1);
    a = ii(a, b, c, d, x[k + 8], 6, 0x6fa87e4f);
    d = ii(d, a, b, c, x[k + 15], 10, 0xfe2ce6e0);
    c = ii(c, d, a, b, x[k + 6], 15, 0xa3014314);
    b = ii(b, c, d, a, x[k + 13], 21, 0x4e0811a1);
    a = ii(a, b, c, d, x[k + 4], 6, 0xf7537e82);
    d = ii(d, a, b, c, x[k + 11], 10, 0xbd3af235);
    c = ii(c, d, a, b, x[k + 2], 15, 0x2ad7d2bb);
    b = ii(b, c, d, a, x[k + 9], 21, 0xeb86d391);

    a = addUnsigned(a, aa);
    b = addUnsigned(b, bb);
    c = addUnsigned(c, cc);
    d = addUnsigned(d, dd);
  }

  return wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);

  function ff(aVal: number, bVal: number, cVal: number, dVal: number, xVal: number, s: number, ac: number) {
    return addUnsigned(rotateLeft(addUnsigned(addUnsigned(aVal, f(bVal, cVal, dVal)), addUnsigned(xVal, ac)), s), bVal);
  }

  function gg(aVal: number, bVal: number, cVal: number, dVal: number, xVal: number, s: number, ac: number) {
    return addUnsigned(rotateLeft(addUnsigned(addUnsigned(aVal, g(bVal, cVal, dVal)), addUnsigned(xVal, ac)), s), bVal);
  }

  function hh(aVal: number, bVal: number, cVal: number, dVal: number, xVal: number, s: number, ac: number) {
    return addUnsigned(rotateLeft(addUnsigned(addUnsigned(aVal, h(bVal, cVal, dVal)), addUnsigned(xVal, ac)), s), bVal);
  }

  function ii(aVal: number, bVal: number, cVal: number, dVal: number, xVal: number, s: number, ac: number) {
    return addUnsigned(rotateLeft(addUnsigned(addUnsigned(aVal, i(bVal, cVal, dVal)), addUnsigned(xVal, ac)), s), bVal);
  }
}

// Disposable email domain list (common temporary email services)
const DISPOSABLE_DOMAINS = new Set([
  'tempmail.com', 'mailinator.com', 'guerrillamail.com', 'temp-mail.org',
  '10minutemail.com', 'maildrop.cc', 'throwaway.email', 'sharklasers.com',
  'maildisposable.com', 'fakeinbox.com', 'trashmail.com', 'yopmail.com',
  'spam4.me', 'grr.la', 'guerrillamail.info', 'pokemail.net',
  'bugmenot.com', '33mail.com', 'minutemail.com',
]);

interface GravatarProfile {
  exists: boolean;
  profileUrl?: string;
  displayName?: string;
  verified?: boolean;
}

interface EmailReputation {
  isDisposable: boolean;
  hasCommonProvider: boolean;
  domainRisk: 'low' | 'medium' | 'high';
  indicators: string[];
}

interface MXRecordInfo {
  domain: string;
  hasMX: boolean;
  providers: string[];
}

// Check Gravatar profile existence (free API)
async function checkGravatarProfile(email: string): Promise<GravatarProfile> {
  try {
    const hash = md5(email.trim().toLowerCase());
    const response = await withTimeout(
      fetch(`https://www.gravatar.com/${hash}.json`),
      5000
    );

    if (response.ok) {
      const data = await response.json();
      return {
        exists: true,
        profileUrl: data.profileUrl || `https://gravatar.com/${hash}`,
        displayName: data.displayName,
        verified: !!data.verified,
      };
    }
    return { exists: false };
  } catch {
    return { exists: false };
  }
}

// Analyze email domain reputation
function analyzeEmailReputation(email: string): EmailReputation {
  const domain = email.split('@')[1]?.toLowerCase() || '';
  const isDisposable = DISPOSABLE_DOMAINS.has(domain);
  const commonProviders = ['gmail.com', 'yahoo.com', 'outlook.com', 'protonmail.com', 'icloud.com'];
  const hasCommonProvider = commonProviders.includes(domain);
  
  const indicators: string[] = [];
  if (isDisposable) indicators.push('disposable-domain');
  if (email.includes('+')) indicators.push('aliased-email');
  if (email.match(/\d{3,}/)) indicators.push('numeric-heavy');
  
  let domainRisk: 'low' | 'medium' | 'high' = 'low';
  if (isDisposable) domainRisk = 'high';
  else if (hasCommonProvider) domainRisk = 'low';
  else domainRisk = 'medium';
  
  return { isDisposable, hasCommonProvider, domainRisk, indicators };
}

// Simulate MX record analysis (check domain format)
function analyzeMXRecords(email: string): MXRecordInfo {
  const domain = email.split('@')[1]?.toLowerCase() || '';
  
  // In production, this would use actual DNS queries
  // For now, we provide the domain structure analysis
  const providers: string[] = [];
  
  // Known large mail providers
  const largeProviders: Record<string, string[]> = {
    'google.com': ['gmail.com', 'googlemail.com'],
    'microsoft.com': ['outlook.com', 'hotmail.com', 'live.com', 'msn.com'],
    'yahoo.com': ['yahoo.com', 'ymail.com'],
    'protonmail.com': ['protonmail.com', 'pm.me'],
  };
  
  for (const [provider, domains] of Object.entries(largeProviders)) {
    if (domains.includes(domain)) {
      providers.push(provider);
    }
  }
  
  return {
    domain,
    hasMX: !domain.includes('localhost') && domain.length > 0,
    providers,
  };
}

// Estimate domain age (simple heuristic)
function estimateDomainAge(domain: string): { estimatedAge: number; riskLevel: string } {
  // In production, use WHOIS APIs like RDAP
  // For now, use common knowledge about domains
  const newDomainPatterns = ['temp', 'test', 'new', 'tmp', 'mail'];
  const isNewPattern = newDomainPatterns.some((p) => domain.toLowerCase().includes(p));
  
  return {
    estimatedAge: isNewPattern ? 0 : 1,
    riskLevel: isNewPattern ? 'high' : 'medium',
  };
}

export async function lookup(payload: string): Promise<IntelligenceResult[]> {
  const out: IntelligenceResult[] = [];
  if (!payload || !payload.includes('@')) return out;

  const email = payload.trim();
  let aggregatedScore = 0;
  const metaResults: Array<{ sourceName: string; fetchedAt: string; raw?: unknown }> = [];

  try {
    // HIBP Breach Check
    try {
      const res = (await withTimeout(hibpService.checkEmailBreach(email), DEFAULT_TIMEOUT)) as BreachResponse;
      const breaches = res.breaches ?? [];
      const breachCount = breaches.length;
      const breachScore = Math.min(40, breachCount * 15);
      aggregatedScore += breachScore;

      metaResults.push({
        sourceName: 'hibp',
        fetchedAt: new Date().toISOString(),
        raw: res,
      });

      // Try HIBP pastes
      try {
        const pastes = (await withTimeout(hibpService.checkPastes(email), DEFAULT_TIMEOUT)) as PasteData[];
        if (pastes && pastes.length > 0) {
          aggregatedScore += Math.min(20, pastes.length * 5);
          metaResults.push({ sourceName: 'hibp-pastes', fetchedAt: new Date().toISOString(), raw: pastes });
        }
      } catch {
        // non-fatal
      }
    } catch {
      // hibpService may not be available
    }

    // Gravatar profile lookup
    try {
      const gravatarData = await checkGravatarProfile(email);
      metaResults.push({
        sourceName: 'gravatar',
        fetchedAt: new Date().toISOString(),
        raw: gravatarData,
      });
      if (gravatarData.exists) {
        aggregatedScore += 5; // public profile presence is neutral
      }
    } catch {
      // non-fatal
    }

    // Email reputation analysis
    const reputation = analyzeEmailReputation(email);
    metaResults.push({
      sourceName: 'email-reputation',
      fetchedAt: new Date().toISOString(),
      raw: reputation,
    });
    if (reputation.domainRisk === 'high') aggregatedScore += 25;
    else if (reputation.domainRisk === 'medium') aggregatedScore += 10;

    // MX records analysis
    const mxInfo = analyzeMXRecords(email);
    metaResults.push({
      sourceName: 'mx-analysis',
      fetchedAt: new Date().toISOString(),
      raw: mxInfo,
    });
    if (!mxInfo.hasMX) aggregatedScore += 15;

    // Domain age estimation
    const domainAge = estimateDomainAge(mxInfo.domain);
    metaResults.push({
      sourceName: 'domain-age',
      fetchedAt: new Date().toISOString(),
      raw: domainAge,
    });
    if (domainAge.riskLevel === 'high') aggregatedScore += 15;

    // Create main intelligence result
    const finalScore = Math.min(100, aggregatedScore);
    const intel: IntelligenceResult = {
      id: makeId('email-intel'),
      queryId: makeId('q-email'),
      source: 'email',
      title: `Email Intelligence: ${email}`,
      summary: `Breach: ${reputation.isDisposable ? 'Disposable domain' : 'Standard domain'} | Reputation: ${reputation.domainRisk}`,
      score: finalScore,
      meta: metaResults,
    };

    out.push(intel);
  } catch (error) {
    console.warn('emailIntel.lookup failed:', (error as Error).message);
  }

  return out;
}
