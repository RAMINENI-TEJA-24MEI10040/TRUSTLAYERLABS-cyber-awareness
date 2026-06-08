import { IntelligenceResult } from '../types/ciw.types';
import scoreIntel from '../utils/riskScoring';
import { WalletProviderManager, WalletLookupResult } from '../types/wallet.types';

const providerManager = new WalletProviderManager();

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function isEthereumAddress(addr: string) {
  return /^0x[a-fA-F0-9]{40}$/.test(addr.trim());
}

function isBitcoinAddress(addr: string) {
  // very loose bitcoin address detection (starts with 1,3 or bc1)
  const a = addr.trim();
  return /^(1|3|bc1)[a-zA-Z0-9]{25,60}$/.test(a);
}

export async function lookup(payload: string): Promise<IntelligenceResult[]> {
  const out: IntelligenceResult[] = [];
  if (!payload) return out;

  const p = payload.trim();
  try {
    // Basic detection by pattern
    let chain: 'ethereum' | 'bitcoin' | 'polygon' | null = null;
    if (isEthereumAddress(p)) chain = 'ethereum';
    else if (isBitcoinAddress(p)) chain = 'bitcoin';
    else if (/^0x[a-fA-F0-9]{40}$/.test(p)) chain = 'ethereum'; // fallback

    if (!chain) {
      // unsupported/unknown
      return out;
    }

    // Ask provider manager to lookup address for detected chain
    const providerResult: WalletLookupResult | null = await providerManager.lookup(chain, p);

    if (!providerResult) {
      // Provider not configured or no data — return minimal detection
      const intel: IntelligenceResult = {
        id: makeId('wallet'),
        queryId: makeId('q'),
        source: 'wallet',
        title: `${chain.toUpperCase()} address detected`,
        summary: `Address: ${p} — no provider configured or data unavailable`,
        score: 0,
        meta: [
          { sourceName: 'local-detect', fetchedAt: new Date().toISOString(), raw: { address: p, chain } },
        ],
      };
      out.push(intel);
      return out;
    }

    const meta = [
      {
        sourceName: providerResult.providerName,
        fetchedAt: new Date().toISOString(),
        raw: providerResult.raw,
      },
    ];

    const intel: IntelligenceResult = {
      id: makeId('wallet'),
      queryId: makeId('q'),
      source: 'wallet',
      title: `${providerResult.chain.toUpperCase()} address analysis`,
      summary: `TxCount: ${providerResult.txCount ?? 'N/A'} • Balance: ${providerResult.balance ?? 'N/A'}`,
      meta,
    };

    // integrate with riskScoring — compute normalized score (0-100)
    try {
      const normalized = Math.round(scoreIntel(intel) * 100);
      intel.score = normalized;
    } catch (e) {
      intel.score = 0;
    }

    // attach structured provider info in meta[0].raw already
    out.push(intel);
  } catch (error) {
    console.error('walletIntel.lookup error', error);
  }

  return out;
}

export default { lookup };
