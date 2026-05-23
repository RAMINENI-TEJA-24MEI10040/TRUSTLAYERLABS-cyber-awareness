import { useEffect, useMemo, useRef, useState } from 'react';
import { detectScam } from './heuristics';
import { detectContext } from './contextDetection';
import { useAssistant } from './assistantStore';

export default function ChatWidget() {
  const [input, setInput] = useState('');
  const [context, setContext] = useState(detectContext(window.location.pathname));
  const { messages, loading, open, closeAssistant, toggleAssistant, sendMessage } = useAssistant();
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Update context when route changes
  useEffect(() => {
    const handleLocationChange = () => {
      setContext(detectContext(window.location.pathname));
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  useEffect(() => {
    if (open) {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, open]);

  const hint = useMemo(() => {
    const detection = detectScam(input);
    return detection
      ? `${detection.summary} likely detected. Confidence ${Math.round(detection.confidence * 100)}%.`
      : '';
  }, [input]);

  async function send(textOverride?: string) {
    const text = (textOverride ?? input).trim();
    if (!text || loading) return;
    setInput('');
    await sendMessage(text);
  }

  return (
    <div className="fixed right-4 bottom-4 z-[100] sm:right-6 sm:bottom-6">
      <button
        aria-label="Open AI Guidance Assistant"
        onClick={toggleAssistant}
        className="h-14 w-14 rounded-full border border-cyan-300/20 bg-gradient-to-br from-cyan-400 to-sky-500 text-slate-950 shadow-2xl shadow-cyan-500/20 flex items-center justify-center text-2xl hover:scale-105 transition-transform"
      >
        🤖
      </button>

      {open && (
        <div className="absolute bottom-16 right-0 w-[min(92vw,360px)] overflow-hidden rounded-[24px] border border-gray-200 bg-white shadow-[0_20px_80px_rgba(0,0,0,0.12)] dark:border-white/10 dark:bg-slate-950 dark:shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/5 bg-slate-100 dark:bg-slate-900 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-cyan-400/15 flex items-center justify-center text-lg">🤖</div>
              <div className="min-w-0">
                <div className="text-sm font-semibold leading-tight text-gray-900 dark:text-white">AI Guidance Assistant</div>
                <div className="text-xs text-cyan-300/70">On: {context.topic || context.type}</div>
              </div>
            </div>
            <button onClick={closeAssistant} className="rounded-full px-2.5 py-1.5 text-slate-300 hover:bg-white/5">✕</button>
          </div>

          <div ref={scrollRef} className="max-h-[46vh] overflow-auto px-3 py-3 space-y-3">
            {messages.slice(-6).map((message) => (
              <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[92%] rounded-2xl border px-3 py-2.5 leading-relaxed whitespace-pre-wrap text-[13px] ${message.role === 'user' ? 'bg-cyan-400 text-slate-950 border-cyan-300/20' : 'bg-white dark:bg-slate-900/90 text-gray-900 dark:text-slate-100 border-gray-200 dark:border-white/5'}`}>
                  {message.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-slate-900/90 px-3 py-2.5 text-[13px] text-gray-600 dark:text-slate-400">
                  Checking the safest response...
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 dark:border-white/5 px-3 py-3">
            <div className="flex items-end gap-2 rounded-2xl border border-gray-200 dark:border-white/6 bg-white dark:bg-slate-950/80 px-3 py-3 shadow-inner shadow-black/10 dark:shadow-black/20">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                rows={2}
                placeholder="Ask a question..."
                className="min-h-[44px] flex-1 resize-none bg-transparent text-[13px] text-gray-900 dark:text-white outline-none placeholder:text-gray-500 dark:placeholder:text-slate-500"
              />
              <button
                onClick={() => send()}
                disabled={loading}
                className="rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 px-4 py-2.5 text-[13px] font-semibold text-slate-950 transition-transform hover:scale-[1.01] disabled:opacity-60 disabled:hover:scale-100"
              >
                Send
              </button>
            </div>
            {hint ? <div className="mt-2 text-[11px] text-cyan-500/80">{hint}</div> : null}
          </div>
        </div>
      )}
    </div>
  );
}
