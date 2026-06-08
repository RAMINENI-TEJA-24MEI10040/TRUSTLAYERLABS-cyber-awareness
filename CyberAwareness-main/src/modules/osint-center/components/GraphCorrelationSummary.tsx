import React, { useMemo } from 'react';
import { AlertTriangle, Activity, Shield, Zap, Lock } from 'lucide-react';
import useCIWStore from '../store/ciwStore';
import type { GraphDocument } from '../types/ciw.types';
import { detectClusters } from '../services/clusterDetection';

interface GraphCorrelationSummaryProps {
  graph: GraphDocument;
}

export default function GraphCorrelationSummary({ graph }: GraphCorrelationSummaryProps) {
  const activeCaseId = useCIWStore((state) => state.activeCaseId);

  // Get timeline store - access via require to avoid circular imports
  const timelineEvents = useMemo(() => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const timelineStore = require('../store/timelineStore').default;
      const state = timelineStore.getState();
      return state.events?.filter((e: any) => e.caseId === activeCaseId) || [];
    } catch {
      return [];
    }
  }, [activeCaseId]);

  // Get evidence store
  const evidenceItems = useMemo(() => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const evidenceStore = require('../store/evidenceStore').default;
      const state = evidenceStore.getState();
      return state.evidence?.filter((e: any) => e.caseId === activeCaseId) || [];
    } catch {
      return [];
    }
  }, [activeCaseId]);

  // Find most connected entity
  const mostConnected = useMemo(() => {
    if (graph.nodes.length === 0) return null;

    const connectionCounts = new Map<string, number>();
    for (const edge of graph.edges) {
      connectionCounts.set(edge.source, (connectionCounts.get(edge.source) || 0) + 1);
      connectionCounts.set(edge.target, (connectionCounts.get(edge.target) || 0) + 1);
    }

    let maxId = graph.nodes[0].id;
    let maxCount = 0;

    for (const [nodeId, count] of connectionCounts) {
      if (count > maxCount) {
        maxCount = count;
        maxId = nodeId;
      }
    }

    return graph.nodes.find((n) => n.id === maxId) || null;
  }, [graph]);

  // Find highest risk entity
  const highestRisk = useMemo(() => {
    if (graph.nodes.length === 0) return null;

    return graph.nodes.reduce((max, node) => {
      const currentScore = typeof node.metadata?.score === 'number' ? node.metadata.score : 0;
      const maxScore = typeof max.metadata?.score === 'number' ? max.metadata.score : 0;
      return currentScore > maxScore ? node : max;
    });
  }, [graph]);

  // Find most active timeline entity
  const mostActiveTimeline = useMemo(() => {
    if (timelineEvents.length === 0 || graph.nodes.length === 0) return null;

    const eventCounts = new Map<string, number>();

    for (const event of timelineEvents) {
      if (event.entityId) {
        eventCounts.set(event.entityId, (eventCounts.get(event.entityId) || 0) + 1);
      }
    }

    let maxNodeId = null;
    let maxCount = 0;

    for (const node of graph.nodes) {
      const count = eventCounts.get(node.id) || 0;
      if (count > maxCount) {
        maxCount = count;
        maxNodeId = node.id;
      }
    }

    return maxNodeId ? graph.nodes.find((n) => n.id === maxNodeId) || null : null;
  }, [graph, timelineEvents]);

  // Find most supported evidence entity
  const mostSupported = useMemo(() => {
    if (evidenceItems.length === 0 || graph.nodes.length === 0) return null;

    const evidenceCounts = new Map<string, number>();

    for (const evidence of evidenceItems) {
      if (evidence.linkedEntityIds && Array.isArray(evidence.linkedEntityIds)) {
        for (const entityId of evidence.linkedEntityIds) {
          evidenceCounts.set(entityId, (evidenceCounts.get(entityId) || 0) + 1);
        }
      }
    }

    let maxNodeId = null;
    let maxCount = 0;

    for (const node of graph.nodes) {
      const count = evidenceCounts.get(node.id) || 0;
      if (count > maxCount) {
        maxCount = count;
        maxNodeId = node.id;
      }
    }

    return maxNodeId ? graph.nodes.find((n) => n.id === maxNodeId) || null : null;
  }, [graph, evidenceItems]);

  // Detect clusters
  const detectedClusters = useMemo(() => {
    return detectClusters(graph);
  }, [graph]);

  const riskColors = {
    critical: 'text-red-400 bg-red-950/40',
    high: 'text-amber-400 bg-amber-950/40',
    medium: 'text-yellow-400 bg-yellow-950/40',
    low: 'text-green-400 bg-green-950/40',
  };

  return (
    <div className="space-y-4">
      {/* Most Connected */}
      {mostConnected && (
        <div className="p-3 rounded-lg border border-cyan-700/40 bg-slate-900/40 space-y-2">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-semibold text-cyan-300 uppercase">Most Connected</span>
          </div>
          <div className="text-sm text-cyan-100 font-medium truncate">{mostConnected.label}</div>
          <div className="text-xs text-slate-400">{mostConnected.type}</div>
        </div>
      )}

      {/* Highest Risk */}
      {highestRisk && (
        <div className="p-3 rounded-lg border border-red-700/40 bg-red-950/20 space-y-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-xs font-semibold text-red-300 uppercase">Highest Risk</span>
          </div>
          <div className="text-sm text-red-100 font-medium truncate">{highestRisk.label}</div>
          {typeof highestRisk.metadata?.score === 'number' && (
            <div className="text-xs text-red-300">
              Risk: {highestRisk.metadata.score}%
            </div>
          )}
        </div>
      )}

      {/* Most Active Timeline */}
      {mostActiveTimeline && (
        <div className="p-3 rounded-lg border border-amber-700/40 bg-amber-950/20 space-y-2">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold text-amber-300 uppercase">Most Active</span>
          </div>
          <div className="text-sm text-amber-100 font-medium truncate">
            {mostActiveTimeline.label}
          </div>
          <div className="text-xs text-amber-300">
            {timelineEvents.filter((e: any) => e.entityId === mostActiveTimeline.id).length} events
          </div>
        </div>
      )}

      {/* Most Supported */}
      {mostSupported && (
        <div className="p-3 rounded-lg border border-emerald-700/40 bg-emerald-950/20 space-y-2">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-300 uppercase">Most Supported</span>
          </div>
          <div className="text-sm text-emerald-100 font-medium truncate">
            {mostSupported.label}
          </div>
          <div className="text-xs text-emerald-300">
            {
              evidenceItems.filter((e: any) =>
                e.linkedEntityIds?.includes(mostSupported.id)
              ).length
            } evidence items
          </div>
        </div>
      )}

      {/* Detected Clusters */}
      {detectedClusters.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-3 py-2">
            <Lock className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-semibold text-cyan-300 uppercase">
              Detected Clusters ({detectedClusters.length})
            </span>
          </div>

          {detectedClusters.slice(0, 3).map((cluster) => (
            <div
              key={cluster.id}
              className={`p-2 rounded-lg border text-xs space-y-1 ${
                cluster.risk === 'critical'
                  ? 'border-red-700/60 bg-red-950/30'
                  : cluster.risk === 'high'
                    ? 'border-amber-700/60 bg-amber-950/30'
                    : cluster.risk === 'medium'
                      ? 'border-yellow-700/60 bg-yellow-950/30'
                      : 'border-green-700/60 bg-green-950/30'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`font-semibold uppercase tracking-wide ${riskColors[cluster.risk]}`}>
                  {cluster.type.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="text-slate-300 line-clamp-2">{cluster.reason}</div>
              <div className="text-slate-400 text-[10px]">
                {cluster.members.length} entities • {(cluster.confidence * 100).toFixed(0)}% confidence
              </div>
            </div>
          ))}

          {detectedClusters.length > 3 && (
            <div className="text-xs text-slate-400 px-3 py-1">
              +{detectedClusters.length - 3} more clusters
            </div>
          )}
        </div>
      )}

      {detectedClusters.length === 0 && (
        <div className="p-3 rounded-lg border border-cyan-700/30 bg-slate-900/20 text-center">
          <p className="text-xs text-slate-400">No clusters detected</p>
        </div>
      )}
    </div>
  );
}
