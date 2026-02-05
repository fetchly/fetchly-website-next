'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export interface LiveChatMessage {
  id: string;
  body: string;
  sender: 'admin' | 'visitor';
  timestamp: string;
}

export interface UseLiveChatReturn {
  /** Show the bubble (true once admin has initiated at least once) */
  visible: boolean;
  /** Chat panel is expanded */
  panelOpen: boolean;
  /** Chat is active (admin initiated, not yet ended) */
  chatActive: boolean;
  messages: LiveChatMessage[];
  send: (body: string) => void;
  togglePanel: () => void;
  /** True if messages were restored from sessionStorage */
  hasHistory: boolean;
}

type TrackerChat = {
  send(body: string): void;
  on(event: string, handler: (...args: any[]) => void): () => void;
};

// ── sessionStorage helpers (following src/lib/utm.ts pattern) ──

const STATE_KEY = 'fetchly_chat_state';
const MESSAGES_KEY = 'fetchly_chat_messages';
const MAX_MESSAGES = 100;
const DEBUG = process.env.NODE_ENV === 'development';

function log(...args: unknown[]) {
  if (DEBUG) console.log('[LiveChat]', ...args);
}

interface PersistedChatState {
  hasReceivedMessages: boolean;
  chatActive: boolean;
}

function loadChatState(): PersistedChatState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(STATE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      typeof parsed.hasReceivedMessages === 'boolean' &&
      typeof parsed.chatActive === 'boolean'
    ) {
      return parsed as PersistedChatState;
    }
    return null;
  } catch {
    return null;
  }
}

function saveChatState(state: PersistedChatState): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(STATE_KEY, JSON.stringify(state));
  } catch {
    // sessionStorage unavailable
  }
}

function isValidMessage(m: unknown): m is LiveChatMessage {
  return (
    typeof m === 'object' &&
    m !== null &&
    typeof (m as any).id === 'string' &&
    typeof (m as any).body === 'string' &&
    ((m as any).sender === 'admin' || (m as any).sender === 'visitor') &&
    typeof (m as any).timestamp === 'string'
  );
}

function loadChatMessages(): LiveChatMessage[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = sessionStorage.getItem(MESSAGES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidMessage);
  } catch {
    return [];
  }
}

function saveChatMessages(messages: LiveChatMessage[]): void {
  if (typeof window === 'undefined') return;
  try {
    const capped = messages.slice(-MAX_MESSAGES);
    sessionStorage.setItem(MESSAGES_KEY, JSON.stringify(capped));
  } catch {
    // sessionStorage unavailable
  }
}

// ── Tracker access ──

function getTracker(): TrackerChat | null {
  return (window as any).__FLS_TRACKER__?.chat ?? null;
}

// Counter for unique fallback IDs within a session
let msgCounter = 0;

export function useLiveChat(): UseLiveChatReturn {
  const [hasHistory, setHasHistory] = useState(false);
  const [visible, setVisible] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [chatActive, setChatActive] = useState(false);
  const [messages, setMessages] = useState<LiveChatMessage[]>([]);
  const chatRef = useRef<TrackerChat | null>(null);
  const hydratedRef = useRef(false);
  const pendingMessagesRef = useRef<string[]>([]);

  // Hydrate from sessionStorage after mount (avoids SSR mismatch)
  useEffect(() => {
    log('Hydrating from sessionStorage...');
    const state = loadChatState();
    const restored = loadChatMessages();
    log('Restored state:', state, 'messages:', restored.length);

    if (state?.hasReceivedMessages) setVisible(true);
    if (state?.chatActive) setChatActive(true);
    if (restored.length > 0) {
      // Functional update: merge with any messages the tracker already delivered
      setMessages(prev => {
        if (prev.length === 0) return restored;
        const ids = new Set(prev.map(m => m.id));
        const merged = [...prev];
        for (const m of restored) {
          if (!ids.has(m.id)) merged.push(m);
        }
        return merged;
      });
      setHasHistory(true);
    }
    hydratedRef.current = true;
  }, []);

  // Persist state + messages to sessionStorage on change
  useEffect(() => {
    if (!hydratedRef.current) return;
    if (!visible && messages.length === 0) return;
    log('Persisting to sessionStorage:', { visible, chatActive, messageCount: messages.length });
    saveChatState({ hasReceivedMessages: visible, chatActive });
    saveChatMessages(messages);
  }, [visible, chatActive, messages]);

  // Subscribe to tracker WebSocket events
  useEffect(() => {
    let disposed = false;
    const unsubs: Array<() => void> = [];

    log('Starting tracker discovery...');

    const poll = setInterval(() => {
      const chat = getTracker();
      if (!chat || disposed) return;

      clearInterval(poll);
      chatRef.current = chat;
      log('Tracker found, subscribing to events');

      // Flush any messages queued before tracker was ready
      if (pendingMessagesRef.current.length > 0) {
        log('Flushing', pendingMessagesRef.current.length, 'pending messages');
        pendingMessagesRef.current.forEach(body => chat.send(body));
        pendingMessagesRef.current = [];
      }

      unsubs.push(chat.on('chat_initiated', () => {
        log('Event: chat_initiated');
        setVisible(true);
        setPanelOpen(true);
        setChatActive(true);
      }));

      unsubs.push(chat.on('chat_message', (msg: any) => {
        log('Event: chat_message', msg);
        const newMsg: LiveChatMessage = {
          id: msg.messageId || `msg-${Date.now()}-${++msgCounter}`,
          body: msg.body,
          sender: msg.sender || 'admin',
          timestamp: msg.timestamp || new Date().toISOString(),
        };
        setMessages(prev => {
          if (prev.some(m => m.id === newMsg.id)) {
            log('Deduplicating message:', newMsg.id);
            return prev;
          }
          log('Adding message:', newMsg.id);
          return [...prev, newMsg];
        });
        setVisible(true);
        setChatActive(true);
        if (msg.sender === 'admin') {
          setPanelOpen(true);
        }
      }));

      unsubs.push(chat.on('chat_ended', () => {
        log('Event: chat_ended');
        setChatActive(false);
      }));
    }, 500);

    return () => {
      log('Cleaning up tracker subscriptions');
      disposed = true;
      clearInterval(poll);
      unsubs.forEach(fn => fn());
    };
  }, []);

  const send = useCallback((body: string) => {
    const trimmed = body.trim();
    if (!trimmed) return;

    if (chatRef.current) {
      log('Sending message via tracker:', trimmed);
      chatRef.current.send(trimmed);
    } else {
      // Queue message to send when tracker becomes available
      log('Tracker not ready, queueing message:', trimmed);
      pendingMessagesRef.current.push(trimmed);
    }

    // Optimistically add to local state
    setMessages(prev => [...prev, {
      id: `local-${Date.now()}-${++msgCounter}`,
      body: trimmed,
      sender: 'visitor',
      timestamp: new Date().toISOString(),
    }]);
  }, []);

  const togglePanel = useCallback(() => {
    setPanelOpen(prev => !prev);
  }, []);

  return { visible, panelOpen, chatActive, messages, send, togglePanel, hasHistory };
}
