export type SupportedChain = 'ethereum' | 'bitcoin' | 'polygon';

export interface WalletLookupResult {
  providerName: string;
  chain: SupportedChain;
  address: string;
  txCount?: number;
  balance?: string; // human readable (e.g., '0.123 ETH' or satoshis)
  firstSeen?: string; // ISO
  lastActivity?: string; // ISO
  riskIndicators?: string[];
  raw?: unknown;
}

export interface WalletProvider {
  name: string;
  supports: SupportedChain[];
  lookupAddress(chain: SupportedChain, address: string): Promise<WalletLookupResult | null>;
}

export class WalletProviderManager {
  private providers: WalletProvider[] = [];

  constructor() {
    // lazy-load providers to avoid runtime errors when env missing
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { etherscanProvider } = require('../services/walletProviders');
      if (etherscanProvider) this.providers.push(etherscanProvider);
    } catch {}
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { blockchairProvider } = require('../services/walletProviders');
      if (blockchairProvider) this.providers.push(blockchairProvider);
    } catch {}
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { blockcypherProvider } = require('../services/walletProviders');
      if (blockcypherProvider) this.providers.push(blockcypherProvider);
    } catch {}
  }

  async lookup(chain: SupportedChain, address: string): Promise<WalletLookupResult | null> {
    for (const p of this.providers) {
      if (p.supports.includes(chain)) {
        try {
          const res = await p.lookupAddress(chain, address);
          if (res) return res;
        } catch (e) {
          // continue to next provider
          // eslint-disable-next-line no-console
          console.warn(`WalletProvider ${p.name} failed:`, e);
        }
      }
    }
    return null;
  }
}
