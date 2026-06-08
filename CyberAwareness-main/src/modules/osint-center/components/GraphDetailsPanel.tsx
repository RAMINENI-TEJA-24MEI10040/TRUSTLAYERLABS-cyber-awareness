import React from 'react';
import { X, ExternalLink, Copy, CheckCircle, AlertTriangle } from 'lucide-react';
import type { EntityNode, EntityRelationship } from '../types/ciw.types';

interface GraphDetailsPanelProps {
  node: EntityNode | null;
  linkedEdges: EntityRelationship[];
  linkedNodes: EntityNode[];
  onClose: () => void;
  onNodeClick?: (nodeId: string) => void;
}

const GraphDetailsPanel: React.FC<GraphDetailsPanelProps> = ({
  node,
  linkedEdges,
  linkedNodes,
  onClose,
  onNodeClick,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  if (!node) {
    return null;
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(node.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const riskScore = typeof node.metadata?.score === 'number' ? node.metadata.score : 0;
  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-red-400';
    if (score >= 40) return 'text-amber-400';
    return 'text-green-400';
  };

  const getRiskBg = (score: number) => {
    if (score >= 70) return 'bg-red-950/40 border-red-700/60';
    if (score >= 40) return 'bg-amber-950/40 border-amber-700/60';
    return 'bg-emerald-950/40 border-emerald-700/60';
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-end">
      <div className="w-full max-w-md h-[calc(100%-2rem)] bg-slate-950/95 border border-cyan-700/60 rounded-t-2xl shadow-2xl shadow-cyan-900/40 flex flex-col overflow-hidden m-2">
        <div className="flex items-center justify-between border-b border-cyan-700/40 p-4">
          <div>
            <h3 className="text-lg font-semibold text-cyan-100">{node.label}</h3>
            <p className="text-xs text-slate-400 uppercase tracking-wide mt-1">{node.type}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-cyan-300" type="button">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 p-4">
          {riskScore > 0 && (
            <div className={`p-3 rounded-lg border ${getRiskBg(riskScore)} space-y-2`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">Risk Score</span>
                <span className={`text-lg font-bold ${getRiskColor(riskScore)}`}>{riskScore}%</span>
              </div>
              <div className="w-full bg-slate-800/60 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    riskScore >= 70
                      ? 'bg-red-500'
                      : riskScore >= 40
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                  }`}
                  style={{ width: `${riskScore}%` }}
                />
              </div>
            </div>
          )}

          {node.metadata?.summary && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-cyan-300 uppercase tracking-wide">Summary</label>
              <p className="text-sm text-cyan-100/80 leading-relaxed">{node.metadata.summary}</p>
            </div>
          )}

          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/40 border border-cyan-700/30">
            <span className="text-xs text-slate-400">{node.id}</span>
            <button
              onClick={() => handleCopy(node.id)}
              className="text-slate-400 hover:text-cyan-300 transition-colors"
              type="button"
            >
              {copiedId === node.id ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>

          {node.metadata?.meta && Array.isArray(node.metadata.meta) && node.metadata.meta.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-cyan-300 uppercase tracking-wide">Evidence ({node.metadata.meta.length})</label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {node.metadata.meta.map((meta: any, idx: number) => (
                  <div key={idx} className="p-2 rounded bg-slate-900/40 border border-cyan-700/30 text-xs">
                    <div className="font-semibold text-cyan-200">{meta.sourceName}</div>
                    {meta.timestamp && <div className="text-slate-400">{new Date(meta.timestamp).toLocaleString()}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {linkedNodes.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-cyan-300 uppercase tracking-wide">
                Linked Entities ({linkedNodes.length})
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {linkedNodes.map((linkedNode) => {
                  const edge = linkedEdges.find(
                    (e) =>
                      (e.source === node.id && e.target === linkedNode.id) ||
                      (e.source === linkedNode.id && e.target === node.id)
                  );
                  return (
                    <button
                      key={linkedNode.id}
                      onClick={() => onNodeClick?.(linkedNode.id)}
                      className="w-full text-left p-2 rounded bg-slate-900/40 border border-cyan-700/30 hover:border-cyan-600 hover:bg-slate-900/60 transition-all group"
                      type="button"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-cyan-200 truncate">{linkedNode.label}</div>
                          <div className="text-xs text-slate-400">{linkedNode.type}</div>
                          {edge && <div className="text-xs text-cyan-400/70 mt-1 uppercase tracking-wide">{edge.relationship}</div>}
                        </div>
                        <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-cyan-300 flex-shrink-0 mt-1" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {linkedNodes.length === 0 && (
            <div className="flex items-center justify-center py-8 text-slate-500">
              <AlertTriangle className="w-4 h-4 mr-2" />
              <span className="text-xs">No linked entities</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(GraphDetailsPanel);
