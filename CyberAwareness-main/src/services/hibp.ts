const HIBP_API_BASE = 'https://haveibeenpwned.com/api/v3';
const API_KEY: string | undefined =
  import.meta.env.VITE_HIBP_API_KEY ||
  (typeof process !== 'undefined' && typeof process.env !== 'undefined'
    ? process.env.HIBP_API_KEY
    : undefined);
const USER_AGENT = 'TrustLayerLabs-CyberAwareness';

interface BreachData {
  Name: string;
  Title: string;
  Domain: string;
  BreachDate: string;
  AddedDate: string;
  PwnCount: number;
  Description: string;
  DataClasses: string[];
  IsVerified: boolean;
  IsFabricated: boolean;
  IsSensitive: boolean;
  IsRetired: boolean;
  IsSpamList: boolean;
  LogoPath: string;
}

interface BreachResponse {
  breaches: BreachData[];
  email: string;
  breachCount: number;
}

interface PasteData {
  Source: string;
  Id: string;
  Title: string;
  Date: string;
  EmailCount: number;
}

interface ErrorResponse {
  error: string;
  code: number;
}

class HIBPService {
  private apiKey: string | undefined;
  private readonly apiBase: string;
  private readonly userAgent: string;

  constructor() {
    this.apiKey = API_KEY;
    this.apiBase = HIBP_API_BASE;
    this.userAgent = USER_AGENT;

    if (!this.apiKey) {
      console.warn('HIBP API key not set (VITE_HIBP_API_KEY)');
    }
  }

  async checkEmailBreach(email: string): Promise<BreachResponse> {
    try {
      if (!email || !email.includes('@')) {
        throw new Error('Invalid email format');
      }

      const encodedEmail = encodeURIComponent(email);
      const url = `${this.apiBase}/breachedaccount/${encodedEmail}`;

      const res = await fetch(url, { headers: this.getHeaders() });
      if (res.status === 404) {
        return { breaches: [], email, breachCount: 0 };
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as BreachData[];

      return {
        breaches: data || [],
        email,
        breachCount: data?.length || 0,
      };
    } catch (error) {
      return this.handleError(error, email);
    }
  }

  async checkPastes(email: string): Promise<PasteData[]> {
    try {
      if (!email || !email.includes('@')) {
        throw new Error('Invalid email format');
      }

      const encodedEmail = encodeURIComponent(email);
      const url = `${this.apiBase}/pasteaccount/${encodedEmail}`;

      const res = await fetch(url, { headers: this.getHeaders() });
      if (res.status === 404) return [];
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as PasteData[];
      return data || [];
    } catch (error) {
      if (error instanceof Error && /404/.test(String(error.message))) return [];
      throw error;
    }
  }

  async checkPassword(password: string): Promise<number> {
    try {
      if (!password || password.length < 1) {
        throw new Error('Invalid password');
      }

      const sha1Password = (await this.sha1(password)).toUpperCase();
      const prefix = sha1Password.substring(0, 5);
      const suffix = sha1Password.substring(5);

      const url = `${this.apiBase}/range/${prefix}`;

      const res = await fetch(url, { headers: this.getHeaders() });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();

      const hashes = text.split('\r\n');
      for (const hash of hashes) {
        const [hashSuffix, count] = hash.split(':');
        if (hashSuffix === suffix) {
          return parseInt(count, 10);
        }
      }

      return 0;
    } catch (error) {
      console.error('Password check error:', error);
      throw error;
    }
  }

  private getHeaders() {
    const headers: Record<string, string> = {
      'User-Agent': this.userAgent,
      Accept: 'application/json',
    };

    if (this.apiKey) {
      headers['User-Agent'] = `${this.userAgent} (API Key: ${this.apiKey})`;
    }

    return headers;
  }

  private async sha1(str: string): Promise<string> {
    if (typeof globalThis !== 'undefined' && 'crypto' in globalThis && 'subtle' in (globalThis as any).crypto) {
      const enc = new TextEncoder();
      const data = enc.encode(str);
      const hashBuffer = await (globalThis as any).crypto.subtle.digest('SHA-1', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    }
    // Fallback: simple JS SHA1 using a lightweight implementation (kept minimal)
    const utf8 = unescape(encodeURIComponent(str));
    let h0 = 0x67452301, h1 = 0xefcdab89, h2 = 0x98badcfe, h3 = 0x10325476, h4 = 0xc3d2e1f0;
    const bytes: number[] = [];
    for (let i = 0; i < utf8.length; i++) bytes.push(utf8.charCodeAt(i));
    bytes.push(0x80);
    while ((bytes.length % 64) !== 56) bytes.push(0);
    const len = str.length * 8;
    for (let i = 7; i >= 0; i--) bytes.push((len >>> (i * 8)) & 0xff);
    const words = [] as number[];
    for (let i = 0; i < bytes.length; i += 4) words.push((bytes[i] << 24) | (bytes[i + 1] << 16) | (bytes[i + 2] << 8) | (bytes[i + 3]));
    for (let i = 0; i < words.length; i += 16) {
      let a = h0, b = h1, c = h2, d = h3, e = h4;
      const w = words.slice(i, i + 16);
      for (let t = 16; t < 80; t++) w[t] = this.leftRotate((w[t - 3] ^ w[t - 8] ^ w[t - 14] ^ w[t - 16]), 1);
      for (let t = 0; t < 80; t++) {
        let temp = (this.leftRotate(a, 5) + e + w[t] + this.k(t)) | 0;
        if (t < 20) temp += ((b & c) | (~b & d));
        else if (t < 40) temp += (b ^ c ^ d);
        else if (t < 60) temp += ((b & c) | (b & d) | (c & d));
        else temp += (b ^ c ^ d);
        e = d; d = c; c = this.leftRotate(b, 30) | 0; b = a; a = temp | 0;
      }
      h0 = (h0 + a) | 0; h1 = (h1 + b) | 0; h2 = (h2 + c) | 0; h3 = (h3 + d) | 0; h4 = (h4 + e) | 0;
    }
    const hex = [h0, h1, h2, h3, h4].map(h => ('00000000' + (h >>> 0).toString(16)).slice(-8)).join('');
    return hex;
  }

  private leftRotate(n: number, bits: number) { return (n << bits) | (n >>> (32 - bits)); }
  private k(t: number) { return t < 20 ? 0x5a827999 : t < 40 ? 0x6ed9eba1 : t < 60 ? 0x8f1bbcdc : 0xca62c1d6; }

  private handleError(error: unknown, email: string): BreachResponse {
    if (error instanceof Error && /404/.test(error.message)) {
      return { breaches: [], email, breachCount: 0 };
    }

    if (error instanceof Error && /429/.test(error.message)) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    if (error instanceof Error && /401/.test(error.message)) {
      throw new Error('Unauthorized. Invalid API key.');
    }

    throw error;
  }
}

export const hibpService = new HIBPService();
export type { BreachData, BreachResponse, PasteData, ErrorResponse };
export default hibpService;
