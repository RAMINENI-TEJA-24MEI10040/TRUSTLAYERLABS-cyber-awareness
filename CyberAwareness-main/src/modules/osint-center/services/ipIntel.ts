import { IntelligenceResult } from '../types/ciw.types';
import abuseIPDB from '../../../services/abuseipdb';

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

interface IPReputationData {
  ip: string;
  abuseScore?: number;
  hostingProvider?: string;
  vpnIndicator?: boolean;
  proxyIndicator?: boolean;
  asnNumber?: string;
  asnOrg?: string;
  country?: string;
  threatTypes?: string[];
}

// Query AbuseIPDB for reputation
async function checkAbuseIPDB(ip: string): Promise<IPReputationData> {
  const data: IPReputationData = { ip };

  try {
    // Use existing abuseIPDB service
    const response = await abuseIPDB.check(ip, { maxAgeInDays: 90 });
    if (response) {
      data.abuseScore = response.abuseConfidenceScore;
      data.hostingProvider = response.usageType;
      data.country = response.countryCode;

      // Detect threat patterns
      if (response.usageType === 'VPN') data.vpnIndicator = true;
      if (response.usageType === 'Proxy') data.proxyIndicator = true;
    }
  } catch {
    // AbuseIPDB may not be available or rate limited
  }

  return data;
}

// Lookup ASN information
async function lookupASN(ip: string): Promise<{ asnNumber?: string; asnOrg?: string }> {
  try {
    // Use WHOIS data via free ARIN lookup
    const response = await withTimeout(
      fetch(`https://whois.arin.net/rest/ip/${encodeURIComponent(ip)}`),
      DEFAULT_TIMEOUT
    );

    if (!response.ok) return {};

    const text = await response.text();
    const asnMatch = text.match(/OriginAS:\s*AS(\d+)/i);
    const orgMatch = text.match(/Organization:\s*([^\n]+)/i);

    return {
      asnNumber: asnMatch ? `AS${asnMatch[1]}` : undefined,
      asnOrg: orgMatch ? orgMatch[1].trim() : undefined,
    };
  } catch {
    return {};
  }
}

// Detect VPN/Proxy/Datacenter indicators
function analyzeIPCharacteristics(ip: string): { vpnIndicator: boolean; proxyIndicator: boolean; datacenters: string[] } {
  const datacenters: string[] = [];
  let vpnIndicator = false;
  let proxyIndicator = false;

  // Known datacenter IP ranges (simplified)
  const datacenterRanges: Record<string, string> = {
    '34.64.0.0/10': 'google-cloud',
    '13.32.0.0/11': 'aws-cloudfront',
    '207.183.0.0/16': 'tor-exit-node',
    '104.16.0.0/12': 'cloudflare',
    '162.125.0.0/16': 'linode',
  };

  // Parse IP
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4 || parts.some((p) => Number.isNaN(p) || p > 255)) return { vpnIndicator, proxyIndicator, datacenters };

  const ipNum = parts[0] * 16777216 + parts[1] * 65536 + parts[2] * 256 + parts[3];

  // Check ranges
  if ((parts[0] === 107 || parts[0] === 138 || parts[0] === 149) && parts[1] >= 154) vpnIndicator = true;
  if (ip.startsWith('10.') || ip.startsWith('192.168.') || ip.startsWith('172.')) datacenters.push('private-network');
  if (parts[0] === 127) datacenters.push('loopback');

  return { vpnIndicator, proxyIndicator, datacenters };
}

// Validate IP format
function isValidIPv4(ip: string): boolean {
  const parts = ip.split('.');
  if (parts.length !== 4) return false;
  return parts.every((part) => {
    const num = Number(part);
    return Number.isInteger(num) && num >= 0 && num <= 255;
  });
}

export async function lookup(payload: string): Promise<IntelligenceResult[]> {
  const out: IntelligenceResult[] = [];
  const ip = payload.trim();

  if (!ip || !isValidIPv4(ip)) {
    return out;
  }

  try {
    let aggregatedScore = 0;
    const metaResults: Array<{ sourceName: string; fetchedAt: string; raw?: unknown }> = [];

    // Parallel queries
    const [abuseIPData, asnData, ipChars] = await Promise.all([
      checkAbuseIPDB(ip),
      lookupASN(ip),
      Promise.resolve(analyzeIPCharacteristics(ip)),
    ]);

    // Merge results
    const fullData: IPReputationData = {
      ...abuseIPData,
      ...asnData,
      vpnIndicator: abuseIPData.vpnIndicator || ipChars.vpnIndicator,
      proxyIndicator: abuseIPData.proxyIndicator || ipChars.proxyIndicator,
    };

    // Score calculation
    if (abuseIPData.abuseScore !== undefined) {
      aggregatedScore = abuseIPData.abuseScore;
    }
    if (fullData.vpnIndicator) aggregatedScore += 20;
    if (fullData.proxyIndicator) aggregatedScore += 15;
    if (ipChars.datacenters.length > 0) aggregatedScore += 10;

    // Add metadata
    if (abuseIPData.abuseScore !== undefined) {
      metaResults.push({
        sourceName: 'abuseipdb',
        fetchedAt: new Date().toISOString(),
        raw: abuseIPData,
      });
    }

    if (asnData.asnNumber) {
      metaResults.push({
        sourceName: 'asn-lookup',
        fetchedAt: new Date().toISOString(),
        raw: asnData,
      });
    }

    if (ipChars.datacenters.length > 0 || ipChars.vpnIndicator || ipChars.proxyIndicator) {
      metaResults.push({
        sourceName: 'ip-characteristics',
        fetchedAt: new Date().toISOString(),
        raw: ipChars,
      });
    }

    // Determine threat types
    const threatTypes: string[] = [];
    if (fullData.vpnIndicator) threatTypes.push('vpn');
    if (fullData.proxyIndicator) threatTypes.push('proxy');
    if (ipChars.datacenters.length > 0) threatTypes.push('datacenter');
    if (abuseIPData.abuseScore && abuseIPData.abuseScore > 50) threatTypes.push('abusive');

    // Create result
    const intel: IntelligenceResult = {
      id: makeId('ip-intel'),
      queryId: makeId('q-ip'),
      source: 'ip',
      title: `IP Intelligence: ${ip}`,
      summary: `Country: ${fullData.country || 'unknown'} | ASN: ${fullData.asnNumber || 'unknown'} | Threats: ${
        threatTypes.length > 0 ? threatTypes.join(', ') : 'none'
      }`,
      score: Math.min(100, aggregatedScore),
      meta: metaResults,
    };

    out.push(intel);
  } catch (error) {
    console.warn('ipIntel.lookup failed:', (error as Error).message);
  }

  return out;
}
