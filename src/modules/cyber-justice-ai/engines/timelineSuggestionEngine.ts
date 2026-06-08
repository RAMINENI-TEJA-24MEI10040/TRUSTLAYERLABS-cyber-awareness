import type { ExtractedEntities } from '../../../../CyberAwareness-main/src/sentinel-legal';
import type { CyberJusticeConversationState } from '../types/conversation.types';
import type { EvidenceVaultItem } from '../../../../CyberAwareness-main/src/modules/cyber-justice-ai/types/evidenceVault.types';
import type { TimelineEventSource } from '../../../../CyberAwareness-main/src/modules/cyber-justice-ai/types/timeline.types';

export type TimelineSuggestionStatus = 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'EDITED';

export interface TimelineSuggestion {
  id: string;
  title: string;
  description: string;
  timestamp: string | null;
  source: TimelineEventSource;
  confidenceScore: number;
  reason: string;
  linkedEvidenceIds: string[];
  linkedMessageIds: string[];
  linkedEntityValues: string[];
  status: TimelineSuggestionStatus;
}

export interface TimelineSuggestionInput {
  conversation: CyberJusticeConversationState;
  evidence: EvidenceVaultItem[];
  extractedEntities: ExtractedEntities;
}

function uid(prefix: string, value: string) {
  return `${prefix}-${value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 18)}`;
}

export function generateTimelineSuggestions(input: TimelineSuggestionInput): TimelineSuggestion[] {
  const suggestions: TimelineSuggestion[] = [];
  const narrativeMessage = input.conversation.messages.find((message) => message.role === 'user' && message.content.trim().length > 20);
  const narrativeText = narrativeMessage?.content ?? '';

  const eventPatterns = [
    {
      title: 'Instagram contact established',
      regex: /\binstagram\b/i,
      description: 'The narrative mentions the suspect first contacted the victim through Instagram.',
      confidenceScore: 0.82,
      reason: 'Social media platform was explicitly referenced in the incident report.',
    },
    {
      title: 'Video call interaction occurred',
      regex: /\bvideo\s*call\b/i,
      description: 'A video call happened during the incident.',
      confidenceScore: 0.8,
      reason: 'The user described a video call exchange, which is a key timeline event in sextortion cases.',
    },
    {
      title: 'Recording or footage was captured',
      regex: /\brecording\b|\bfootage\b|\bscreencast\b/i,
      description: 'A recording or similar media was referenced in the incident narrative.',
      confidenceScore: 0.78,
      reason: 'Recording of the victim or interaction can anchor an extortion timeline event.',
    },
    {
      title: 'Threat or extortion demand was issued',
      regex: /\bthreat\b|\bblackmail\b|\bextortion\b|\bdemand\b/i,
      description: 'A direct threat or extortion demand was described by the victim.',
      confidenceScore: 0.86,
      reason: 'Threat language is an important event marker for sextortion timelines.',
    },
    {
      title: 'Payment demand was requested',
      regex: /\b(inr|rs\.?|₹)\s*[0-9][0-9,]*(?:\.\d{1,2})?|asked me to pay|demanding|requested.*payment/i,
      description: 'The user mentioned a monetary demand or amount in the narrative.',
      confidenceScore: 0.8,
      reason: 'Monetary demands are essential to reconstruct the incident timeline.',
    },
  ];

  if (narrativeMessage) {
    suggestions.push({
      id: uid('suggestion-conversation', narrativeMessage.id),
      title: 'Incident described by complainant',
      description: narrativeMessage.content,
      timestamp: narrativeMessage.createdAt,
      source: 'CONVERSATION',
      confidenceScore: 0.72,
      reason: 'The user provided a natural-language incident account.',
      linkedEvidenceIds: [],
      linkedMessageIds: [narrativeMessage.id],
      linkedEntityValues: [],
      status: 'PENDING_APPROVAL',
    });

    eventPatterns.forEach((pattern) => {
      if (!pattern.regex.test(narrativeText)) return;
      suggestions.push({
        id: uid('suggestion-narrative', pattern.title),
        title: pattern.title,
        description: pattern.description,
        timestamp: narrativeMessage.createdAt,
        source: 'CONVERSATION',
        confidenceScore: pattern.confidenceScore,
        reason: pattern.reason,
        linkedEvidenceIds: [],
        linkedMessageIds: [narrativeMessage.id],
        linkedEntityValues: [],
        status: 'PENDING_APPROVAL',
      });
    });
  }

  input.evidence.forEach((item) => {
    suggestions.push({
      id: uid('suggestion-evidence', item.id),
      title: `${item.type.replace(/_/g, ' ')} evidence available`,
      description: `${item.name}: ${item.description || 'Evidence item added to vault.'}`,
      timestamp: item.timestamp,
      source: 'UPLOADED_EVIDENCE',
      confidenceScore: item.verified ? 0.9 : 0.76,
      reason: 'Evidence vault item has a timestamp and can anchor the case timeline.',
      linkedEvidenceIds: [item.id],
      linkedMessageIds: [],
      linkedEntityValues: [],
      status: 'PENDING_APPROVAL',
    });
  });

  const entityGroups = [
    { title: 'UTR/RRN reference identified', values: input.extractedEntities.utrIds },
    { title: 'UPI ID identified', values: input.extractedEntities.upiIds },
    { title: 'Suspicious URL identified', values: input.extractedEntities.urls },
    { title: 'Suspect contact identified', values: [...input.extractedEntities.phoneNumbers, ...input.extractedEntities.emails] },
    { title: 'Wallet ID identified', values: input.extractedEntities.walletAddresses },
  ];

  entityGroups.forEach((group) => {
    if (!group.values.length) return;
    suggestions.push({
      id: uid('suggestion-entity', group.title),
      title: group.title,
      description: group.values.join(', '),
      timestamp: null,
      source: 'EXTRACTED_ENTITY',
      confidenceScore: 0.68,
      reason: 'The deterministic entity extractor found identifiers that may belong on the incident timeline.',
      linkedEvidenceIds: [],
      linkedMessageIds: [],
      linkedEntityValues: group.values,
      status: 'PENDING_APPROVAL',
    });
  });

  const seen = new Set<string>();
  return suggestions.filter((suggestion) => {
    const key = `${suggestion.source}-${suggestion.title}-${suggestion.description}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
