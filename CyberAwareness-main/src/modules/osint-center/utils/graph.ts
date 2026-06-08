import { IntelligenceResult, QueryRequest, EntityNode, EntityRelationship, GraphDocument } from '../types/ciw.types';

function inferRelationship(query: QueryRequest, result: IntelligenceResult) {
  if (query.source === 'username' && result.source === 'wallet') {
    return 'owns';
  }

  if ((query.source === 'email' && result.source === 'username') || (query.source === 'username' && result.source === 'email')) {
    return 'contacted';
  }

  if (query.source === 'ip' && result.source === 'domain') {
    return 'observed_in';
  }

  if (query.source === result.source) {
    return 'associated_with';
  }

  return 'linked_to';
}

export function buildGraph(query: QueryRequest, results: IntelligenceResult[]): GraphDocument {
  const rootNode: EntityNode = {
    id: query.id,
    label: `Query: ${query.payload}`,
    type: query.source,
    metadata: { ...query },
  };

  const nodes: EntityNode[] = [rootNode];
  const edges: EntityRelationship[] = [];

  results.forEach((result) => {
    const node: EntityNode = {
      id: result.id,
      label: result.title,
      type: result.source,
      metadata: {
        summary: result.summary,
        score: result.score,
        meta: result.meta,
      },
    };
    nodes.push(node);
    edges.push({
      id: `${rootNode.id}->${node.id}`,
      source: rootNode.id,
      target: node.id,
      relationship: inferRelationship(query, result),
      metadata: { score: result.score },
    });

    result.meta.forEach((meta, index) => {
      const metaNodeId = `${node.id}-meta-${index}`;
      nodes.push({
        id: metaNodeId,
        label: `Source: ${meta.sourceName}`,
        type: 'source',
        metadata: meta,
      });
      edges.push({
        id: `${node.id}->${metaNodeId}`,
        source: node.id,
        target: metaNodeId,
        relationship: 'observed_in',
        metadata: {},
      });
    });
  });

  return {
    nodes,
    edges,
  };
}
