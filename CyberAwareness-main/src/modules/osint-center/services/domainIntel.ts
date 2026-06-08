import { IntelligenceResult } from '../types/ciw.types';

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

interface CertificateInfo {
  id: string;
  issuer: string;
  notBefore: string;
  notAfter: string;
  commonName: string;
}

interface RDAPData {
  domain: string;
  status: string[];
  registrar?: string;
  created?: string;
  updated?: string;
}

interface DomainIntelData {
  domain: string;
  tld: string;
  certificates?: CertificateInfo[];
  rdapData?: RDAPData;
  dnsRecords?: Record<string, unknown>;
  nameservers?: string[];
  riskFactors: string[];
  riskScore: number;
}

// Fetch certificates from crt.sh (Certificate Transparency)
async function fetchCertificates(domain: string): Promise<CertificateInfo[]> {
  try {
    const response = await withTimeout(
      fetch(`https://crt.sh/?q=${encodeURIComponent(domain)}&output=json`),
      DEFAULT_TIMEOUT
    );

    if (!response.ok) return [];

    const data = await response.json() as Array<{
      id: number;
      issuer_name: string;
      not_before: string;
      not_after: string;
      common_name: string;
    }>;

    if (!Array.isArray(data)) return [];

    // Deduplicate and return recent certificates
    const uniqueCerts = Array.from(
      new Map(
        data
          .filter((c) => c.id && c.issuer_name)
          .map((c) => [
            `${c.common_name}|${c.issuer_name}`,
            {
              id: String(c.id),
              issuer: c.issuer_name,
              notBefore: c.not_before,
              notAfter: c.not_after,
              commonName: c.common_name,
            },
          ])
      ).values()
    );

    return uniqueCerts.slice(0, 5); // Return top 5 recent
  } catch {
    return [];
  }
}

// Query RDAP for domain registration info
async function queryRDAP(domain: string): Promise<RDAPData | null> {
  try {
    // RDAP bootstrap service
    const response = await withTimeout(
      fetch(`https://rdap.org/domain/${encodeURIComponent(domain)}`),
      DEFAULT_TIMEOUT
    );

    if (!response.ok) return null;

    const data = await response.json() as {
      ldhName?: string;
      status?: string[];
      entities?: Array<{ handle?: string; roles?: string[] }>;
      events?: Array<{ eventAction?: string; eventDate?: string }>;
    };

    const registrar = data.entities?.find((e) => e.roles?.includes('registrar'))?.handle;
    const createdEvent = data.events?.find((e) => e.eventAction === 'registration')?.eventDate;
    const updatedEvent = data.events?.find((e) => e.eventAction === 'last changed')?.eventDate;

    return {
      domain: data.ldhName || domain,
      status: data.status || [],
      registrar,
      created: createdEvent,
      updated: updatedEvent,
    };
  } catch {
    return null;
  }
}

// Analyze domain for risk factors
function analyzeDomainRisks(domain: string, rdapData: RDAPData | null, certs: CertificateInfo[]): {
  riskFactors: string[];
  riskScore: number;
} {
  const riskFactors: string[] = [];
  let riskScore = 0;

  // Check domain age via registration
  if (rdapData?.created) {
    const createdDate = new Date(rdapData.created);
    const ageMs = Date.now() - createdDate.getTime();
    const ageDays = ageMs / (1000 * 60 * 60 * 24);

    if (ageDays < 30) {
      riskFactors.push('very-new-domain');
      riskScore += 25;
    } else if (ageDays < 180) {
      riskFactors.push('new-domain');
      riskScore += 15;
    } else if (ageDays > 365 * 5) {
      riskScore -= 10; // Older domains are typically safer
    }
  }

  // Check certificate chain
  if (certs.length === 0) {
    riskFactors.push('no-ssl-certificate');
    riskScore += 20;
  } else {
    // Check for self-signed or suspicious certs
    const hasWildcard = certs.some((c) => c.commonName.startsWith('*.'));
    if (hasWildcard) riskFactors.push('wildcard-certificate');

    // Check certificate validity
    const now = new Date();
    const expiredCerts = certs.filter((c) => new Date(c.notAfter) < now);
    if (expiredCerts.length > 0) {
      riskFactors.push('expired-certificate');
      riskScore += 30;
    }
  }

  // Check domain status
  if (rdapData?.status) {
    if (rdapData.status.includes('clientHold') || rdapData.status.includes('serverHold')) {
      riskFactors.push('domain-suspended');
      riskScore += 35;
    }
    if (rdapData.status.includes('redemptionPeriod')) {
      riskFactors.push('domain-expired-redemption');
      riskScore += 25;
    }
  }

  // Check TLD reputation
  const tld = domain.split('.').pop()?.toLowerCase() || '';
  const suspiciousTLDs = ['tk', 'ml', 'ga', 'cf', 'xyz', 'top', 'info', 'download'];
  if (suspiciousTLDs.includes(tld)) {
    riskFactors.push('suspicious-tld');
    riskScore += 15;
  }

  // Check for typosquatting patterns
  const commonDomains = ['google', 'microsoft', 'apple', 'amazon', 'facebook', 'twitter'];
  const typoPattern = commonDomains.some((d) => domain.includes(d));
  if (typoPattern && domain.length > 15) {
    riskFactors.push('possible-typosquatting');
    riskScore += 20;
  }

  return {
    riskFactors,
    riskScore: Math.max(0, Math.min(100, riskScore + 25)),
  };
}

export async function lookup(payload: string): Promise<IntelligenceResult[]> {
  const out: IntelligenceResult[] = [];
  const domain = payload.trim().toLowerCase();

  if (!domain || !domain.includes('.')) {
    return out;
  }

  try {
    const metaResults: Array<{ sourceName: string; fetchedAt: string; raw?: unknown }> = [];

    // Fetch certificates in parallel with RDAP
    const [certificates, rdapData] = await Promise.all([
      fetchCertificates(domain),
      queryRDAP(domain),
    ]);

    // Analyze risks
    const { riskFactors, riskScore } = analyzeDomainRisks(domain, rdapData, certificates);

    // Collect meta data
    if (certificates.length > 0) {
      metaResults.push({
        sourceName: 'crt.sh',
        fetchedAt: new Date().toISOString(),
        raw: { certificates },
      });
    }

    if (rdapData) {
      metaResults.push({
        sourceName: 'rdap',
        fetchedAt: new Date().toISOString(),
        raw: rdapData,
      });
    }

    // Create intelligence result
    const intel: IntelligenceResult = {
      id: makeId('domain-intel'),
      queryId: makeId('q-domain'),
      source: 'domain',
      title: `Domain Intelligence: ${domain}`,
      summary: `Risk factors: ${riskFactors.length > 0 ? riskFactors.join(', ') : 'none detected'} | Certificates: ${
        certificates.length
      }`,
      score: riskScore,
      meta: metaResults,
    };

    out.push(intel);
  } catch (error) {
    console.warn('domainIntel.lookup failed:', (error as Error).message);
  }

  return out;
}
