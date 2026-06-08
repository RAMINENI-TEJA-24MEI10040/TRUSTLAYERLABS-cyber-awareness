import { IntelligenceResult, QuerySource } from '../types/ciw.types';

/**
 * Intelligence Normalizer
 * 
 * Normalizes all OSINT intelligence sources into a uniform IntelligenceResult format.
 * This module ensures consistency across all collectors and enables seamless integration
 * with the correlation engine, cluster detection, and graph builder.
 */

export interface EnrichedIntelligence {
  result: IntelligenceResult;
  confidence: number; // 0-1 scale
  recommendation: 'investigate' | 'monitor' | 'whitelisted' | 'none';
  relatedEntities: string[]; // Other entities mentioned in this result
  tags: string[];
}

/**
 * Normalize score to 0-100 range
 */
function normalizeScore(value: unknown): number {
  if (typeof value === 'number') {
    return Math.max(0, Math.min(100, Math.round(value)));
  }
  return 0;
}

/**
 * Calculate confidence score based on data completeness and source reliability
 */
function calculateConfidence(result: IntelligenceResult): number {
  let confidence = 0.5; // Base confidence

  // Increase confidence based on number of data sources
  confidence += result.meta.length * 0.1;

  // Increase confidence if result has a score
  if (result.score !== undefined) confidence += 0.15;

  // Increase confidence if result has summary
  if (result.summary) confidence += 0.1;

  // Increase confidence for known reliable sources
  const reliableSources = ['hibp', 'virustotal', 'abuseipdb', 'github', 'crt.sh', 'rdap'];
  const hasReliableSource = result.meta.some((m) =>
    reliableSources.some((s) => m.sourceName.toLowerCase().includes(s))
  );
  if (hasReliableSource) confidence += 0.15;

  return Math.min(1, confidence);
}

/**
 * Extract related entities from intelligence result
 */
function extractRelatedEntities(result: IntelligenceResult): string[] {
  const entities = new Set<string>();

  // Extract from title and summary
  const text = `${result.title} ${result.summary || ''}`.toLowerCase();

  // Email pattern
  const emailMatches = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);
  if (emailMatches) emailMatches.forEach((e) => entities.add(e));

  // Domain pattern
  const domainMatches = text.match(/(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}/gi);
  if (domainMatches) domainMatches.forEach((d) => entities.add(d.toLowerCase()));

  // IP pattern
  const ipMatches = text.match(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g);
  if (ipMatches) ipMatches.forEach((ip) => entities.add(ip));

  // URL pattern
  const urlMatches = text.match(/https?:\/\/[^\s]+/gi);
  if (urlMatches) urlMatches.forEach((url) => entities.add(url));

  return Array.from(entities);
}

/**
 * Generate recommendation based on score and source type
 */
function generateRecommendation(
  result: IntelligenceResult,
  score: number
): 'investigate' | 'monitor' | 'whitelisted' | 'none' {
  // High risk sources require investigation
  if (score >= 70) return 'investigate';

  // Medium risk sources require monitoring
  if (score >= 40) return 'monitor';

  // Low risk or verified sources are whitelisted
  if (score < 20) return 'whitelisted';

  return 'none';
}

/**
 * Generate tags based on result characteristics
 */
function generateTags(result: IntelligenceResult, score: number, sourceType: QuerySource): string[] {
  const tags: string[] = [];

  // Risk level tags
  if (score >= 70) tags.push('high-risk');
  if (score >= 40 && score < 70) tags.push('medium-risk');
  if (score < 40) tags.push('low-risk');

  // Source type tags
  tags.push(`source:${sourceType}`);

  // Data completeness tags
  if (result.meta.length >= 3) tags.push('multi-source');
  if (result.meta.length === 1) tags.push('single-source');

  // Content analysis tags
  const text = `${result.title} ${result.summary || ''}`.toLowerCase();
  if (text.includes('breach')) tags.push('breach');
  if (text.includes('phishing')) tags.push('phishing');
  if (text.includes('malware')) tags.push('malware');
  if (text.includes('trojan')) tags.push('trojan');
  if (text.includes('ransomware')) tags.push('ransomware');
  if (text.includes('botnet')) tags.push('botnet');
  if (text.includes('fraud')) tags.push('fraud');

  return tags;
}

/**
 * Normalize an IntelligenceResult into an EnrichedIntelligence object
 */
export function normalizeResult(result: IntelligenceResult): EnrichedIntelligence {
  const normalizedScore = normalizeScore(result.score);
  const confidence = calculateConfidence(result);
  const recommendation = generateRecommendation(result, normalizedScore);
  const relatedEntities = extractRelatedEntities(result);
  const tags = generateTags(result, normalizedScore, result.source);

  // Ensure score is normalized
  const normalizedResult = {
    ...result,
    score: normalizedScore,
  };

  return {
    result: normalizedResult,
    confidence,
    recommendation,
    relatedEntities,
    tags,
  };
}

/**
 * Normalize multiple results
 */
export function normalizeResults(results: IntelligenceResult[]): EnrichedIntelligence[] {
  return results.map(normalizeResult);
}

/**
 * Merge duplicate or similar results
 */
export function mergeResults(results: IntelligenceResult[]): IntelligenceResult[] {
  const merged = new Map<string, IntelligenceResult>();

  for (const result of results) {
    const key = `${result.source}:${result.title}`;
    const existing = merged.get(key);

    if (!existing) {
      merged.set(key, result);
    } else {
      // Merge metadata
      const existingMeta = new Set(existing.meta.map((m) => m.sourceName));
      const newMeta = result.meta.filter((m) => !existingMeta.has(m.sourceName));

      existing.meta.push(...newMeta);

      // Take higher score
      if (result.score && (!existing.score || result.score > existing.score)) {
        existing.score = result.score;
      }

      // Combine summaries
      if (result.summary && !existing.summary) {
        existing.summary = result.summary;
      }
    }
  }

  return Array.from(merged.values());
}

/**
 * Filter results based on confidence and recommendation
 */
export function filterResults(
  results: EnrichedIntelligence[],
  minConfidence: number = 0.5,
  includeRecommendations: string[] = ['investigate', 'monitor']
): EnrichedIntelligence[] {
  return results.filter(
    (e) => e.confidence >= minConfidence && includeRecommendations.includes(e.recommendation)
  );
}

/**
 * Aggregate enriched results into a summary
 */
export function aggregateResults(results: EnrichedIntelligence[]) {
  return {
    totalResults: results.length,
    byRisk: {
      highRisk: results.filter((r) => r.result.score! >= 70).length,
      mediumRisk: results.filter((r) => r.result.score! >= 40 && r.result.score! < 70).length,
      lowRisk: results.filter((r) => r.result.score! < 40).length,
    },
    bySource: Object.fromEntries(
      Array.from(
        new Map(results.map((r) => [r.result.source, (prev: number) => prev + 1]))
      )
    ),
    byRecommendation: Object.fromEntries(
      Array.from(
        new Map(
          results.map((r) => [
            r.recommendation,
            (prev: number) => prev + 1,
          ])
        )
      )
    ),
    averageConfidence: results.length > 0 ? results.reduce((sum, r) => sum + r.confidence, 0) / results.length : 0,
    allTags: Array.from(new Set(results.flatMap((r) => r.tags))),
    allEntities: Array.from(new Set(results.flatMap((r) => r.relatedEntities))),
  };
}

export default {
  normalizeResult,
  normalizeResults,
  mergeResults,
  filterResults,
  aggregateResults,
};
