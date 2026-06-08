import type { EntityNode, EntityRelationship, GraphDocument } from '../types/ciw.types';
import type { CorrelationResult } from './correlationEngine';

export interface Cluster {
  id: string;
  risk: 'critical' | 'high' | 'medium' | 'low';
  reason: string;
  members: string[];
  type:
    | 'phishing_infrastructure'
    | 'fraud_ring'
    | 'reused_wallet'
    | 'reused_username'
    | 'reused_domain'
    | 'burner_email';
  confidence: number;
}

// Detect connected components using DFS
function findConnectedComponents(
  nodes: EntityNode[],
  edges: EntityRelationship[]
): Set<string>[] {
  const nodeIds = new Set(nodes.map((n) => n.id));
  const adjacency = new Map<string, Set<string>>();

  // Build adjacency list
  for (const nodeId of nodeIds) {
    adjacency.set(nodeId, new Set());
  }

  for (const edge of edges) {
    adjacency.get(edge.source)?.add(edge.target);
    adjacency.get(edge.target)?.add(edge.source);
  }

  // DFS to find components
  const visited = new Set<string>();
  const components: Set<string>[] = [];

  for (const nodeId of nodeIds) {
    if (!visited.has(nodeId)) {
      const component = new Set<string>();
      const stack = [nodeId];

      while (stack.length > 0) {
        const current = stack.pop()!;
        if (visited.has(current)) continue;

        visited.add(current);
        component.add(current);

        for (const neighbor of adjacency.get(current) || []) {
          if (!visited.has(neighbor)) {
            stack.push(neighbor);
          }
        }
      }

      if (component.size > 1) {
        components.push(component);
      }
    }
  }

  return components;
}

// Detect phishing infrastructure clusters (multiple domains + IPs)
export function detectPhishingInfrastructure(
  nodes: EntityNode[],
  edges: EntityRelationship[]
): Cluster[] {
  const clusters: Cluster[] = [];
  const components = findConnectedComponents(nodes, edges);

  for (let i = 0; i < components.length; i++) {
    const componentIds = Array.from(components[i]);
    const componentNodes = nodes.filter((n) => componentIds.includes(n.id));

    const domainCount = componentNodes.filter((n) => n.type === 'domain').length;
    const ipCount = componentNodes.filter((n) => n.type === 'ip').length;

    if (domainCount >= 2 && ipCount >= 1) {
      const reasons: string[] = [];
      const riskScore = Math.min(1.0, 0.3 + domainCount * 0.15 + ipCount * 0.1);

      reasons.push(`${domainCount} domains hosted on ${ipCount} IP(s)`);

      if (domainCount > 5) {
        reasons.push('Excessive domain infrastructure for single IP');
      }

      const riskLevel =
        riskScore >= 0.8
          ? 'critical'
          : riskScore >= 0.6
            ? 'high'
            : riskScore >= 0.4
              ? 'medium'
              : 'low';

      clusters.push({
        id: `cluster_phishing_${i}`,
        risk: riskLevel,
        reason: reasons.join('; '),
        members: componentIds,
        type: 'phishing_infrastructure',
        confidence: Math.min(0.95, 0.6 + riskScore * 0.3),
      });
    }
  }

  return clusters;
}

// Detect fraud rings (multiple usernames, emails, or wallets linked together)
export function detectFraudRings(
  nodes: EntityNode[],
  edges: EntityRelationship[]
): Cluster[] {
  const clusters: Cluster[] = [];
  const components = findConnectedComponents(nodes, edges);

  for (let i = 0; i < components.length; i++) {
    const componentIds = Array.from(components[i]);
    const componentNodes = nodes.filter((n) => componentIds.includes(n.id));

    const usernames = componentNodes.filter((n) => n.type === 'username').length;
    const emails = componentNodes.filter((n) => n.type === 'email').length;
    const identities = usernames + emails;

    if (identities >= 3) {
      const reasons: string[] = [];
      const riskScore = Math.min(1.0, 0.4 + identities * 0.15);

      reasons.push(`${identities} identities sharing infrastructure`);

      if (identities >= 5) {
        reasons.push('High-volume identity abuse pattern');
      }

      const riskLevel =
        riskScore >= 0.8
          ? 'critical'
          : riskScore >= 0.6
            ? 'high'
            : riskScore >= 0.4
              ? 'medium'
              : 'low';

      clusters.push({
        id: `cluster_fraud_ring_${i}`,
        risk: riskLevel,
        reason: reasons.join('; '),
        members: componentIds,
        type: 'fraud_ring',
        confidence: Math.min(0.9, 0.5 + riskScore * 0.4),
      });
    }
  }

  return clusters;
}

// Detect reused wallets
export function detectReusedWallets(nodes: EntityNode[]): Cluster[] {
  const clusters: Cluster[] = [];
  const walletMap = new Map<string, string[]>();

  // Group nodes by wallet (case-insensitive)
  for (const node of nodes) {
    if (node.type === 'wallet') {
      const key = node.label.toLowerCase();
      if (!walletMap.has(key)) {
        walletMap.set(key, []);
      }
      walletMap.get(key)!.push(node.id);
    }
  }

  // Find wallets used by multiple entities
  let clusterIdx = 0;
  for (const [wallet, nodeIds] of walletMap) {
    if (nodeIds.length > 1) {
      const connectedNodes = new Set<string>(nodeIds);
      const parentNodes = nodes
        .filter((n) => n.type !== 'wallet')
        .filter((n) =>
          nodeIds.some((nid) => n.id.includes(nid) || nid.includes(n.id))
        )
        .map((n) => n.id);

      connectedNodes.forEach((n) => parentNodes.push(n));

      const reasons: string[] = [];
      const riskScore = Math.min(1.0, 0.6 + nodeIds.length * 0.2);

      reasons.push(
        `Wallet "${wallet.substring(0, 10)}..." reused across ${nodeIds.length} entities`
      );

      if (nodeIds.length > 3) {
        reasons.push('High-risk wallet reuse pattern');
      }

      const riskLevel =
        riskScore >= 0.8
          ? 'critical'
          : riskScore >= 0.6
            ? 'high'
            : riskScore >= 0.4
              ? 'medium'
              : 'low';

      clusters.push({
        id: `cluster_wallet_${clusterIdx++}`,
        risk: riskLevel,
        reason: reasons.join('; '),
        members: Array.from(connectedNodes),
        type: 'reused_wallet',
        confidence: Math.min(0.99, 0.7 + riskScore * 0.2),
      });
    }
  }

  return clusters;
}

// Detect reused usernames
export function detectReusedUsernames(nodes: EntityNode[]): Cluster[] {
  const clusters: Cluster[] = [];
  const usernameMap = new Map<string, string[]>();

  for (const node of nodes) {
    if (node.type === 'username') {
      const key = node.label.toLowerCase();
      if (!usernameMap.has(key)) {
        usernameMap.set(key, []);
      }
      usernameMap.get(key)!.push(node.id);
    }
  }

  let clusterIdx = 0;
  for (const [username, nodeIds] of usernameMap) {
    if (nodeIds.length > 1) {
      const reasons: string[] = [];
      const riskScore = Math.min(1.0, 0.5 + nodeIds.length * 0.15);

      reasons.push(`Username "${username}" reused across ${nodeIds.length} identities`);

      const riskLevel =
        riskScore >= 0.7
          ? 'high'
          : riskScore >= 0.4
            ? 'medium'
            : 'low';

      clusters.push({
        id: `cluster_username_${clusterIdx++}`,
        risk: riskLevel,
        reason: reasons.join('; '),
        members: nodeIds,
        type: 'reused_username',
        confidence: Math.min(0.99, 0.75 + riskScore * 0.2),
      });
    }
  }

  return clusters;
}

// Detect reused domains
export function detectReusedDomains(nodes: EntityNode[]): Cluster[] {
  const clusters: Cluster[] = [];
  const domainMap = new Map<string, string[]>();

  for (const node of nodes) {
    if (node.type === 'domain') {
      const key = node.label.toLowerCase();
      if (!domainMap.has(key)) {
        domainMap.set(key, []);
      }
      domainMap.get(key)!.push(node.id);
    }
  }

  let clusterIdx = 0;
  for (const [domain, nodeIds] of domainMap) {
    if (nodeIds.length > 1) {
      const reasons: string[] = [];
      const riskScore = Math.min(1.0, 0.4 + nodeIds.length * 0.2);

      reasons.push(`Domain "${domain}" linked to ${nodeIds.length} entities`);

      const riskLevel =
        riskScore >= 0.8
          ? 'critical'
          : riskScore >= 0.6
            ? 'high'
            : riskScore >= 0.4
              ? 'medium'
              : 'low';

      clusters.push({
        id: `cluster_domain_${clusterIdx++}`,
        risk: riskLevel,
        reason: reasons.join('; '),
        members: nodeIds,
        type: 'reused_domain',
        confidence: Math.min(0.95, 0.6 + riskScore * 0.3),
      });
    }
  }

  return clusters;
}

// Detect burner emails (temporary email services)
export function detectBurnerEmails(nodes: EntityNode[]): Cluster[] {
  const clusters: Cluster[] = [];
  const burnerProviders = [
    'temp',
    'tempmail',
    '10minutemail',
    'throwaway',
    'mailinator',
    'spam4',
    'yopmail',
    'sharklasers',
    'trashmail',
    'fake',
    'guerrillamail',
    'maildrop',
  ];

  const burnerNodes: Map<string, string[]> = new Map();

  for (const node of nodes) {
    if (node.type === 'email') {
      const domain = node.label.split('@')[1]?.toLowerCase() || '';
      const isBurner = burnerProviders.some(
        (p) => domain.includes(p) || domain.startsWith(p)
      );

      if (isBurner) {
        if (!burnerNodes.has(domain)) {
          burnerNodes.set(domain, []);
        }
        burnerNodes.get(domain)!.push(node.id);
      }
    }
  }

  let clusterIdx = 0;
  for (const [domain, nodeIds] of burnerNodes) {
    if (nodeIds.length >= 1) {
      const reasons: string[] = [];
      reasons.push(`Temporary email service detected: ${domain}`);
      reasons.push('High-risk indicator: burner email used for account creation');

      const riskLevel = nodeIds.length > 2 ? 'critical' : 'high';

      clusters.push({
        id: `cluster_burner_${clusterIdx++}`,
        risk: riskLevel,
        reason: reasons.join('; '),
        members: nodeIds,
        type: 'burner_email',
        confidence: 0.95,
      });
    }
  }

  return clusters;
}

// Main cluster detection function
export function detectClusters(graph: GraphDocument): Cluster[] {
  const allClusters: Cluster[] = [];

  allClusters.push(...detectPhishingInfrastructure(graph.nodes, graph.edges));
  allClusters.push(...detectFraudRings(graph.nodes, graph.edges));
  allClusters.push(...detectReusedWallets(graph.nodes));
  allClusters.push(...detectReusedUsernames(graph.nodes));
  allClusters.push(...detectReusedDomains(graph.nodes));
  allClusters.push(...detectBurnerEmails(graph.nodes));

  // Sort by risk score
  const riskScores = { critical: 4, high: 3, medium: 2, low: 1 };
  return allClusters.sort(
    (a, b) => riskScores[b.risk] - riskScores[a.risk] || b.confidence - a.confidence
  );
}
