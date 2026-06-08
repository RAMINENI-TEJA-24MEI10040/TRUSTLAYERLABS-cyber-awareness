import type { WalletProvider, WalletLookupResult, SupportedChain } from '../types/wallet.types';

const ETHERSCAN_KEY = import.meta.env.VITE_ETHERSCAN_API_KEY as string | undefined;
const POLYGONSCAN_KEY = import.meta.env.VITE_POLYGONSCAN_API_KEY as string | undefined;
const BLOCKCHAIR_KEY = import.meta.env.VITE_BLOCKCHAIR_API_KEY as string | undefined;
const BLOCKCYPHER_KEY = import.meta.env.VITE_BLOCKCYPHER_API_KEY as string | undefined;

// Helper: safe fetch with timeout
async function safeFetch(url: string, options?: RequestInit, timeout = 10000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { ...(options || {}), signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

export const etherscanProvider: WalletProvider | null = (function create() {
  if (!ETHERSCAN_KEY && !POLYGONSCAN_KEY) return null;

  const name = 'etherscan';

  async function lookupAddress(chain: SupportedChain, address: string) {
    // choose endpoint and key per chain
    let base = '';
    let key = '';
    if (chain === 'ethereum') {
      base = 'https://api.etherscan.io/api';
      key = ETHERSCAN_KEY || '';
    } else if (chain === 'polygon') {
      base = 'https://api.polygonscan.com/api';
      key = POLYGONSCAN_KEY || '';
    } else {
      return null;
    }

    try {
      // fetch txlist to get first/last/txcount
      const url = `${base}?module=account&action=txlist&address=${encodeURIComponent(address)}&startblock=0&endblock=99999999&sort=asc&apikey=${encodeURIComponent(key)}`;
      const res = await safeFetch(url, undefined, 10000);
      if (!res.ok) return null;
      const data = await res.json();
      const txs: any[] = Array.isArray(data.result) ? data.result : [];
      const txCount = txs.length;
      const firstSeen = txs[0]?.timeStamp ? new Date(Number(txs[0].timeStamp) * 1000).toISOString() : undefined;
      const lastActivity = txs[txs.length - 1]?.timeStamp ? new Date(Number(txs[txs.length - 1].timeStamp) * 1000).toISOString() : undefined;

      // balance
      const balUrl = `${base}?module=account&action=balance&address=${encodeURIComponent(address)}&tag=latest&apikey=${encodeURIComponent(key)}`;
      const balRes = await safeFetch(balUrl, undefined, 8000);
      const balData = await balRes.json();
      const balanceWei = balData?.result ?? null;
      const balance = balanceWei ? `${(Number(balanceWei) / 1e18).toString()} ${chain === 'polygon' ? 'MATIC' : 'ETH'}` : undefined;

      const out: WalletLookupResult = {
        providerName: name,
        chain,
        address,
        txCount,
        balance,
        firstSeen,
        lastActivity,
        riskIndicators: [],
        raw: data,
      };
      return out;
    } catch (e) {
      // console.warn
      return null;
    }
  }

  return { name, supports: ['ethereum', 'polygon'], lookupAddress } as WalletProvider;
})();

export const blockchairProvider: WalletProvider | null = (function create() {
  if (!BLOCKCHAIR_KEY) return null;
  const name = 'blockchair';

  async function lookupAddress(chain: SupportedChain, address: string) {
    // blockchair supports multiple chains via path: /{chain}/dashboards/address/{address}
    const chainPath = chain === 'bitcoin' ? 'bitcoin' : chain === 'ethereum' ? 'ethereum' : chain === 'polygon' ? 'ethereum' : 'bitcoin';
    const url = `https://api.blockchair.com/${chainPath}/dashboards/address/${encodeURIComponent(address)}?key=${encodeURIComponent(BLOCKCHAIR_KEY)}`;
    try {
      const res = await safeFetch(url, undefined, 10000);
      if (!res.ok) return null;
      const data = await res.json();
      const dashboard = data?.data?.[address] || data?.data || null;
      if (!dashboard) return null;

      const txCount = dashboard?.transactions || dashboard?.transaction_count || undefined;
      const balance = dashboard?.address?.balance !== undefined ? String(dashboard.address.balance) : undefined;

      const out: WalletLookupResult = {
        providerName: name,
        chain,
        address,
        txCount,
        balance,
        firstSeen: undefined,
        lastActivity: undefined,
        riskIndicators: [],
        raw: dashboard,
      };
      return out;
    } catch (e) {
      return null;
    }
  }

  return { name, supports: ['bitcoin', 'ethereum', 'polygon'], lookupAddress } as WalletProvider;
})();

export const blockcypherProvider: WalletProvider | null = (function create() {
  if (!BLOCKCYPHER_KEY) return null;
  const name = 'blockcypher';

  async function lookupAddress(chain: SupportedChain, address: string) {
    // blockcypher uses different base paths
    let base = '';
    if (chain === 'bitcoin') base = 'https://api.blockcypher.com/v1/btc/main';
    else return null;

    const url = `${base}/addrs/${encodeURIComponent(address)}/full?token=${encodeURIComponent(BLOCKCYPHER_KEY)}`;
    try {
      const res = await safeFetch(url, undefined, 10000);
      if (!res.ok) return null;
      const data = await res.json();
      const txCount = data?.txs?.length ?? data?.n_tx ?? undefined;
      const balance = data?.balance !== undefined ? String(data.balance) : undefined;
      const firstSeen = data?.txs && data.txs.length ? new Date((data.txs[0]?.received ? Date.parse(data.txs[0].received) : Date.now())).toISOString() : undefined;
      const lastActivity = data?.txs && data.txs.length ? new Date((data.txs[data.txs.length - 1]?.received ? Date.parse(data.txs[data.txs.length - 1].received) : Date.now())).toISOString() : undefined;

      const out: WalletLookupResult = {
        providerName: name,
        chain,
        address,
        txCount,
        balance,
        firstSeen,
        lastActivity,
        riskIndicators: [],
        raw: data,
      };
      return out;
    } catch (e) {
      return null;
    }
  }

  return { name, supports: ['bitcoin'], lookupAddress } as WalletProvider;
})();

export default { etherscanProvider, blockchairProvider, blockcypherProvider };
