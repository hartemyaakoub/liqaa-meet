'use client';

import { useEffect, useRef, useState } from 'react';

export type ChatMessage = { id: string; from: string; text: string; ts: number };

export function ChatPanel({
  messages, onSend, self,
}: {
  messages: ChatMessage[];
  onSend: (text: string) => void;
  self: string;
}) {
  const [draft, setDraft] = useState('');
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages.length]);

  function send() {
    const t = draft.trim();
    if (!t) return;
    onSend(t);
    setDraft('');
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 18px', fontSize: 13 }}>
        {messages.length === 0 ? (
          <p style={{ color: '#64748b' }}>No messages yet. Say hi.</p>
        ) : (
          messages.map((m) => {
            const mine = m.from === self;
            return (
              <div key={m.id} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: mine ? '#60a5fa' : '#94a3b8', fontWeight: 700, marginBottom: 2 }}>
                  {mine ? 'you' : m.from}
                </div>
                <div style={{ color: '#e2e8f0', lineHeight: 1.55 }}>{m.text}</div>
              </div>
            );
          })
        )}
        <div ref={endRef} />
      </div>
      <form
        onSubmit={(e) => { e.preventDefault(); send(); }}
        style={{ padding: 12, borderTop: '1px solid #1e293b', display: 'flex', gap: 8 }}
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Type a message…"
          aria-label="Chat message"
          style={{ flex: 1, padding: '10px 12px', borderRadius: 8, border: '1px solid #1e293b', background: '#0a0d18', color: '#fff', fontSize: 13, outline: 'none' }}
        />
        <button type="submit" disabled={!draft.trim()} style={{ padding: '10px 14px', borderRadius: 8, border: 0, background: '#1d4ed8', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', opacity: draft.trim() ? 1 : 0.5 }}>
          Send
        </button>
      </form>
    </div>
  );
}
