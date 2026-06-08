/**
 * Evidence Risk Engine
 * Calculates risk scores and confidence levels for evidence items
 */

import { ExtractedEntity, extractEntitiesFromEvidence } from './entityExtraction';

export interface EvidenceRiskAssessment {
  evidenceId: string;
  risk: number; // 0-1, higher = more risky
  confidence: number; // 0-1, higher = more confident in assessment
  reasons: string[];
  riskLevel: 'critical' | 'high' | 'medium' | 'low' | 'info';
  suspiciousEntities: Array<{
    entity: ExtractedEntity;
    riskScore: number;
    reason: string;
  }>;
}

// Suspicious patterns and keywords
const SUSPICIOUS_PATTERNS = {
  phishing: /(?:verify|confirm|urgent|action required|click here|update|confirm identity|re-confirm|suspended|disabled|limited access)/gi,
  malware: /(?:malware|trojan|ransomware|rootkit|backdoor|worm|botnet|exploit|vulnerability|zero-day)/gi,
  fraud: /(?:refund|wire transfer|payment|bitcoin|crypto|transfer|urgent payment|account|tax refund|lottery|prize)/gi,
  scam: /(?:scam|fraud|fake|impersonate|pretend|trick|deceive|stolen|hacked|compromised)/gi,
  darkWeb: /(?:tor|dark web|darknet|hidden service|onion|anonymity|untraceable)/gi,
  maliciousDomain: /(?:bit\.ly|tinyurl|goo\.gl|short\.link|free|temporary|disposable)/gi,
};

// Burner/disposable email domains
const BURNER_EMAIL_DOMAINS = new Set([
  'tempmail.com',
  '10minutemail.com',
  'throwaway.email',
  'mailinator.com',
  'spam4.me',
  'yopmail.com',
  'sharklasers.com',
  'trashmail.de',
  'fakeinbox.com',
  'guerrillamail.com',
  'maildrop.cc',
  'temp-mail.org',
  'tempmail.net',
  'temp-mail.io',
  'throwawaymail.com',
  'guerrillamail.info',
  'mailnesia.com',
  'temp-mail.co',
  'maildrop.cc',
]);

/**
 * Assess entity risk based on type and value
 */
function assessEntityRisk(entity: ExtractedEntity): { risk: number; reason: string } {
  let risk = 0;
  const reasons: string[] = [];

  switch (entity.type) {
    case 'email': {
      // Check if burner/disposable email
      const domain = entity.value.split('@')[1]?.toLowerCase();
      if (domain && BURNER_EMAIL_DOMAINS.has(domain)) {
        risk += 0.7;
        reasons.push(`Disposable email domain: ${domain}`);
      }
      // Check for suspicious patterns in local part
      if (/^(?:noreply|no-reply|donotreply|test|fake|spam|temp)@/i.test(entity.value)) {
        risk += 0.3;
        reasons.push('Suspicious email pattern');
      }
      break;
    }

    case 'domain': {
      // Check for suspicious TLDs
      const tld = entity.value.split('.').pop()?.toLowerCase();
      const suspiciousTLDs = ['xyz', 'tk', 'ml', 'ga', 'click', 'download'];
      if (tld && suspiciousTLDs.includes(tld)) {
        risk += 0.4;
        reasons.push(`Suspicious TLD: ${tld}`);
      }
      // Check for URL shorteners
      if (/^(?:bit\.ly|tinyurl|goo\.gl|short\.link|ow\.ly|tiny\.cc)/.test(entity.value)) {
        risk += 0.5;
        reasons.push('URL shortener - destination unknown');
      }
      break;
    }

    case 'ip': {
      // Check for VPN/Proxy IPs (rough heuristic)
      const parts = entity.value.split('.').map((p) => parseInt(p, 10));
      // Data center IP ranges (common for VPN/proxies) - simplified check
      if ((parts[0] === 1 && parts[1] >= 1) || (parts[0] >= 45 && parts[0] <= 50)) {
        risk += 0.3;
        reasons.push('Possible data center/VPN IP');
      }
      break;
    }

    case 'wallet': {
      // Wallets on chain are inherently associated with transactions
      risk += 0.4;
      reasons.push('Cryptocurrency wallet address');
      break;
    }

    case 'mobile': {
      // Mobile numbers are lower risk by themselves
      risk += 0.1;
      break;
    }

    case 'username': {
      // Check for suspicious patterns in username
      if (/(?:admin|root|test|fake|temp|bot)/.test(entity.value.toLowerCase())) {
        risk += 0.2;
        reasons.push('Suspicious username pattern');
      }
      break;
    }
  }

  return { risk: Math.min(risk, 1), reason: reasons.join('; ') || 'No specific risk factors' };
}

/**
 * Score content for suspicious keywords
 */
function scoreContentSuspicion(content: string): { score: number; matches: string[] } {
  let totalScore = 0;
  const matches: string[] = [];

  Object.entries(SUSPICIOUS_PATTERNS).forEach(([category, pattern]) => {
    const found = content.match(pattern) || [];
    if (found.length > 0) {
      const categoryScore = Math.min(found.length * 0.1, 0.3);
      totalScore += categoryScore;
      matches.push(`${category} (${found.length} instances)`);
    }
  });

  return { score: Math.min(totalScore, 1), matches };
}

/**
 * Assess entity reuse risk
 */
function assessEntityReuseRisk(entity: ExtractedEntity, allExtractions: Array<{ evidenceId: string; entities: ExtractedEntity[] }>): number {
  const reusedCount = allExtractions.filter((ex) => ex.entities.some((e) => e.type === entity.type && e.value.toLowerCase() === entity.value.toLowerCase())).length;

  // High reuse indicates shared infrastructure (fraud ring)
  if (reusedCount > 1) {
    return Math.min(0.2 + (reusedCount - 1) * 0.1, 0.6);
  }

  return 0;
}

/**
 * Calculate overall evidence risk assessment
 */
export function assessEvidenceRisk(
  evidenceId: string,
  evidenceContent: unknown,
  evidenceTitle?: string,
  allExtractions?: Array<{ evidenceId: string; entities: ExtractedEntity[] }>,
): EvidenceRiskAssessment {
  // Convert content to string
  const contentStr = typeof evidenceContent === 'string' ? evidenceContent : JSON.stringify(evidenceContent || '');
  const titleStr = evidenceTitle ? (typeof evidenceTitle === 'string' ? evidenceTitle : JSON.stringify(evidenceTitle)) : '';
  const fullContent = [titleStr, contentStr].join('\n');

  // Extract entities
  const extraction = extractEntitiesFromEvidence(evidenceId, contentStr, titleStr);

  // Score content for suspicious patterns
  const contentSuspicion = scoreContentSuspicion(fullContent);

  // Assess entity risks
  const suspiciousEntities = extraction.entities
    .map((entity) => {
      const entityRisk = assessEntityRisk(entity);
      const reuseRisk = allExtractions ? assessEntityReuseRisk(entity, allExtractions) : 0;
      const totalRisk = Math.min(entityRisk.risk + reuseRisk, 1);

      return {
        entity,
        riskScore: totalRisk,
        reason: entityRisk.reason + (reuseRisk > 0 ? ` (+ entity reuse)` : ''),
      };
    })
    .filter((item) => item.riskScore > 0.1)
    .sort((a, b) => b.riskScore - a.riskScore);

  // Calculate overall risk
  const entityRiskAvg = extraction.entities.length > 0 ? suspiciousEntities.reduce((sum, e) => sum + e.riskScore, 0) / suspiciousEntities.length : 0;
  const contentRisk = contentSuspicion.score;

  // Combine scores
  let overallRisk = Math.min(0.3 * entityRiskAvg + 0.7 * contentRisk, 1);

  // Boost risk if multiple suspicious patterns match
  if (contentSuspicion.matches.length > 2) {
    overallRisk = Math.min(overallRisk + 0.2, 1);
  }

  // Determine risk level
  let riskLevel: 'critical' | 'high' | 'medium' | 'low' | 'info' = 'info';
  if (overallRisk >= 0.8) riskLevel = 'critical';
  else if (overallRisk >= 0.6) riskLevel = 'high';
  else if (overallRisk >= 0.4) riskLevel = 'medium';
  else if (overallRisk >= 0.2) riskLevel = 'low';

  // Build reasons
  const reasons: string[] = [];

  if (contentSuspicion.matches.length > 0) {
    reasons.push(`Suspicious content patterns: ${contentSuspicion.matches.join(', ')}`);
  }

  if (suspiciousEntities.length > 0) {
    reasons.push(`Detected ${suspiciousEntities.length} high-risk entities`);
  }

  if (extraction.summary.emailCount > 5) {
    reasons.push(`Multiple email addresses (${extraction.summary.emailCount})`);
  }

  if (extraction.summary.domainCount > 3) {
    reasons.push(`Multiple domains (${extraction.summary.domainCount})`);
  }

  if (extraction.summary.walletCount > 0) {
    reasons.push(`Contains cryptocurrency wallet(s)`);
  }

  if (extraction.summary.mobileCount > 2) {
    reasons.push(`Multiple phone numbers (${extraction.summary.mobileCount})`);
  }

  if (reasons.length === 0) {
    reasons.push('No significant risk factors detected');
  }

  return {
    evidenceId,
    risk: overallRisk,
    confidence: Math.min(0.5 + extraction.entities.length * 0.05, 0.95), // More entities = higher confidence
    reasons,
    riskLevel,
    suspiciousEntities: suspiciousEntities.slice(0, 5), // Top 5 risky entities
  };
}

/**
 * Batch assess multiple evidence items
 */
export function batchAssessEvidenceRisk(
  evidenceItems: Array<{
    id: string;
    title?: string;
    summary?: string;
    raw?: unknown;
  }>,
): Map<string, EvidenceRiskAssessment> {
  // First pass: extract all entities
  const extractions = evidenceItems.map((item) => ({
    evidenceId: item.id,
    entities: extractEntitiesFromEvidence(item.id, item.summary || item.raw, item.title).entities,
  }));

  // Second pass: assess risk with entity reuse context
  const results = new Map<string, EvidenceRiskAssessment>();
  evidenceItems.forEach((item) => {
    const assessment = assessEvidenceRisk(item.id, item.summary || item.raw, item.title, extractions);
    results.set(item.id, assessment);
  });

  return results;
}
