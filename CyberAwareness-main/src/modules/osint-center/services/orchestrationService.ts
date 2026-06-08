import { IntelligenceResult, QueryRequest, EntityNode, EntityRelationship } from '../types/ciw.types';
import * as emailIntel from './emailIntel';
import * as usernameIntel from './usernameIntel';
import * as domainIntel from './domainIntel';
import * as ipIntel from './ipIntel';
import * as urlIntel from './urlIntel';
import * as walletIntel from './walletIntel';
import { normalizeResults, mergeResults, filterResults, aggregateResults } from './intelligenceNormalizer';
import { findCorrelationLinks } from './correlationEngine';

/**
 * Orchestration Service
 *
 * Coordinates multi-source OSINT collection, enrichment, normalization, and integration:
 * - Collects data from all available intelligence sources
 * - Normalizes results into uniform format
 * - Feeds enriched data into correlation engine
 * - Creates graph nodes and relationships
 * - Integrates with evidence and timeline stores
 */

interface OrchestratedQuery {
  query: QueryRequest;
  rawResults: IntelligenceResult[];
  enrichedResults: ReturnType<typeof normalizeResults>;
  correlations: ReturnType<typeof findCorrelationLinks>;
  graphNodes: EntityNode[];
  graphEdges: EntityRelationship[];
  summary: ReturnType<typeof aggregateResults>;
}

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Collect intelligence from all applicable sources based on query type
 */
async function collectIntelligence(query: QueryRequest): Promise<IntelligenceResult[]> {
  const results: IntelligenceResult[] = [];

  try {
    switch (query.source) {
      case 'email':
        results.push(...(await emailIntel.lookup(query.payload)));
        break;

      case 'username':
        results.push(...(await usernameIntel.lookup(query.payload)));
        break;

      case 'domain':
        results.push(...(await domainIntel.lookup(query.payload)));
        break;

      case 'ip':
        results.push(...(await ipIntel.lookup(query.payload)));
        break;

      case 'url':
        results.push(...(await urlIntel.lookup(query.payload)));
        break;

      case 'wallet':
        results.push(...(await walletIntel.lookup(query.payload)));
        break;

      case 'mobile':
        // Mobile intelligence can use phone number validation
        // For now, defer to future implementation
        break;

      case 'reverse-image':
        // Reverse image search via external APIs (future)
        break;

      default:
        console.warn(`Unknown query source: ${query.source}`);
    }
  } catch (error) {
    console.error(`Intelligence collection failed for ${query.source}:`, error);
  }

  return results;
}

/**
 * Create graph nodes from enriched intelligence results
 */
function createGraphNodes(enrichedResults: ReturnType<typeof normalizeResults>, queryPayload: string): EntityNode[] {
  const nodes: EntityNode[] = [];
  const seen = new Set<string>();

  // Create node for the query payload itself
  const queryNodeId = makeId('node');
  if (!seen.has(queryPayload)) {
    nodes.push({
      id: queryNodeId,
      label: queryPayload,
      type: 'query-target',
      metadata: {
        searchPayload: queryPayload,
        queryTimestamp: new Date().toISOString(),
      },
    });
    seen.add(queryPayload);
  }

  // Create nodes for each result
  for (const enriched of enrichedResults) {
    const result = enriched.result;
    const nodeId = makeId('node');

    if (!seen.has(result.title)) {
      nodes.push({
        id: nodeId,
        label: result.title,
        type: result.source,
        metadata: {
          score: result.score,
          source: result.source,
          confidence: enriched.confidence,
          recommendation: enriched.recommendation,
          tags: enriched.tags,
          sourcesCount: result.meta.length,
        },
      });
      seen.add(result.title);
    }

    // Create nodes for related entities
    for (const entity of enriched.relatedEntities.slice(0, 5)) {
      if (!seen.has(entity)) {
        nodes.push({
          id: makeId('node'),
          label: entity,
          type: 'related-entity',
          metadata: {
            discoveredVia: result.source,
            confidence: enriched.confidence * 0.8,
          },
        });
        seen.add(entity);
      }
    }
  }

  return nodes;
}

/**
 * Create graph edges from nodes and correlations
 */
function createGraphEdges(
  nodes: EntityNode[],
  enrichedResults: ReturnType<typeof normalizeResults>,
  correlations: ReturnType<typeof findCorrelationLinks>
): EntityRelationship[] {
  const edges: EntityRelationship[] = [];
  const seen = new Set<string>();

  // Create edges between query target and results
  const queryNode = nodes[0];
  if (queryNode) {
    for (let i = 1; i < Math.min(nodes.length, 6); i++) {
      const targetNode = nodes[i];
      if (targetNode && queryNode.id !== targetNode.id) {
        const edgeId = makeId('edge');
        const edgeKey = `${queryNode.id}|${targetNode.id}`;

        if (!seen.has(edgeKey)) {
          edges.push({
            id: edgeId,
            source: queryNode.id,
            target: targetNode.id,
            relationship: 'discovered-via',
            metadata: {
              confidence: 0.9,
              timestamp: new Date().toISOString(),
            },
          });
          seen.add(edgeKey);
        }
      }
    }
  }

  // Create edges from correlation results
  for (const correlation of correlations) {
    const sourceNode = nodes.find((n) => n.label === correlation.source);
    const targetNode = nodes.find((n) => n.label === correlation.target);

    if (sourceNode && targetNode) {
      const edgeId = makeId('edge');
      const edgeKey = `${sourceNode.id}|${targetNode.id}`;

      if (!seen.has(edgeKey)) {
        edges.push({
          id: edgeId,
          source: sourceNode.id,
          target: targetNode.id,
          relationship: correlation.relationship,
          metadata: {
            score: correlation.score,
            reasoning: correlation.reasoning,
          },
        });
        seen.add(edgeKey);
      }
    }
  }

  return edges;
}

/**
 * Orchestrate a complete multi-source OSINT query
 */
export async function orchestrateQuery(query: QueryRequest): Promise<OrchestratedQuery> {
  // 1. Collect intelligence from all sources
  const rawResults = await collectIntelligence(query);

  // 2. Normalize results
  const enrichedResults = normalizeResults(rawResults);

  // 3. Filter high-confidence results
  const filteredResults = filterResults(enrichedResults, 0.3);

  // 4. Merge duplicate results
  const mergedRawResults = mergeResults(filteredResults.map((e) => e.result));

  // 5. Find correlations
  const correlations = findCorrelationLinks(
    mergedRawResults.map((r) => ({
      id: r.id,
      label: r.title,
      type: r.source,
      metadata: { score: r.score },
    }))
  );

  // 6. Create graph representation
  const graphNodes = createGraphNodes(filteredResults, query.payload);
  const graphEdges = createGraphEdges(graphNodes, filteredResults, correlations);

  // 7. Aggregate summary
  const summary = aggregateResults(filteredResults);

  return {
    query,
    rawResults,
    enrichedResults: filteredResults,
    correlations,
    graphNodes,
    graphEdges,
    summary,
  };
}

/**
 * Batch orchestrate multiple queries
 */
export async function orchestrateBatch(queries: QueryRequest[]): Promise<OrchestratedQuery[]> {
  return Promise.all(queries.map(orchestrateQuery));
}

/**
 * Process query with confidence threshold
 */
export async function processQueryWithThreshold(
  query: QueryRequest,
  minConfidence: number = 0.5
): Promise<OrchestratedQuery> {
  const orchestrated = await orchestrateQuery(query);

  // Filter based on confidence threshold
  orchestrated.enrichedResults = filterResults(orchestrated.enrichedResults, minConfidence);

  // Rebuild graph with filtered results
  orchestrated.graphNodes = createGraphNodes(orchestrated.enrichedResults, query.payload);
  orchestrated.graphEdges = createGraphEdges(
    orchestrated.graphNodes,
    orchestrated.enrichedResults,
    orchestrated.correlations
  );

  // Update summary
  orchestrated.summary = aggregateResults(orchestrated.enrichedResults);

  return orchestrated;
}

export default {
  orchestrateQuery,
  orchestrateBatch,
  processQueryWithThreshold,
};
