import { createContext, useCallback, useContext, useMemo, useState, useRef, useEffect } from 'react';
import { Message } from './types';
import { getAnswer } from './rag';

type AssistantMessage = Message & { id: string };

type AssistantContextValue = {
  messages: AssistantMessage[];
  loading: boolean;
  open: boolean;
  openAssistant: () => void;
  closeAssistant: () => void;
  toggleAssistant: () => void;
  sendMessage: (text: string) => Promise<void>;
};

const AssistantContext = createContext<AssistantContextValue | null>(null);

function now() {
  return Date.now();
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

const initialMessages: AssistantMessage[] = [
  {
    id: 'sys-1',
    role: 'system',
    text: 'Hi, I can help you check suspicious messages, understand scams, and suggest safe next steps.',
    timestamp: now(),
  },
];

export function AssistantProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<AssistantMessage[]>(initialMessages);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const loadingRef = useRef(loading);

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loadingRef.current) return;

    // Ensure the assistant UI is visible when a message is sent from any page.
    setOpen(true);

    setMessages((current) => [...current, { id: uid(), role: 'user', text: trimmed, timestamp: now() }]);
    setLoading(true);

    try {
      const result = await getAnswer(trimmed);
      setMessages((current) => [...current, { id: uid(), role: 'assistant', text: result.reply, timestamp: now() }]);
    } catch {
      setMessages((current) => [...current, {
        id: uid(),
        role: 'assistant',
        text: 'I could not reach the assistant just now. If this is urgent or financial, call 1930 and report at cybercrime.gov.in.',
        timestamp: now(),
      }]);
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo(() => ({
    messages,
    loading,
    open,
    openAssistant: () => setOpen(true),
    closeAssistant: () => setOpen(false),
    toggleAssistant: () => setOpen((value) => !value),
    sendMessage,
  }), [messages, loading, open, sendMessage]);

  return <AssistantContext.Provider value={value}>{children}</AssistantContext.Provider>;
}

export function useAssistant() {
  const context = useContext(AssistantContext);
  if (!context) {
    throw new Error('useAssistant must be used inside AssistantProvider');
  }
  return context;
}

export type { AssistantMessage };
