export interface OsintModule {
  id: string;
  title: string;
  description: string;
  icon: string;
  status: 'active' | 'coming-soon' | 'disabled';
}

export interface IpIntelResult {
  ip: string;
  country?: string;
  countryCode?: string;
  isp?: string;
  abuseScore?: number;
  reportsCount?: number;
  lastReportedAt?: string;
}

export interface UrlIntelResult {
  url: string;
  detectionCount: number;
  reputation: number;
  threatClassification?: string[];
  scanStatus?: string;
}

export interface MobileIntelResult {
  phoneNumber: string;
  valid: boolean;
  formatted?: string;
  countryName?: string;
  countryCode?: string;
  carrier?: string;
  lineType?: string;
  spamScore?: number;
  fraudScore?: number;
  riskLevel?: 'Low' | 'Medium' | 'High';
}

export interface DomainIntelResult {
  domain: string;
  registrar?: string;
  nameservers?: string[];
  dnsRecords?: Record<string, unknown[]>;
  sslInfo?: Record<string, unknown>;
  domainAgeDays?: number;
  riskScore?: number;
}

export interface BreachItem {
  name: string;
  domain?: string;
  breachDate?: string;
}

export interface EmailIntelResult {
  email: string;
  breachCount: number;
  breaches: BreachItem[];
  riskLevel?: "Low" | "Medium" | "High";
}