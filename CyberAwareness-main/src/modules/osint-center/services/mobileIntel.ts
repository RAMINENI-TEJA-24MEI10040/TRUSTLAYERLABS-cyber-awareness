import { IntelligenceResult } from '../types/ciw.types';

type PhoneApiResponse = Record<string, unknown>;

const COUNTRY_CODE_MAP: Record<string, string> = {
  '1': 'United States / Canada',
  '44': 'United Kingdom',
  '91': 'India',
  '61': 'Australia',
  '81': 'Japan',
  '49': 'Germany',
  '33': 'France',
  '55': 'Brazil',
  '86': 'China',
  '7': 'Russia',
  '39': 'Italy',
  '34': 'Spain',
  '971': 'United Arab Emirates',
  '27': 'South Africa',
  '65': 'Singapore',
};

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeNumber(value: string): string {
  return value.replace(/[\s()-]/g, '');
}

function detectCountry(phone: string) {
  const digits = phone.replace(/[^0-9]/g, '');
  for (const code of Object.keys(COUNTRY_CODE_MAP).sort((a, b) => b.length - a.length)) {
    if (digits.startsWith(code)) {
      return { code, name: COUNTRY_CODE_MAP[code] };
    }
  }
  return null;
}

function computeSpamRisk(phone: string): number {
  const digits = phone.replace(/[^0-9]/g, '');
  const repeatedPatterns = /(\d)\1{4,}/.test(digits) ? 1 : 0;
  const suspiciousPrefixes = /^(800|900|888|877|866|855|844)/.test(digits) ? 1 : 0;
  const lengthRisk = digits.length < 10 || digits.length > 15 ? 1 : 0;
  return Math.min(100, Math.round((repeatedPatterns + suspiciousPrefixes + lengthRisk) * 33));
}

function computeFraudRisk(valid: boolean, hasCarrier: boolean, countryDetected: boolean): number {
  if (!valid) return 90;
  const base = hasCarrier ? 10 : 30;
  const countryPenalty = countryDetected ? 0 : 20;
  return Math.min(100, base + countryPenalty);
}

function buildPhoneSummary(payload: string, apiResponse?: PhoneApiResponse) {
  const details: string[] = [];
  if (payload) details.push(`Number: ${payload}`);
  if (apiResponse?.carrier) details.push(`Carrier: ${String(apiResponse.carrier)}`);
  if (apiResponse?.country_name) details.push(`Country: ${String(apiResponse.country_name)}`);
  if (apiResponse?.line_type) details.push(`Line type: ${String(apiResponse.line_type)}`);
  return details.join(' • ');
}

async function fetchApiLookup(phone: string): Promise<PhoneApiResponse | null> {
  const baseUrl = import.meta.env.VITE_PHONE_INTEL_BASE_URL as string | undefined;
  const apiKey = import.meta.env.VITE_PHONE_INTEL_API_KEY as string | undefined;

  if (!baseUrl || !apiKey) return null;

  try {
    const url = new URL(baseUrl.replace(/\/+$/, ''));
    url.pathname = `${url.pathname.replace(/\/$/, '')}/lookup`;
    url.searchParams.set('number', phone);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    };

    const response = await fetch(url.toString(), { headers });
    if (!response.ok) return null;
    return (await response.json()) as PhoneApiResponse;
  } catch (error) {
    console.warn('mobileIntel.fetchApiLookup failed', error);
    return null;
  }
}

export async function lookup(payload: string): Promise<IntelligenceResult[]> {
  const out: IntelligenceResult[] = [];
  const phone = normalizeNumber(payload.trim());
  if (!phone) return out;

  const country = detectCountry(phone);
  const valid = /^\+?\d{7,15}$/.test(payload.trim()) || /^\d{7,15}$/.test(phone);
  const apiData = await fetchApiLookup(payload.trim());
  const carrier = apiData?.carrier ? String(apiData.carrier) : 'Unknown';
  const lineType = apiData?.line_type ? String(apiData.line_type) : 'Unknown';
  const spamScore = computeSpamRisk(phone);
  const fraudScore = computeFraudRisk(valid, carrier !== 'Unknown', Boolean(country));
  const score = Math.min(100, Math.round((valid ? 20 : 0) + spamScore * 0.3 + fraudScore * 0.4 + (carrier !== 'Unknown' ? 10 : 0)));

  const intel: IntelligenceResult = {
    id: makeId('mobile'),
    queryId: makeId('q'),
    source: 'mobile',
    title: `Mobile Number Intelligence: ${payload.trim()}`,
    summary: buildPhoneSummary(payload.trim(), apiData),
    score,
    meta: [
      {
        sourceName: 'phone-intel',
        fetchedAt: new Date().toISOString(),
        raw: {
          input: payload.trim(),
          valid,
          formatted: payload.trim().startsWith('+') ? payload.trim() : `+${phone}`,
          countryCode: country?.code,
          countryName: country?.name,
          carrier,
          lineType,
          spamScore,
          fraudScore,
          apiData,
        },
      },
    ],
  };

  out.push(intel);
  return out;
}
