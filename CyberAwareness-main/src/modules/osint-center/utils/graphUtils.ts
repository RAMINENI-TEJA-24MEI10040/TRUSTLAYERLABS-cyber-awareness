import type { EntityNode, EntityRelationship, GraphDocument } from '../types/ciw.types';
import type { FilterState } from '../components/GraphFilters';

export interface PathNode {
  id: string;
  distance: number;
  path: string[];
}

// Find shortest path between two nodes using BFS
export function findShortestPath(
  graph: GraphDocument,
  startId: string,
  endId: string
): string[] {
  if (startId === endId) return [startId];

  const visited = new Set<string>();
  const queue: Array<{ nodeId: string; path: string[] }> = [{ nodeId: startId, path: [startId] }];

  while (queue.length > 0) {
    const { nodeId, path } = queue.shift()!;

    if (visited.has(nodeId)) continue;
    visited.add(nodeId);

    if (nodeId === endId) return path;

    const neighbors = graph.edges
      .filter((edge) => edge.source === nodeId || edge.target === nodeId)
      .map((edge) => (edge.source === nodeId ? edge.target : edge.source));

    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        queue.push({ nodeId: neighbor, path: [...path, neighbor] });
      }
    }
  }

  return [];
}

// Find all nodes within N hops
export function findNodesWithinDistance(
  graph: GraphDocument,
  startId: string,
  maxDistance: number
): Map<string, number> {
  const distances = new Map<string, number>();
  distances.set(startId, 0);

  const queue: Array<{ nodeId: string; distance: number }> = [{ nodeId: startId, distance: 0 }];

  while (queue.length > 0) {
    const { nodeId, distance } = queue.shift()!;

    if (distance >= maxDistance) continue;

    const neighbors = graph.edges
      .filter((edge) => edge.source === nodeId || edge.target === nodeId)
      .map((edge) => (edge.source === nodeId ? edge.target : edge.source));

    for (const neighbor of neighbors) {
      if (!distances.has(neighbor)) {
        const newDistance = distance + 1;
        distances.set(neighbor, newDistance);
        queue.push({ nodeId: neighbor, distance: newDistance });
      }
    }
  }

  return distances;
}

// Filter graph based on conditions
export function filterGraph(graph: GraphDocument, filters: FilterState): GraphDocument {
  let filteredNodes = graph.nodes;
  let filteredEdges = graph.edges;

  // Filter by risk level
  if (filters.riskLevel !== 'all') {
    const scoreThresholds: Record<string, [number, number]> = {
      critical: [70, 100],
      high: [40, 69],
      medium: [20, 39],
      low: [0, 19],
    };

    const [min, max] = scoreThresholds[filters.riskLevel] || [0, 100];
    filteredNodes = filteredNodes.filter((node) => {
      const score = typeof node.metadata?.score === 'number' ? node.metadata.score : 0;
      return score >= min && score <= max;
    });
  }

  // Filter by entity types
  if (filters.entityTypes.length > 0) {
    filteredNodes = filteredNodes.filter((node) => filters.entityTypes.includes(node.type));
  }

  // Filter by date range
  if (filters.dateRange?.start || filters.dateRange?.end) {
    const startDate = filters.dateRange?.start ? new Date(filters.dateRange.start).getTime() : 0;
    const endDate = filters.dateRange?.end ? new Date(filters.dateRange.end).getTime() : Date.now();

    filteredNodes = filteredNodes.filter((node) => {
      const nodeDate =
        node.metadata?.timestamp || node.metadata?.meta?.[0]?.timestamp;
      if (!nodeDate) return true;
      const timestamp = new Date(nodeDate).getTime();
      return timestamp >= startDate && timestamp <= endDate;
    });
  }

  const nodeIds = new Set(filteredNodes.map((n) => n.id));
  filteredEdges = filteredEdges.filter((edge) => nodeIds.has(edge.source) && nodeIds.has(edge.target));

  return {
    nodes: filteredNodes,
    edges: filteredEdges,
  };
}

// Search nodes by query
export function searchNodes(graph: GraphDocument, query: string, searchType: string): EntityNode[] {
  const lowerQuery = query.toLowerCase();

  return graph.nodes.filter((node) => {
    const typeMatch = searchType === 'all' || node.type === searchType;
    const labelMatch = node.label.toLowerCase().includes(lowerQuery);
    const idMatch = node.id.toLowerCase().includes(lowerQuery);
    return typeMatch && (labelMatch || idMatch);
  });
}

// Get evidence count for a node
export function getEvidenceCount(node: EntityNode): number {
  return Array.isArray(node.metadata?.meta) ? node.metadata.meta.length : 0;
}

// Get connected component nodes
export function getConnectedComponent(graph: GraphDocument, nodeId: string): string[] {
  const visited = new Set<string>();
  const stack = [nodeId];

  while (stack.length > 0) {
    const current = stack.pop()!;
    if (visited.has(current)) continue;
    visited.add(current);

    const neighbors = graph.edges
      .filter((edge) => edge.source === current || edge.target === current)
      .map((edge) => (edge.source === current ? edge.target : edge.source));

    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        stack.push(neighbor);
      }
    }
  }

  return Array.from(visited);
}
