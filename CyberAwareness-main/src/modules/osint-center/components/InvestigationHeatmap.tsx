/**
 * Investigation Heatmap Component
 * Displays high-risk evidence, entities, and clusters at a glance
 */

import React, { useMemo } from 'react';
import { AlertTriangle, Activity, TrendingUp, Lock } from 'lucide-react';
import { extractEntitiesFromEvidence, getAllUniqueEntities, ExtractedEntity } from '../services/entityExtraction';
import { assessEvidenceRisk, batchAssessEvidenceRisk } from '../services/evidenceRiskEngine';
import { findCorrelationLinks } from '../services/correlationEngine';
import { useEvidenceStore } from '../store/evidenceStore';
import ciwStore from '../store/ciwStore';

interface HeatmapMetric {
  label: string;
  value: string | number;
  risk?: 'critical' | 'high' | 'medium' | 'low' | 'info';
  icon: React.ReactNode;
  description: string;
}

export const InvestigationHeatmap: React.FC = () => {
  const evidenceItems = useEvidenceStore((s) => s.items);
  const activeCaseId = ciwStore.getState().activeCaseId;
  const graph = ciwStore.getState().graph;

  const metrics = useMemo((): HeatmapMetric[] => {
    if (evidenceItems.length === 0) {
      return [];
    }

    const result: HeatmapMetric[] = [];

    // Get case-scoped evidence
    const caseEvidence = activeCaseId ? evidenceItems.filter((e) => e.caseId === activeCaseId) : evidenceItems;

    if (caseEvidence.length === 0) {
      return [];
    }

    // 1. Highest Risk Evidence
    const riskAssessments = batchAssessEvidenceRisk(
      caseEvidence.map((e) => ({
        id: e.id,
        title: e.title,
        summary: e.summary,
        raw: e.raw,
      })),
    );

    let highestRiskEvidence: { id: string; risk: number; title: string; riskLevel: string } | null = null;
    let maxRisk = 0;

    riskAssessments.forEach((assessment, evidenceId) => {
      if (assessment.risk > maxRisk) {
        maxRisk = assessment.risk;
        const evTitle = caseEvidence.find((e) => e.id === evidenceId)?.title || 'Unknown';
        highestRiskEvidence = {
          id: evidenceId,
          risk: assessment.risk,
          title: evTitle.substring(0, 30),
          riskLevel: assessment.riskLevel,
        };
      }
    });

    if (highestRiskEvidence) {
      result.push({
        label: 'Highest Risk Evidence',
        value: highestRiskEvidence.title,
        risk: highestRiskEvidence.riskLevel as any,
        icon: <AlertTriangle size={16} />,
        description: `Risk Score: ${(highestRiskEvidence.risk * 100).toFixed(0)}%`,
      });
    }

    // 2. Most Referenced Entity (entity appearing in most evidence items)
    const allExtractions = caseEvidence.map((e) => ({
      evidenceId: e.id,
      entities: extractEntitiesFromEvidence(e.id, e.summary || e.raw, e.title).entities,
    }));

    const entityCount = new Map<string, { type: string; count: number; value: string }>();
    allExtractions.forEach((ex) => {
      ex.entities.forEach((ent) => {
        const key = `${ent.type}:${ent.value}`;
        const current = entityCount.get(key);
        if (current) {
          current.count += 1;
        } else {
          entityCount.set(key, { type: ent.type, count: 1, value: ent.value });
        }
      });
    });

    let mostReferencedEntity: { type: string; value: string; count: number } | null = null;
    let maxCount = 1;

    entityCount.forEach((item) => {
      if (item.count > maxCount) {
        maxCount = item.count;
        mostReferencedEntity = { type: item.type, value: item.value, count: item.count };
      }
    });

    if (mostReferencedEntity) {
      const riskLevel = mostReferencedEntity.count > 3 ? 'high' : mostReferencedEntity.count > 2 ? 'medium' : 'low';
      result.push({
        label: 'Most Referenced Entity',
        value: `${mostReferencedEntity.value} (${mostReferencedEntity.type})`,
        risk: riskLevel,
        icon: <TrendingUp size={16} />,
        description: `Found in ${mostReferencedEntity.count} evidence items`,
      });
    }

    // 3. Largest Entity Cluster (most entities extracted from single evidence)
    let largestCluster: { evidenceId: string; count: number; title: string } | null = null;
    let maxClusterSize = 0;

    allExtractions.forEach((ex) => {
      if (ex.entities.length > maxClusterSize) {
        maxClusterSize = ex.entities.length;
        const evTitle = caseEvidence.find((e) => e.id === ex.evidenceId)?.title || 'Unknown';
        largestCluster = {
          evidenceId: ex.evidenceId,
          count: ex.entities.length,
          title: evTitle.substring(0, 30),
        };
      }
    });

    if (largestCluster) {
      result.push({
        label: 'Largest Entity Cluster',
        value: `${largestCluster.count} entities`,
        risk: largestCluster.count > 10 ? 'high' : largestCluster.count > 5 ? 'medium' : 'low',
        icon: <Lock size={16} />,
        description: `From: ${largestCluster.title}`,
      });
    }

    // 4. Most Connected Entity (entity that correlates most with graph nodes)
    if (graph.nodes.length > 0) {
      const allUniqueEntities = getAllUniqueEntities(
        allExtractions.map((ex) => ({
          evidenceId: ex.evidenceId,
          rawContent: '',
          entities: ex.entities,
          summary: { emailCount: 0, domainCount: 0, ipCount: 0, walletCount: 0, mobileCount: 0, usernameCount: 0 },
        })),
      );

      let mostConnected: { entity: ExtractedEntity; connectionCount: number } | null = null;
      let maxConnections = 0;

      allUniqueEntities.forEach((entity) => {
        // Count how many graph nodes share similar values
        const connections = graph.nodes.filter((node) => {
          if (node.type !== entity.type) return false;
          return node.label.toLowerCase().includes(entity.value.toLowerCase()) || entity.value.toLowerCase().includes(node.label.toLowerCase());
        }).length;

        if (connections > maxConnections) {
          maxConnections = connections;
          mostConnected = { entity, connectionCount: connections };
        }
      });

      if (mostConnected && mostConnected.connectionCount > 0) {
        result.push({
          label: 'Most Connected Entity',
          value: `${mostConnected.entity.value} (${mostConnected.entity.type})`,
          risk: mostConnected.connectionCount > 2 ? 'critical' : mostConnected.connectionCount > 1 ? 'high' : 'medium',
          icon: <Activity size={16} />,
          description: `Connected to ${mostConnected.connectionCount} graph nodes`,
        });
      }
    }

    return result;
  }, [evidenceItems, activeCaseId, graph]);

  const getRiskColor = (risk?: string): string => {
    switch (risk) {
      case 'critical':
        return 'bg-red-900/40 border-red-700/60 text-red-300';
      case 'high':
        return 'bg-amber-900/40 border-amber-700/60 text-amber-300';
      case 'medium':
        return 'bg-yellow-900/40 border-yellow-700/60 text-yellow-300';
      case 'low':
        return 'bg-green-900/40 border-green-700/60 text-green-300';
      default:
        return 'bg-blue-900/40 border-blue-700/60 text-blue-300';
    }
  };

  if (metrics.length === 0) {
    return (
      <div className="p-4 rounded-lg border border-slate-700/40 bg-slate-900/40 text-slate-400 text-sm">
        <div className="text-xs text-slate-500">No investigation data available</div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="text-xs font-semibold text-cyan-300 uppercase tracking-wide">Investigation Heatmap</div>

      <div className="grid grid-cols-1 gap-2">
        {metrics.map((metric, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg border transition-all hover:border-opacity-100 ${getRiskColor(metric.risk)}`}
          >
            <div className="flex items-start gap-2">
              <div className="mt-0.5 opacity-70">{metric.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-slate-300">{metric.label}</div>
                <div className="text-sm font-mono text-white truncate mt-1">{metric.value}</div>
                <div className="text-xs text-slate-400 mt-1">{metric.description}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-2 text-[10px] pt-2 border-t border-slate-700/30">
        <div className="p-2 rounded bg-slate-800/40 border border-slate-700/40">
          <div className="text-slate-400">Total Evidence</div>
          <div className="text-cyan-300 font-semibold text-sm">{evidenceItems.filter((e) => !activeCaseId || e.caseId === activeCaseId).length}</div>
        </div>
        <div className="p-2 rounded bg-slate-800/40 border border-slate-700/40">
          <div className="text-slate-400">Graph Nodes</div>
          <div className="text-cyan-300 font-semibold text-sm">{graph.nodes.length}</div>
        </div>
      </div>
    </div>
  );
};

export default InvestigationHeatmap;
