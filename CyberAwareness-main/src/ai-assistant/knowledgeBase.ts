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
  '/awareness': ['phishing', 'qr', 'upi', 'otp', 'social', 'deepfake', 'crypto', 'ransomware', 'sextortion', 'ai-voice', 'fake-job'],
  'general': ['phishing', 'qr', 'upi', 'otp', 'social', 'deepfake', 'crypto', 'ransomware', 'sextortion', 'ai-voice', 'fake-job', 'law', 'reporting'],
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
  {
    id: 'crypto-scam-guide',
    title: 'Crypto scam warning signs',
    text: 'Crypto scams often promise guaranteed returns, ask for seed phrases or private keys, or push fake wallet transfers and “airdrop” rewards. Verify every exchange and wallet through official apps only.',
    source: 'Core Threat Guide',
    keywords: ['crypto', 'bitcoin', 'ethereum', 'wallet', 'seed phrase', 'private key', 'airdrop', 'token', 'web3'],
    category: 'crypto',
  },
  {
    id: 'ransomware-guide',
    title: 'Ransomware response basics',
    text: 'Ransomware locks files or devices and demands payment. Disconnect the affected system, avoid paying the attacker, preserve evidence, and use clean backups or incident response support.',
    source: 'Core Threat Guide',
    keywords: ['ransomware', 'locked files', 'ransom', 'decrypt', 'malware'],
    category: 'ransomware',
  },
  {
    id: 'sextortion-guide',
    title: 'Sextortion warning signs',
    text: 'Sextortion uses intimate photos, fake video calls, or threats to leak images unless money is paid. Stop contact, save evidence, block the sender, and report immediately.',
    source: 'Core Threat Guide',
    keywords: ['sextortion', 'blackmail', 'explicit', 'nude', 'private photos', 'leak'],
    category: 'sextortion',
  },
  {
    id: 'ai-voice-guide',
    title: 'AI voice scam warning signs',
    text: 'Voice-clone scams imitate a boss, relative, or customer support agent to force quick payment or data sharing. Verify through a second channel before acting on urgent voice requests.',
    source: 'Core Threat Guide',
    keywords: ['ai voice', 'voice clone', 'deepfake voice', 'audio deepfake', 'synthetic voice'],
    category: 'ai-voice',
  },
  {
    id: 'fake-job-guide',
    title: 'Fake job scam warning signs',
    text: 'Fake job scams advertise easy money, ask for registration or training fees, or move the conversation to chat apps. Check the company website, official careers page, and email domain before sharing data.',
    source: 'Core Threat Guide',
    keywords: ['job offer', 'work from home', 'hiring', 'interview fee', 'registration fee', 'training fee', 'telegram job'],
    category: 'fake-job',
  },
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

