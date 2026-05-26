import { detectScam } from './heuristics';
import { buildKnowledgeContext, searchKnowledgeBase } from './knowledgeBase';
import { groqChat, GroqMessage } from './groqClient';
import { detectContext, type PageContext } from './contextDetection';
import { buildContextualSystemPrompt } from './contextualPrompts';

type AssistantResult = {
  reply: string;
  sources: ReturnType<typeof searchKnowledgeBase>;
  signal: ReturnType<typeof detectScam>;
};

function getContextFromPage(): PageContext {
  if (typeof window !== 'undefined') {
    return detectContext(window.location.pathname);
  }
  return { type: 'general', path: '/' };
}

// Map PageContext to knowledge base route
function getKnowledgeRoute(context: PageContext): string {
  switch (context.type) {
    case 'phishing':
      return '/phishing';
    case 'qr-scam':
      return '/qr';
    case 'deepfake':
      return '/deepfake';
    case 'cyber-law':
      return '/laws';
    case 'reporting':
      return '/reporting';
    case 'awareness':
      return '/awareness';
    default:
      return 'general';
  }
}

function buildUserPrompt(query: string, context: PageContext) {
  const signal = detectScam(query);
  const knowledgeRoute = getKnowledgeRoute(context);
  const knowledgeContext = buildKnowledgeContext(query, knowledgeRoute);

  return [
    `User message: ${query}`,
    `Current context: ${context.type}${context.topic ? ` (${context.topic})` : ''}`,
    signal
      ? `Heuristic signal: ${signal.summary} (confidence ${Math.round(signal.confidence * 100)}%). Guidance cues: ${signal.guidance.join(' | ')}`
      : 'Heuristic signal: none detected, but still answer cautiously.',
    `Relevant local knowledge: ${knowledgeContext}`,
    'Respond in 3-5 lines max. Be conversational, actionable, and awareness-focused.',
  ].join('\n\n');
}

async function getAnswer(query: string): Promise<AssistantResult> {
  const context = getContextFromPage();
  const knowledgeRoute = getKnowledgeRoute(context);
  
  const sources = searchKnowledgeBase(query, knowledgeRoute);
  const signal = detectScam(query);

  const systemPrompt = buildContextualSystemPrompt(context.type, context.topic);

  const messages: GroqMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: buildUserPrompt(query, context) },
  ];

  let reply = '';
  try {
    reply = await groqChat(messages, 0.75);
  } catch {
    reply = '';
  }

  // Fallback: Use local knowledge if API fails
  if (!reply) {
    if (sources && sources.length > 0) {
      reply = sources
        .map((h) => `${h.title}: ${h.text}`)
        .join('\n\n');

      if (signal && signal.confidence > 0.6) {
        reply += `\n\n⚠️ This looks like ${signal.summary.toLowerCase()}. Stop interacting, check the sender, and if money or credentials are involved call 1930.`;
      }
    } else {
      const hint = signal
        ? `This looks like a ${signal.summary.toLowerCase()}. Stop interacting, check the sender, and if money or credentials are involved call 1930.`
        : 'Share the suspicious text or describe what happened, and I will help you check the safest next step.';
      reply = hint;
    }
  }

  return { reply, sources, signal };
}

export { getAnswer };
export type { AssistantResult };
