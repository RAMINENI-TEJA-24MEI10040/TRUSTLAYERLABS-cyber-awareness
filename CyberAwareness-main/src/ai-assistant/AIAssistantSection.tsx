import { useMemo, useState } from 'react';
import { useAssistant } from './assistantStore';
import { detectScam } from './heuristics';

const featureCards = [
  {
    title: 'AI chatbot for cyber guidance',
    text: 'Ask about a suspicious message, payment request, or cyber issue and get a practical reply in plain language.',
  },
  {
    title: 'Awareness-based question answering',
    text: 'Answers are grounded in the awareness guide, so the assistant can explain phishing, UPI fraud, QR scams, deepfakes, and identity theft.',
  },
  {
    title: 'Scam detection guidance',
    text: 'The assistant checks for patterns like OTP requests, fake job offers, screen-sharing prompts, and payment traps before answering.',
  },
  {
    title: 'Safety recommendations',
    text: 'It always keeps the next step clear: stop, verify, preserve evidence, call 1930, or report at cybercrime.gov.in when needed.',
  },
];

function formatRole(role: string) {
  return role === 'user' ? 'You' : 'Assistant';
}

export default function AIAssistantSection() {
  const { messages, loading, sendMessage } = useAssistant();
  const [draft, setDraft] = useState('');

  const hint = useMemo(() => {
    const detection = detectScam(draft);
    return detection
      ? `${detection.summary} likely detected. Confidence ${Math.round(detection.confidence * 100)}%.`
      : 'Type a question or paste suspicious text, then send it here or from the widget.';
  }, [draft]);

  async function send(textOverride?: string) {
    const text = (textOverride ?? draft).trim();
    if (!text || loading) return;
    setDraft('');
    await sendMessage(text);
  }

  return (
    <section id="ai-assistant" className="py-16 bg-white text-gray-900 dark:bg-slate-950 dark:text-white scroll-mt-24 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          <p className="text-[11px] uppercase tracking-[0.28em] text-cyan-300/80 mb-3">AI Guidance Assistant</p>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-4">Ask cyber questions here and keep the widget synced.</h2>
          <p className="text-slate-300 text-sm md:text-base leading-7 max-w-3xl">
            Use the top AI Guidance button to jump here. You can ask a question on this page or from the floating widget and both will show the same conversation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-3 mt-8">
          {featureCards.map((card) => (
            <div key={card.title} className="rounded-2xl border border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900/70 p-4 transition-colors duration-300">
              <h3 className="text-sm font-semibold text-cyan-700 dark:text-cyan-100 mb-1.5">{card.title}</h3>
              <p className="text-xs md:text-sm leading-6 text-gray-600 dark:text-slate-400">{card.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-[1.75rem] border border-cyan-500/10 bg-white dark:bg-slate-900/95 p-4 md:p-5 shadow-[0_18px_60px_rgba(0,0,0,0.08)] dark:shadow-[0_18px_60px_rgba(0,0,0,0.25)] transition-colors duration-300">
          <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-3">
            <div>
              <h3 className="text-xl font-semibold">Ask here</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Paste suspicious text or ask a cyber safety question. The assistant will flag scam patterns and suggest the safest next step.
              </p>
            </div>
            <div className="hidden rounded-full border border-slate-700 px-3 py-1.5 text-xs text-slate-400 md:block">
              Synced with widget
            </div>
          </div>

          <div className="mt-4 rounded-[1.5rem] border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950/70 p-3 md:p-4 transition-colors duration-300">
            <div className="max-h-[20rem] space-y-3 overflow-auto pr-1 md:max-h-[22rem]">
              {messages.slice(-8).map((message) => (
                <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[92%] rounded-3xl border px-3 py-2.5 leading-relaxed whitespace-pre-wrap text-[13px] sm:text-sm shadow-sm ${message.role === 'user' ? 'bg-cyan-400 text-slate-950 border-cyan-300/20' : 'bg-white dark:bg-slate-900/90 text-gray-900 dark:text-slate-100 border-gray-200 dark:border-white/5'}`}>
                    <div className="mb-1 text-[10px] uppercase tracking-[0.22em] text-gray-500 dark:text-slate-400">{formatRole(message.role)}</div>
                    {message.text}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-3xl border border-gray-200 dark:border-white/5 bg-white dark:bg-slate-900/90 px-3 py-2.5 text-[13px] text-gray-600 dark:text-slate-400">
                    Thinking about the safest response...
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-950/85 p-3 transition-colors duration-300">
              <div className="flex flex-col gap-3 md:flex-row md:items-stretch">
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                  rows={3}
                  placeholder="Type your question here..."
                  className="min-h-[92px] flex-1 resize-none rounded-2xl border border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-950 px-4 py-3 text-sm leading-6 text-gray-900 dark:text-white outline-none placeholder:text-gray-500 dark:placeholder:text-slate-500 focus:border-cyan-400/40"
                />
                <button
                  onClick={() => send()}
                  disabled={loading}
                  className="inline-flex min-h-[92px] items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-400 to-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition-transform hover:scale-[1.01] disabled:opacity-60 disabled:hover:scale-100 md:w-40"
                >
                  Send to assistant
                </button>
              </div>
              <div className="mt-2 flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                <p className="text-[11px] text-gray-500 dark:text-slate-300 md:max-w-[60%]">{hint}</p>
                <p className="text-[11px] text-gray-500 dark:text-slate-400">Press Enter to send, Shift+Enter for a new line.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
