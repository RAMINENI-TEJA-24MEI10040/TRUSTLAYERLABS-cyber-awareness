/* Lightweight AbuseIPDB client service (TypeScript)
   - Uses fetch to call AbuseIPDB API
   - Reads API key from process.env.ABUSEIPDB_API_KEY or provided options
   - Exports reusable async functions and TS interfaces
*/

type HttpMethod = 'GET' | 'POST'

const DEFAULT_BASE = 'https://api.abuseipdb.com/api/v2'

export interface AbuseIPDBOptions {
  apiKey?: string
  baseUrl?: string
  timeout?: number
}

export interface AbuseReportScore {
  ipAddress: string
  isWhitelisted?: boolean
  abuseConfidenceScore: number
  countryCode?: string
  usageType?: string
  isp?: string
  domain?: string
  lastReportedAt?: string
}

export interface AbuseIPDBError {
  message: string
  status?: number
}

async function request<T>(path: string, method: HttpMethod = 'GET', options: AbuseIPDBOptions = {}, params?: Record<string, string | number | boolean>): Promise<T> {
  const envKey =
    import.meta.env.VITE_ABUSEIPDB_KEY ||
    (typeof globalThis !== 'undefined' && (globalThis as { process?: { env?: Record<string, string> } }).process
      ?.env?.ABUSEIPDB_API_KEY)
  const apiKey = options.apiKey || envKey
  if (!apiKey) throw { message: 'AbuseIPDB API key missing. Set VITE_ABUSEIPDB_KEY' } as AbuseIPDBError

  const base = options.baseUrl || DEFAULT_BASE
  const url = new URL(base + path)
  if (params && method === 'GET') {
    Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, String(v)))
  }

  const res = await fetch(url.toString(), {
    method,
    headers: {
      'Accept': 'application/json',
      'Key': apiKey,
      'Content-Type': 'application/json'
    },
    body: method === 'POST' && params ? JSON.stringify(params) : undefined
  })

  const text = await res.text()
  const contentType = res.headers.get('content-type') || ''
  let payload: any = text
  try {
    if (contentType.includes('application/json')) payload = JSON.parse(text)
  } catch {
    /* keep raw text payload */
  }

  if (!res.ok) {
    const err: AbuseIPDBError = { message: payload?.errors?.[0]?.detail || payload?.message || String(payload), status: res.status }
    throw err
  }

  return payload as T
}

export async function checkIP(ip: string, options: AbuseIPDBOptions = {}): Promise<AbuseReportScore> {
  if (!ip) throw { message: 'IP is required' } as AbuseIPDBError
  const data = await request<{ data: any }>(`/check`, 'GET', options, { ipAddress: ip, maxAgeInDays: 90 })
  const d = data.data
  return {
    ipAddress: d.ipAddress,
    isWhitelisted: d.isWhitelisted,
    abuseConfidenceScore: d.abuseConfidenceScore,
    countryCode: d.countryCode,
    usageType: d.usageType,
    isp: d.isp,
    domain: d.domain,
    lastReportedAt: d.lastReportedAt
  }
}

export async function checkIPs(ips: string[], options: AbuseIPDBOptions = {}): Promise<Record<string, AbuseReportScore>> {
  if (!Array.isArray(ips) || ips.length === 0) throw { message: 'ips array is required' } as AbuseIPDBError
  const list = ips.join(',')
  const data = await request<{ data: any[] }>(`/check`, 'GET', options, { ipAddress: list, maxAgeInDays: 90 })
  const out: Record<string, AbuseReportScore> = {}
  const items = Array.isArray(data.data) ? data.data : [data.data]
  items.forEach(d => {
    out[d.ipAddress] = {
      ipAddress: d.ipAddress,
      isWhitelisted: d.isWhitelisted,
      abuseConfidenceScore: d.abuseConfidenceScore,
      countryCode: d.countryCode,
      usageType: d.usageType,
      isp: d.isp,
      domain: d.domain,
      lastReportedAt: d.lastReportedAt
    }
  })
  return out
}

export default { checkIP, checkIPs }
