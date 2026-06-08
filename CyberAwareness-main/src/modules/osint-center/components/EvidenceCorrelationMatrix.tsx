/**
 * Evidence Correlation Matrix Component
 * Shows evidence-to-evidence relationships and shared entities
 */

import React, { useMemo } from 'react';
import { AlertTriangle, Zap } from 'lucide-react';
import { extractEntitiesFromEvidence, calculateExtractionSimilarity, ExtractedEntity } from '../services/entityExtraction';
import { useEvidenceStore } from '../store/evidenceStore';

export interface EvidenceCorrelation {
  evidenceId1: string;
  evidenceId2: string;
  title1: string;
  title2: string;
  similarityScore: number;
  sharedEmails: Set<string>;
  sharedDomains: Set<string>;
  sharedWallets: Set<string>;
  sharedIPs: Set<string>;
  sharedUsernames: Set<string>;
  sharedMobiles: Set<string>;
}

function getSharedEntities(entities1: ExtractedEntity[], entities2: ExtractedEntity[], type: string): Set<string> {
  const set1 = new Set(entities1.filter((e) => e.type === type).map((e) => e.value.toLowerCase()));
  const set2 = new Set(entities2.filter((e) => e.type === type).map((e) => e.value.toLowerCase()));
  return new Set([...set1].filter((x) => set2.has(x)));
}

export const EvidenceCorrelationMatrix: React.FC = () => {
  const evidenceItems = useEvidenceStore((s) => s.items);

  const correlations = useMemo(() => {
    const results: EvidenceCorrelation[] = [];

    // Extract entities from all evidence
    const extractions = new Map<
      string,
      {
        title: string;
        entities: ExtractedEntity[];
      }
    >();

    evidenceItems.forEach((item) => {
      const result = extractEntitiesFromEvidence(item.id, item.summary || item.raw, item.title);
      extractions.set(item.id, { title: item.title, entities: result.entities });
    });

    // Compare all pairs
    const ids = Array.from(extractions.keys());
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const id1 = ids[i];
        const id2 = ids[j];
        const ext1 = extractions.get(id1)!;
        const ext2 = extractions.get(id2)!;

        const sharedEmails = getSharedEntities(ext1.entities, ext2.entities, 'email');
        const sharedDomains = getSharedEntities(ext1.entities, ext2.entities, 'domain');
        const sharedWallets = getSharedEntities(ext1.entities, ext2.entities, 'wallet');
        const sharedIPs = getSharedEntities(ext1.entities, ext2.entities, 'ip');
        const sharedUsernames = getSharedEntities(ext1.entities, ext2.entities, 'username');
        const sharedMobiles = getSharedEntities(ext1.entities, ext2.entities, 'mobile');

        const totalShared = sharedEmails.size + sharedDomains.size + sharedWallets.size + sharedIPs.size + sharedUsernames.size + sharedMobiles.size;

        // Only include if there are shared entities
        if (totalShared > 0) {
          results.push({
            evidenceId1: id1,
            evidenceId2: id2,
            title1: ext1.title,
            title2: ext2.title,
            similarityScore: (sharedEmails.size + sharedDomains.size * 1.5 + sharedWallets.size * 2 + sharedIPs.size * 1.5) / Math.max(1, ext1.entities.length + ext2.entities.length),
            sharedEmails,
            sharedDomains,
            sharedWallets,
            sharedIPs,
            sharedUsernames,
            sharedMobiles,
          });
        }
      }
    }

    return results.sort((a, b) => b.similarityScore - a.similarityScore);
  }, [evidenceItems]);

  const getRiskColor = (score: number): string => {
    if (score >= 0.7) return 'bg-red-900/40 border-red-700/60';
    if (score >= 0.4) return 'bg-amber-900/40 border-amber-700/60';
    if (score >= 0.2) return 'bg-yellow-900/40 border-yellow-700/60';
    return 'bg-blue-900/40 border-blue-700/60';
  };

  const getRiskText = (score: number): string => {
    if (score >= 0.7) return 'text-red-300';
    if (score >= 0.4) return 'text-amber-300';
    if (score >= 0.2) return 'text-yellow-300';
    return 'text-blue-300';
  };

  if (correlations.length === 0) {
    return (
      <div className="p-4 rounded-lg border border-slate-700/40 bg-slate-900/40 text-slate-400 text-sm">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle size={14} className="text-slate-500" />
          No correlations detected
        </div>
        <div className="text-xs text-slate-500">Evidence items do not share common entities</div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="text-xs font-semibold text-cyan-300 uppercase tracking-wide">Evidence Correlations</div>

      <div className="space-y-2">
        {correlations.map((correlation) => (
          <div key={`${correlation.evidenceId1}-${correlation.evidenceId2}`} className={`p-3 rounded-lg border transition-all ${getRiskColor(correlation.similarityScore)}`}>
            {/* Header with similarity score */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <div className="text-xs font-mono text-slate-300 truncate">{correlation.title1}</div>
                <div className="text-xs text-slate-500 mt-1">↔</div>
                <div className="text-xs font-mono text-slate-300 truncate">{correlation.title2}</div>
              </div>
              <div className={`text-right ${getRiskText(correlation.similarityScore)} font-semibold text-xs whitespace-nowrap`}>
                <div>{(correlation.similarityScore * 100).toFixed(0)}%</div>
              </div>
            </div>

            {/* Shared entities breakdown */}
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              {correlation.sharedEmails.size > 0 && (
                <div className="bg-slate-800/50 p-1.5 rounded border border-slate-700/50">
                  <div className="text-cyan-400 font-semibold">Email: {correlation.sharedEmails.size}</div>
                  <div className="text-slate-400 truncate">{Array.from(correlation.sharedEmails)[0]}</div>
                </div>
              )}

              {correlation.sharedDomains.size > 0 && (
                <div className="bg-slate-800/50 p-1.5 rounded border border-slate-700/50">
                  <div className="text-emerald-400 font-semibold">Domain: {correlation.sharedDomains.size}</div>
                  <div className="text-slate-400 truncate">{Array.from(correlation.sharedDomains)[0]}</div>
                </div>
              )}

              {correlation.sharedIPs.size > 0 && (
                <div className="bg-slate-800/50 p-1.5 rounded border border-slate-700/50">
                  <div className="text-yellow-400 font-semibold">IP: {correlation.sharedIPs.size}</div>
                  <div className="text-slate-400 truncate font-mono text-[9px]">{Array.from(correlation.sharedIPs)[0]}</div>
                </div>
              )}

              {correlation.sharedWallets.size > 0 && (
                <div className="bg-slate-800/50 p-1.5 rounded border border-slate-700/50">
                  <div className="text-purple-400 font-semibold">Wallet: {correlation.sharedWallets.size}</div>
                  <div className="text-slate-400 truncate font-mono text-[9px]">{String(Array.from(correlation.sharedWallets)[0]).substring(0, 16)}...</div>
                </div>
              )}

              {correlation.sharedUsernames.size > 0 && (
                <div className="bg-slate-800/50 p-1.5 rounded border border-slate-700/50">
                  <div className="text-orange-400 font-semibold">User: {correlation.sharedUsernames.size}</div>
                  <div className="text-slate-400 truncate">{Array.from(correlation.sharedUsernames)[0]}</div>
                </div>
              )}

              {correlation.sharedMobiles.size > 0 && (
                <div className="bg-slate-800/50 p-1.5 rounded border border-slate-700/50">
                  <div className="text-pink-400 font-semibold">Mobile: {correlation.sharedMobiles.size}</div>
                  <div className="text-slate-400 truncate font-mono">{Array.from(correlation.sharedMobiles)[0]}</div>
                </div>
              )}
            </div>

            {/* Correlation interpretation */}
            <div className="mt-2 pt-2 border-t border-slate-700/30 text-[10px] text-slate-400">
              {correlation.sharedWallets.size > 0 && <div className="text-red-300">⚠ Shared cryptocurrency wallets</div>}
              {correlation.sharedDomains.size > 0 && correlation.sharedIPs.size > 0 && <div className="text-amber-300">⚠ Shared infrastructure</div>}
              {correlation.sharedEmails.size > 0 && correlation.sharedUsernames.size > 0 && <div className="text-yellow-300">⚠ Identity link</div>}
              {correlation.sharedMobiles.size > 0 && <div className="text-pink-300">⚠ Shared contact information</div>}
            </div>
          </div>
        ))}
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-2 text-[10px]">
        <div className="p-2 rounded bg-slate-800/40 border border-slate-700/40">
          <div className="text-slate-400">Total Evidence</div>
          <div className="text-cyan-300 font-semibold text-sm">{evidenceItems.length}</div>
        </div>
        <div className="p-2 rounded bg-slate-800/40 border border-slate-700/40">
          <div className="text-slate-400">Correlations</div>
          <div className="text-emerald-300 font-semibold text-sm">{correlations.length}</div>
        </div>
      </div>
    </div>
  );
};

export default EvidenceCorrelationMatrix;
