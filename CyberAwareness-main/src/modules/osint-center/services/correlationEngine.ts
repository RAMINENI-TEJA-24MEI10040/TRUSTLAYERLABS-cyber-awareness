import type { EntityNode, EntityRelationship, GraphDocument } from '../types/ciw.types';
import type { IntelligenceResult } from '../types/ciw.types';

export interface CorrelationResult {
  sourceId: string;
  targetId: string;
  score: number;
  confidence: number;
  reasoning: string[];
  correlationType: string;
}

export interface ClusterAnalysis {
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
}

// Calculate similarity between strings (normalized Levenshtein-like)
function calculateStringSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();

  if (s1 === s2) return 1.0;
  if (s1.length === 0 || s2.length === 0) return 0;

  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;

  const editDistance = getEditDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

// Levenshtein distance
function getEditDistance(s1: string, s2: string): number {
  const costs: number[] = [];
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else if (j > 0) {
        let newValue = costs[j - 1];
        if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}

// Extract domain from email
function getDomainFromEmail(email: string): string {
  const match = email.match(/@([^.]+\.[^.]+)$/);
  return match ? match[1] : '';
}

// Extract domain variations
function getDomainVariations(domain: string): string[] {
  const variations: string[] = [domain];
  const base = domain.split('.')[0];

  if (base) {
    variations.push(base);
    variations.push(`${base}.com`);
    variations.push(`${base}.net`);
    variations.push(`${base}.org`);
  }

  return variations;
}

// Score email-domain correlation
export function scoreEmailDomainMatch(email: string, domain: string): { score: number; reasoning: string[] } {
  const emailDomain = getDomainFromEmail(email);
  const reasoning: string[] = [];

  if (!emailDomain) return { score: 0, reasoning: ['Could not extract domain from email'] };

  // Exact match
  if (emailDomain.toLowerCase() === domain.toLowerCase()) {
    return { score: 0.95, reasoning: ['Email domain matches exactly'] };
  }

  // Similar domain
  const similarity = calculateStringSimilarity(emailDomain, domain);
  if (similarity > 0.85) {
    return {
      score: 0.7 + similarity * 0.2,
      reasoning: [`Domain similarity score: ${(similarity * 100).toFixed(0)}%`],
    };
  }

  // Check for domain variations
  const variations = getDomainVariations(domain);
  if (variations.some((v) => v.toLowerCase() === emailDomain.toLowerCase())) {
    return {
      score: 0.6,
      reasoning: ['Email domain is variation of suspected domain'],
    };
  }

  return { score: 0, reasoning: ['No domain correlation detected'] };
}

// Score username reuse across entities
export function scoreUsernameReuse(username: string, otherUsernames: string[]): {
  score: number;
  reasoning: string[];
} {
  const reasoning: string[] = [];
  const matches = otherUsernames.filter((u) => calculateStringSimilarity(u, username) > 0.9);

  if (matches.length === 0) {
    return { score: 0, reasoning: ['No username reuse detected'] };
  }

  const reuseScore = Math.min(0.9, 0.5 + matches.length * 0.2);
  reasoning.push(`Username found in ${matches.length} other entities`);

  return { score: reuseScore, reasoning };
}

// Score wallet reuse
export function scoreWalletReuse(wallet: string, otherWallets: string[]): {
  score: number;
  reasoning: string[];
} {
  const reasoning: string[] = [];

  // Exact wallet address match
  const exactMatches = otherWallets.filter(
    (w) => w.toLowerCase() === wallet.toLowerCase()
  );

  if (exactMatches.length > 0) {
    const reuseScore = Math.min(0.95, 0.7 + exactMatches.length * 0.15);
    reasoning.push(`Wallet address reused across ${exactMatches.length} identities`);
    return { score: reuseScore, reasoning };
  }

  // Potential wallet variants (same network, different address)
  const isSameNetwork = (w1: string, w2: string) => {
    const net1 = w1.substring(0, 3);
    const net2 = w2.substring(0, 3);
    return net1 === net2 && w1.length === w2.length;
  };

  const networkMatches = otherWallets.filter((w) => isSameNetwork(w, wallet));
  if (networkMatches.length > 0) {
    reasoning.push(`Wallet from same network as ${networkMatches.length} other wallets`);
    return { score: 0.4 + networkMatches.length * 0.1, reasoning };
  }

  return { score: 0, reasoning: ['No wallet reuse detected'] };
}

// Score IP association
export function scoreIPAssociation(
  ip: string,
  domains: string[]
): { score: number; reasoning: string[] } {
  const reasoning: string[] = [];

  if (domains.length === 0) {
    return { score: 0, reasoning: ['No domains to correlate'] };
  }

  // IP hosting multiple domains is suspicious
  const score = Math.min(0.85, 0.4 + domains.length * 0.2);
  reasoning.push(`IP resolves to ${domains.length} domains`);

  if (domains.length > 3) {
    reasoning.push('High-risk IP hosting multiple domains');
  }

  return { score, reasoning };
}

// Score mobile association
export function scoreMobileAssociation(mobile: string, identifiers: string[]): {
  score: number;
  reasoning: string[];
} {
  const reasoning: string[] = [];

  if (identifiers.length === 0) {
    return { score: 0, reasoning: ['No identifiers to correlate'] };
  }

  // Mobile number linked to multiple accounts
  const score = Math.min(0.8, 0.3 + identifiers.length * 0.15);
  reasoning.push(`Mobile number linked to ${identifiers.length} accounts`);

  if (identifiers.length > 4) {
    reasoning.push('Suspicious: mobile associated with many accounts');
  }

  return { score, reasoning };
}

// Calculate overall correlation score between two entities
export function calculateCorrelationScore(
  source: EntityNode,
  target: EntityNode,
  allNodes: EntityNode[]
): CorrelationResult | null {
  const reasoning: string[] = [];
  let totalScore = 0;
  let correlationType = 'unknown';

  // Email to Domain correlation
  if (
    (source.type === 'email' && target.type === 'domain') ||
    (source.type === 'domain' && target.type === 'email')
  ) {
    const [email, domain] = source.type === 'email' ? [source.label, target.label] : [target.label, source.label];
    const result = scoreEmailDomainMatch(email, domain);
    totalScore = result.score;
    reasoning.push(...result.reasoning);
    correlationType = 'email_domain';
  }

  // Username reuse
  if (source.type === 'username' && target.type === 'username') {
    const result = scoreUsernameReuse(source.label, [target.label]);
    totalScore = result.score;
    reasoning.push(...result.reasoning);
    correlationType = 'username_reuse';
  }

  // Wallet reuse
  if (source.type === 'wallet' && target.type === 'wallet') {
    const result = scoreWalletReuse(source.label, [target.label]);
    totalScore = result.score;
    reasoning.push(...result.reasoning);
    correlationType = 'wallet_reuse';
  }

  // IP to Domain
  if (source.type === 'ip' && target.type === 'domain') {
    const result = scoreIPAssociation(source.label, [target.label]);
    totalScore = result.score;
    reasoning.push(...result.reasoning);
    correlationType = 'ip_domain';
  }

  // Mobile association
  if (source.type === 'mobile' && target.type !== 'source') {
    const result = scoreMobileAssociation(source.label, [target.label]);
    totalScore = result.score;
    reasoning.push(...result.reasoning);
    correlationType = 'mobile_association';
  }

  if (totalScore === 0) {
    return null;
  }

  // Confidence based on evidence count
  const sourceEvidence = Array.isArray(source.metadata?.meta)
    ? source.metadata.meta.length
    : 0;
  const targetEvidence = Array.isArray(target.metadata?.meta)
    ? target.metadata.meta.length
    : 0;
  const confidence = Math.min(1.0, 0.5 + (sourceEvidence + targetEvidence) * 0.05);

  return {
    sourceId: source.id,
    targetId: target.id,
    score: totalScore,
    confidence,
    reasoning,
    correlationType,
  };
}

// Find correlation links across all entities
export function findCorrelationLinks(nodes: EntityNode[]): CorrelationResult[] {
  const correlations: CorrelationResult[] = [];
  const seen = new Set<string>();

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const correlation = calculateCorrelationScore(nodes[i], nodes[j], nodes);
      if (correlation) {
        const key = `${correlation.sourceId}-${correlation.targetId}`;
        if (!seen.has(key)) {
          correlations.push(correlation);
          seen.add(key);
        }
      }
    }
  }

  return correlations.sort((a, b) => b.score - a.score);
}

/**
 * Correlate entities extracted from evidence with graph nodes
 * This creates connections between evidence-derived entities and investigation graph
 */
export interface EvidenceEntityCorrelation extends CorrelationResult {
  evidenceId: string;
  extractedEntity: {
    type: string;
    value: string;
    confidence: number;
  };
}

/**
 * Find correlations between evidence entities and graph nodes
 */
export function findEvidenceEntityCorrelations(
  graphNodes: EntityNode[],
  evidenceEntities: Array<{
    evidenceId: string;
    entities: Array<{
      type: string;
      value: string;
      confidence: number;
    }>;
  }>,
): EvidenceEntityCorrelation[] {
  const correlations: EvidenceEntityCorrelation[] = [];

  evidenceEntities.forEach((evItem) => {
    evItem.entities.forEach((evEntity) => {
      graphNodes.forEach((node) => {
        // Type matching for correlation
        let isMatch = false;
        let score = 0;

        // Email match
        if (evEntity.type === 'email' && node.type === 'email') {
          isMatch = evEntity.value.toLowerCase() === node.label.toLowerCase();
          score = isMatch ? 0.95 : 0;
        }

        // Domain match
        if (evEntity.type === 'domain' && node.type === 'domain') {
          isMatch = evEntity.value.toLowerCase() === node.label.toLowerCase();
          score = isMatch ? 0.95 : calculateStringSimilarity(evEntity.value, node.label) > 0.85 ? 0.7 : 0;
        }

        // IP match
        if (evEntity.type === 'ip' && node.type === 'ip') {
          isMatch = evEntity.value === node.label;
          score = isMatch ? 0.99 : 0;
        }

        // Wallet match
        if (evEntity.type === 'wallet' && node.type === 'wallet') {
          isMatch = evEntity.value.toLowerCase() === node.label.toLowerCase();
          score = isMatch ? 0.99 : 0;
        }

        // Username match
        if (evEntity.type === 'username' && node.type === 'username') {
          const similarity = calculateStringSimilarity(evEntity.value, node.label);
          isMatch = similarity > 0.9;
          score = isMatch ? 0.9 : 0;
        }

        // Mobile match
        if (evEntity.type === 'mobile' && node.type === 'mobile') {
          const normalizedEv = evEntity.value.replace(/[\s.-]/g, '');
          const normalizedNode = node.label.replace(/[\s.-]/g, '');
          isMatch = normalizedEv === normalizedNode;
          score = isMatch ? 0.95 : 0;
        }

        if (score > 0) {
          correlations.push({
            sourceId: node.id,
            targetId: evItem.evidenceId,
            evidenceId: evItem.evidenceId,
            extractedEntity: evEntity,
            score,
            confidence: Math.min(0.95, 0.5 + evEntity.confidence),
            reasoning: [
              `Evidence entity (${evEntity.type}) matches graph node`,
              `Extracted from evidence with ${(evEntity.confidence * 100).toFixed(0)}% confidence`,
            ],
            correlationType: `evidence_${evEntity.type}`,
          });
        }
      });
    });
  });

  return correlations.sort((a, b) => b.score - a.score);
}
