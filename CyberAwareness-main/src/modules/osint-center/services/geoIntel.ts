import { IntelligenceResult } from '../types/ciw.types';
import abuseipdb, { AbuseReportScore } from '../../../services/abuseipdb';

const DEFAULT_TIMEOUT = 9000;

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

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

// Fallback public geo lookup (no API key required)
// Uses ip-api.com free tier with rate limit awareness
async function fallbackGeoLookup(ip: string, timeout = 5000): Promise<{ ip: string; isp?: string; country?: string } | null> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    // Try ip-api.com (more reliable free tier than ipapi.co)
    const res = await fetch(`http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,query,org,country`, { signal: controller.signal });
    clearTimeout(id);
    if (!res.ok) {
      console.warn(`geoIntel.fallbackGeoLookup: ip-api.com returned ${res.status}, skipping fallback`);
      return null;
    }
    const json = await res.json() as Record<string, unknown>;
    
    // Check if ip-api.com returned success
    if (json.status !== 'success') {
      console.warn(`geoIntel.fallbackGeoLookup: ip-api.com returned status=${json.status}`);
      return null;
    }
    
    return { ip: json.query as string, isp: json.org as string | undefined, country: json.country as string | undefined };
  } catch (e) {
    if ((e as Error).name === 'AbortError') console.warn('geoIntel.fallbackGeoLookup: request timed out');
    return null;
  } finally {
    clearTimeout(id);
  }
}

export async function lookup(payload: string): Promise<IntelligenceResult[]> {
  const out: IntelligenceResult[] = [];
  if (!payload) return out;

  const ip = payload.trim();
  try {
    // Try AbuseIPDB first (requires API key)
    try {
      const data = await withTimeout(abuseipdb.checkIP(ip), DEFAULT_TIMEOUT) as AbuseReportScore;
      const score = Math.min(100, Math.round(Number(data.abuseConfidenceScore ?? 0)));
      const intel: IntelligenceResult = {
        id: makeId('geo'),
        queryId: makeId('q'),
        source: 'ip',
        title: `IP Reputation: ${data.ipAddress}`,
        summary: `ISP: ${data.isp ?? 'Unknown'} • Country: ${data.countryCode ?? 'Unknown'}`,
        score,
        meta: [
          { sourceName: 'abuseipdb', fetchedAt: new Date().toISOString(), raw: data },
        ],
      };
      out.push(intel);
      return out;
    } catch (e) {
      console.warn('geoIntel.lookup: AbuseIPDB unavailable or timed out, falling back to public geo lookup');
    }

    const fallback = await fallbackGeoLookup(ip);
    if (fallback) {
      const intel: IntelligenceResult = {
        id: makeId('geo'),
        queryId: makeId('q'),
        source: 'ip',
        title: `IP Geolocation: ${fallback.ip}`,
        summary: `ISP: ${fallback.isp ?? 'Unknown'} • Country: ${fallback.country ?? 'Unknown'}`,
        score: 0,
        meta: [
          { sourceName: 'ipapi', fetchedAt: new Date().toISOString(), raw: fallback },
        ],
      };
      out.push(intel);
    }
  } catch (error) {
    console.error('geoIntel.lookup error', error);
  }

  return out;
}
