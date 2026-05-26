type GroqMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

declare global {
  interface ImportMetaEnv {
    readonly VITE_GROQ_API_KEY?: string;
    readonly VITE_GROQ_MODEL?: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

const GROQ_API_BASE = 'https://api.groq.com/openai/v1';
const API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';
const MODEL = import.meta.env.VITE_GROQ_MODEL || 'llama-3.3-70b-versatile';

async function groqChat(
  messages: GroqMessage[],
  temperature = 0.7,
  maxTokens = 420,
) {
  if (!API_KEY) {
    throw new Error('Groq API key is missing');
  }

  const response = await fetch(`${GROQ_API_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature,
      top_p: 0.92,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const data = await response.json();
  // Groq/OpenAI chat responses may appear as `choices[0].message.content` or
  // fallback to `choices[0].text` in some compatibility layers. Safely handle both.
  const choice = data?.choices?.[0] ?? null;
  const content = choice?.message?.content ?? choice?.text ?? choice?.content ?? '';
  return (typeof content === 'string' ? content.trim() : '') || '';
}

export { groqChat };
export type { GroqMessage };
