import { IntelligenceResult } from '../types/ciw.types';
import useCIWStore from '../store/ciwStore';
import evidenceStore from '../store/evidenceStore';
import timelineStore from '../store/timelineStore';
import { normalizeResult } from './intelligenceNormalizer';

/**
 * Evidence Integration Service
 *
 * Automatically creates evidence, graph relationships, and timeline entries
 * from enriched intelligence results when confidence thresholds are met.
 */

const CONFIDENCE_THRESHOLD = 0.5;
const HIGH_RISK_THRESHOLD = 70;

/**
 * Create timeline event from intelligence result
 */
function createTimelineEvent(result: IntelligenceResult, caseId?: string) {
  const severity = result.score && result.score >= HIGH_RISK_THRESHOLD ? 'critical' : result.score && result.score >= 50 ? 'high' : 'medium';

  return {
    caseId,
    title: `Intelligence: ${result.source.toUpperCase()}`,
    description: result.summary || result.title,
    timestamp: new Date().toISOString(),
    severity,
    evidence: result.id,
    metadata: {
      source: result.source,
      score: result.score,
      sources: result.meta.length,
    },
  };
}

/**
 * Create graph nodes from enriched result
 */
function createGraphNodesFromResult(result: IntelligenceResult, enriched: ReturnType<typeof normalizeResult>) {
  const nodes = [];

  // Main result node
  nodes.push({
    id: result.id,
    label: result.title,
    type: result.source,
    metadata: {
      score: result.score,
      confidence: enriched.confidence,
      recommendation: enriched.recommendation,
      tags: enriched.tags,
      sourcesCount: result.meta.length,
    },
  });

  // Related entity nodes
  for (const entity of enriched.relatedEntities.slice(0, 3)) {
    nodes.push({
      id: `entity-${entity.replace(/[^a-z0-9]/gi, '-')}`,
      label: entity,
      type: 'related-entity',
      metadata: {
        discoveredVia: result.source,
        confidence: enriched.confidence * 0.8,
      },
    });
  }

  return nodes;
}

/**
 * Create graph edges linking entities
 */
function createGraphEdgesFromResult(result: IntelligenceResult, enriched: ReturnType<typeof normalizeResult>) {
  const edges = [];

  // Connect related entities
  if (enriched.relatedEntities.length > 1) {
    for (let i = 0; i < Math.min(enriched.relatedEntities.length - 1, 2); i++) {
      const source = enriched.relatedEntities[i];
      const target = enriched.relatedEntities[i + 1];

      edges.push({
        id: `edge-${source}-${target}`.replace(/[^a-z0-9-]/gi, '-'),
        source: `entity-${source.replace(/[^a-z0-9]/gi, '-')}`,
        target: `entity-${target.replace(/[^a-z0-9]/gi, '-')}`,
        relationship: 'co-referenced',
        metadata: {
          confidence: enriched.confidence,
          source: result.source,
        },
      });
    }
  }

  return edges;
}

/**
 * Integrate intelligence result into CIW stores
 */
export async function integrateIntelligence(
  result: IntelligenceResult,
  caseId?: string,
  queryId?: string
): Promise<{
  evidenceId: string;
  timelineEventId: string;
  graphNodeIds: string[];
  graphEdgeIds: string[];
}> {
  const enriched = normalizeResult(result);
  const ids = {
    evidenceId: '',
    timelineEventId: '',
    graphNodeIds: [] as string[],
    graphEdgeIds: [] as string[],
  };

  // Check confidence threshold
  if (enriched.confidence < CONFIDENCE_THRESHOLD) {
    console.debug(`Skipping integration: low confidence (${enriched.confidence})`);
    return ids;
  }

  try {
    // 1. Add to evidence store
    if (evidenceStore && typeof evidenceStore.addFromResult === 'function') {
      const evidence = evidenceStore.addFromResult(caseId, queryId || result.queryId, result, enriched.tags);
      ids.evidenceId = evidence.id;
    }

    // 2. Add timeline event
    if (timelineStore && typeof timelineStore.addEvent === 'function') {
      const event = createTimelineEvent(result, caseId);
      timelineStore.addEvent(caseId || '', event);
      ids.timelineEventId = event.title;
    }

    // 3. Add graph nodes
    if (useCIWStore && typeof useCIWStore.getState === 'function') {
      const store = useCIWStore.getState();
      const nodes = createGraphNodesFromResult(result, enriched);

      for (const node of nodes) {
        store.addNode(node);
        ids.graphNodeIds.push(node.id);
      }

      // 4. Add graph edges
      const edges = createGraphEdgesFromResult(result, enriched);
      for (const edge of edges) {
        store.addEdge(edge);
        ids.graphEdgeIds.push(edge.id);
      }
    }

    return ids;
  } catch (error) {
    console.error('Failed to integrate intelligence:', error);
    return ids;
  }
}

/**
 * Batch integrate multiple results
 */
export async function integrateBatch(
  results: IntelligenceResult[],
  caseId?: string,
  queryId?: string
): Promise<Array<ReturnType<typeof integrateIntelligence>>> {
  return Promise.all(results.map((r) => integrateIntelligence(r, caseId, queryId)));
}

/**
 * Create linked evidence from correlated entities
 */
export async function createEvidenceLinksFromCorrelation(
  sourceResultId: string,
  targetResultId: string,
  correlationScore: number,
  caseId?: string
): Promise<string> {
  try {
    // In a full implementation, this would create explicit evidence links
    // For now, we track via metadata
    const linkId = `link-${sourceResultId}-${targetResultId}`;

    if (evidenceStore && typeof evidenceStore.linkEvidence === 'function') {
      await evidenceStore.linkEvidence(sourceResultId, targetResultId, {
        correlationScore,
        confidence: Math.min(1, correlationScore / 100),
        timestamp: new Date().toISOString(),
      });
    }

    return linkId;
  } catch (error) {
    console.error('Failed to create evidence link:', error);
    return '';
  }
}

/**
 * Update evidence with enrichment data
 */
export async function updateEvidenceWithEnrichment(
  evidenceId: string,
  enrichmentData: Record<string, unknown>
): Promise<boolean> {
  try {
    if (evidenceStore && typeof evidenceStore.updateEvidence === 'function') {
      await evidenceStore.updateEvidence(evidenceId, {
        enrichments: enrichmentData,
        enrichedAt: new Date().toISOString(),
      });
      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to update evidence:', error);
    return false;
  }
}

export default {
  integrateIntelligence,
  integrateBatch,
  createEvidenceLinksFromCorrelation,
  updateEvidenceWithEnrichment,
};
