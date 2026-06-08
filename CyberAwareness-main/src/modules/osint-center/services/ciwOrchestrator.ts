import { QueryRequest, OrchestratorResponse, IntelligenceResult } from '../types/ciw.types';
import * as usernameIntel from './usernameIntel';
import * as emailIntel from './emailIntel';
import * as geoIntel from './geoIntel';
import * as ipIntel from './ipIntel';
import * as walletIntel from './walletIntel';
import * as whois from './whois';
import * as mobileIntel from './mobileIntel';
import * as urlIntel from './urlIntel';
import * as reverseImageIntel from './reverseImageIntel';
import scoreIntel from '../utils/riskScoring';
import exportIntelReport from '../utils/exportIntelReport';

async function callServiceForQuery(query: QueryRequest): Promise<IntelligenceResult[]> {
  const tasks: Promise<IntelligenceResult[] | null>[] = [];

  switch (query.source) {
    case 'username':
      tasks.push(usernameIntel.lookup(query.payload));
      break;
    case 'email':
      tasks.push(emailIntel.lookup(query.payload));
      break;
    case 'ip':
      // Run both geoIntel and ipIntel in parallel for IP queries
      // ipIntel is more resilient and provides ASN/reputation data
      tasks.push(geoIntel.lookup(query.payload));
      tasks.push(ipIntel.lookup(query.payload));
      break;
    case 'wallet':
      tasks.push(walletIntel.lookup(query.payload));
      break;
    case 'domain':
      tasks.push(whois.lookup(query.payload));
      break;
    case 'mobile':
      tasks.push(mobileIntel.lookup(query.payload));
      break;
    case 'url':
      tasks.push(urlIntel.lookup(query.payload));
      break;
    case 'reverse-image':
      tasks.push(reverseImageIntel.lookup(query.payload));
      break;
    default:
      return [];
  }

  const settled = await Promise.allSettled(tasks);
  const results: IntelligenceResult[] = [];

  for (const res of settled) {
    if (res.status === 'fulfilled' && Array.isArray(res.value)) {
      for (const r of res.value) {
        const scored = { ...r, score: typeof r.score === 'number' ? r.score : Math.round(scoreIntel(r) * 100) } as IntelligenceResult;
        results.push(scored);
      }
    }
  }

  return results;
}

export async function orchestrate(query: QueryRequest): Promise<OrchestratorResponse> {
  // diagnostic
  // eslint-disable-next-line no-console
  console.debug('[Orchestrator] called with', query);

  const results = await callServiceForQuery(query);

  // diagnostic
  // eslint-disable-next-line no-console
  console.debug('[Orchestrator] results', { count: results.length, ids: results.map((r) => r.id) });

  const aggregatedScore = results.length > 0 ? Math.round(results.reduce((s, r) => s + (r.score ?? 0), 0) / results.length) : 0;
  const warnings: string[] = [];

  if (results.length === 0) warnings.push('No orchestrated services available for this source; consider using scanner UI or configure service APIs');

  return {
    query,
    results,
    aggregatedScore,
    warnings: warnings.length ? warnings : undefined,
  };
}

export async function exportReportForQuery(queryId: string, caseId: string, results: IntelligenceResult[]) {
  return exportIntelReport({ caseId, queryId, results });
}

export default { orchestrate, exportReportForQuery };
