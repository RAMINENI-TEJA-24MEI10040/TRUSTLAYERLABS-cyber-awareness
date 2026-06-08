import create from 'zustand';
import abuseipdb from '../../../services/abuseipdb';
import { scanUrl } from '../../../services/virustotal';
import hibpService from '../../../services/hibp';

interface IpIntelResult {
  ip: string;
  country?: string;
  isp?: string;
  abuseScore?: number;
  reportsCount?: number;
}

interface UrlIntelResult {
  url: string;
  detectionCount: number;
  reputation: number;
}

interface EmailIntelResult {
  email: string;
  breachCount: number;
  breaches: { name: string; breachDate?: string }[];
  riskLevel?: 'Low' | 'Medium' | 'High';
}

interface OsintState {
  ipResult: IpIntelResult | null;
  urlResult: UrlIntelResult | null;
  emailResult: EmailIntelResult | null;
  loading: boolean;
  error: string | null;
  fetchIp: (ip: string) => Promise<void>;
  fetchUrl: (url: string) => Promise<void>;
  fetchEmail: (email: string) => Promise<void>;
}

export const useOsintStoreNew = create<OsintState>((set) => ({
  ipResult: null,
  urlResult: null,
  emailResult: null,
  loading: false,
  error: null,

  fetchIp: async (ip: string) => {
    set({ loading: true, error: null });
    try {
      const data = await abuseipdb.checkIP(ip);
      set({ ipResult: { ip: data.ipAddress, country: data.countryCode, isp: data.isp, abuseScore: data.abuseConfidenceScore, reportsCount: 0 }, loading: false });
    } catch (err: any) {
      set({ error: err?.message || String(err), loading: false });
    }
  },

  fetchUrl: async (url: string) => {
    set({ loading: true, error: null });
    try {
      const res = await scanUrl(url);
      const detectionCount = (res.malicious || 0) + (res.suspicious || 0);
      set({ urlResult: { url, detectionCount, reputation: res.reputation || 0 }, loading: false });
    } catch (err: any) {
      set({ error: err?.message || String(err), loading: false });
    }
  },

  fetchEmail: async (email: string) => {
    set({ loading: true, error: null });
    try {
      const res = await hibpService.checkEmailBreach(email);
      const items = (res.breaches || []).map((b) => ({ name: b.Name, breachDate: b.BreachDate }));
      const riskLevel = items.length === 0 ? 'Low' : items.length < 3 ? 'Medium' : 'High';
      set({ emailResult: { email: res.email, breachCount: res.breachCount || items.length, breaches: items, riskLevel }, loading: false });
    } catch (err: any) {
      set({ error: err?.message || String(err), loading: false });
    }
  },
}));
