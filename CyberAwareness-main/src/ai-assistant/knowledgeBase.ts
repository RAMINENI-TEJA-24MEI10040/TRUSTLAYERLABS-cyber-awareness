import { phishingData } from './data/phishing';
import { qrScamsData } from './data/qrScams';
import { deepfakeData } from './data/deepfake';
import { cyberLawData } from './data/cyberLaw';
import { reportingData } from './data/reporting';
import { otpFraudData } from './data/otpFraud';
import { upiFraudData } from './data/upiFraud';
import { socialEngineeringData } from './data/socialEngineering';

export type KnowledgeChunk = {
  id: string;
  title: string;
  text: string;
  source: string;
  keywords?: string[];
  category?: string;
};

// Route-to-dataset mapping
const CONTEXT_MAPPING: Record<string, string[]> = {
  '/phishing': ['phishing', 'otp', 'social'],
  '/qr': ['qr', 'upi'],
  '/deepfake': ['deepfake'],
  '/laws': ['law', 'reporting'],
  '/reporting': ['reporting'],
  '/awareness': ['phishing', 'qr', 'upi', 'otp', 'social', 'deepfake'],
  'general': ['phishing', 'qr', 'upi', 'otp', 'social', 'deepfake', 'law', 'reporting'],
};

// Unified knowledge base with categories
const knowledgeBase: KnowledgeChunk[] = [
  ...phishingData.map(e => ({ ...e, source: 'Phishing Module', category: 'phishing' })),
  ...qrScamsData.map(e => ({ ...e, source: 'QR Scams Module', category: 'qr' })),
  ...deepfakeData.map(e => ({ ...e, source: 'Deepfake Module', category: 'deepfake' })),
  ...cyberLawData.map(e => ({ ...e, source: 'Cyber Law Module', category: 'law' })),
  ...reportingData.map(e => ({ ...e, source: 'Reporting Module', category: 'reporting' })),
  ...otpFraudData.map(e => ({ ...e, source: 'OTP Fraud Module', category: 'otp' })),
  ...upiFraudData.map(e => ({ ...e, source: 'UPI Fraud Module', category: 'upi' })),
  ...socialEngineeringData.map(e => ({ ...e, source: 'Social Engineering Module', category: 'social' })),
];

function tokenize(text: string): string[] {
  return text.toLowerCase().match(/[a-z0-9]+/g) ?? [];
}

function scoreChunk(queryTokens: string[], chunk: KnowledgeChunk): number {
  const titleTokens = tokenize(chunk.title);
  const textTokens = tokenize(chunk.text);
  const keywordTokens = chunk.keywords ? chunk.keywords.map(k => tokenize(k)).flat() : [];

  let score = 0;
  for (const token of queryTokens) {
    // Exact keyword match (highest priority)
    if (chunk.keywords?.includes(token)) {
      score += 3;
    }
    // Title match (high priority)
    else if (titleTokens.includes(token)) {
      score += 2;
    }
    // Keyword match (medium priority)
    else if (keywordTokens.includes(token)) {
      score += 1.5;
    }
    // Text match (base priority)
    else if (textTokens.includes(token)) {
      score += 0.8;
    }
  }
  return score;
}

// Filter knowledge base by context
function filterByContext(context: string): KnowledgeChunk[] {
  const categories = CONTEXT_MAPPING[context] || CONTEXT_MAPPING['general'];
  return knowledgeBase.filter(chunk => 
    chunk.category && categories.includes(chunk.category)
  );
}

// Search with context awareness
export function searchKnowledgeBase(query: string, context?: string): KnowledgeChunk[] {
  const queryTokens = tokenize(query);
  const contextBase = context ? filterByContext(context) : knowledgeBase;

  return contextBase
    .map((chunk) => ({ ...chunk, score: scoreChunk(queryTokens, chunk) }))
    .filter((chunk) => chunk.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3); // Limit to 2-3 entries
}

// Build knowledge context for prompt
export function buildKnowledgeContext(query: string, context?: string): string {
  const hits = searchKnowledgeBase(query, context);
  if (hits.length === 0) {
    return 'No direct local knowledge match was found. Use general cyber safety guidance.';
  }

  return hits
    .map((hit) => `• ${hit.title}: ${hit.text}`)
    .join('\n\n');
}

export function getKnowledgeBase(): KnowledgeChunk[] {
  return knowledgeBase;
}

