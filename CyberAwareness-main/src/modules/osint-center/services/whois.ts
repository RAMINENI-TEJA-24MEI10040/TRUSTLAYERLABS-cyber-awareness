import { IntelligenceResult } from '../types/ciw.types';

const DEFAULT_TIMEOUT = 9000;

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function makeAbortController(timeout: number) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  return { controller, id };
}

async function fetchJson(url: string): Promise<any | null> {
  try {
    const response = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.warn('whois.fetchJson failed', error);
    return null;
  }
}

async function fetchDnsRecords(domain: string) {
  const families = ['A', 'AAAA', 'NS', 'MX', 'TXT', 'CNAME'];
  const records: Record<string, unknown[]> = {};

  await Promise.all(
    families.map(async (type) => {
      const googleUrl = `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=${type}`;
      const response = await fetchJson(googleUrl);
      if (response?.Answer) {
        records[type] = response.Answer.map((answer: any) => answer.data);
      }
    })
  );

  return records;
}

async function fetchSslInformation(domain: string) {
  try {
    const response = await fetch(`https://crt.sh/?q=%25${encodeURIComponent(domain)}&output=json`, {
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) return null;
    const raw = await response.json();
    if (!Array.isArray(raw) || raw.length === 0) return null;
    const latest = raw[0];
    return {
      issuer: latest.issuer_name,
      notBefore: latest.not_before,
      notAfter: latest.not_after,
      commonName: latest.name_value,
      raw,
    };
  } catch (error) {
    console.warn('whois.fetchSslInformation failed', error);
    return null;
  }
}

function computeDomainAgeDays(rdapData: Record<string, any> | null, sslInfo: Record<string, unknown> | null) {
  const now = Date.now();
  const creation = rdapData?.events?.find((event: any) => event.eventAction === 'registration')?.eventDate ?? rdapData?.events?.find((event: any) => event.eventAction === 'registration')?.eventDate;
  if (creation) {
    const date = new Date(String(creation));
    if (!Number.isNaN(date.getTime())) {
      return Math.round((now - date.getTime()) / 86400000);
    }
  }

  const notBefore = sslInfo?.notBefore ? new Date(String(sslInfo.notBefore)) : null;
  if (notBefore && !Number.isNaN(notBefore.getTime())) {
    return Math.round((now - notBefore.getTime()) / 86400000);
  }

  return undefined;
}

export async function lookup(payload: string): Promise<IntelligenceResult[]> {
  const out: IntelligenceResult[] = [];
  if (!payload) return out;

  const domain = payload.trim().replace(/^https?:\/\//, '').split('/')[0];
  const rdapBase = (import.meta.env.VITE_RDAP_BASE as string | undefined) || 'https://rdap.org';
  const { controller, id } = makeAbortController(DEFAULT_TIMEOUT);

  try {
    const rdapUrl = `${rdapBase.replace(/\/$/, '')}/domain/${encodeURIComponent(domain)}`;
    const rdapResponse = await fetch(rdapUrl, { signal: controller.signal, headers: { Accept: 'application/json' } });
    clearTimeout(id);
    if (!rdapResponse.ok) {
      return out;
    }

    const rdapData = await rdapResponse.json();
    const dnsRecords = await fetchDnsRecords(domain);
    const sslInfo = await fetchSslInformation(domain);
    const nameservers = Array.isArray(dnsRecords.NS) ? dnsRecords.NS.map(String) : [];
    const domainAgeDays = computeDomainAgeDays(rdapData, sslInfo);
    const riskScore = Math.min(
      100,
      Math.round(
        (nameservers.length > 0 ? 10 : 25) +
          (sslInfo ? 0 : 30) +
          (domainAgeDays !== undefined && domainAgeDays < 60 ? 20 : 0)
      )
    );

    const summaryParts = [
      `Registrar: ${typeof rdapData.registrar === 'string' ? rdapData.registrar : 'unknown'}`,
      nameservers.length ? `NS: ${nameservers.slice(0, 3).join(', ')}` : 'Nameservers: none',
      sslInfo ? 'SSL: found' : 'SSL: unavailable',
    ];

    const intel: IntelligenceResult = {
      id: makeId('whois'),
      queryId: makeId('q'),
      source: 'domain',
      title: `Domain Intelligence: ${domain}`,
      summary: summaryParts.join(' • '),
      score: riskScore,
      meta: [
        { sourceName: 'rdap', fetchedAt: new Date().toISOString(), raw: rdapData },
        { sourceName: 'dns', fetchedAt: new Date().toISOString(), raw: dnsRecords },
        { sourceName: 'ssl', fetchedAt: new Date().toISOString(), raw: sslInfo },
      ],
    };

    out.push(intel);
  } catch (error) {
    if ((error as Error).name === 'AbortError') console.warn('whois.lookup: RDAP request timed out');
    else console.error('whois.lookup error', error);
  } finally {
    clearTimeout(id);
  }

  return out;
}
