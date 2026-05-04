'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

type Line = { id: string; text: string; ts: number };

type SpeechRecognitionResult = { 0: { transcript: string }; isFinal: boolean };
type SpeechRecognitionEvent = { results: ArrayLike<SpeechRecognitionResult> };
type SpeechRecognitionErrorEvent = { error: string };
type SpeechRecognitionInstance = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  onerror: ((e: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};
type SpeechRecognitionCtor = new () => SpeechRecognitionInstance;

export function Captions({ onTranscript }: { onTranscript?: (text: string) => void }) {
  const [lines, setLines] = useState<Line[]>([]);
  const [status, setStatus] = useState<'init' | 'ready' | 'unsupported' | 'error'>('init');
  const [error, setError] = useState('');
  const recRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    const w = window as unknown as {
      SpeechRecognition?: SpeechRecognitionCtor;
      webkitSpeechRecognition?: SpeechRecognitionCtor;
    };
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;

    if (!SR) {
      setStatus('unsupported');
      return;
    }

    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = false;
    rec.lang = navigator.language || 'en-US';

    rec.onresult = (ev) => {
      const last = ev.results[ev.results.length - 1];
      const text = last[0].transcript.trim();
      if (!text) return;
      setLines((prev) => {
        const next = [...prev, { id: crypto.randomUUID(), text, ts: Date.now() }];
        return next.slice(-200);
      });
      onTranscript?.(text);
    };

    rec.onerror = (e) => {
      setError(e.error || 'speech_error');
      setStatus('error');
    };

    rec.onend = () => {
      try { rec.start(); } catch { /* already started */ }
    };

    try {
      rec.start();
      recRef.current = rec;
      setStatus('ready');
    } catch (e) {
      setError((e as Error).message);
      setStatus('error');
    }

    return () => {
      try { rec.stop(); } catch { /* no-op */ }
    };
  }, [onTranscript]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div style={{ padding: '14px 18px', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong style={{ fontSize: 13, letterSpacing: '0.02em' }}>Live captions</strong>
        <StatusPill status={status} error={error} />
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 18px', fontSize: 13, lineHeight: 1.7 }}>
        {lines.length === 0 ? (
          <p style={{ color: '#64748b' }}>
            {status === 'unsupported'
              ? 'This browser does not support in-browser captions. Try a Chromium-based browser, or enable WebGPU.'
              : 'Start speaking — captions appear here.'}
          </p>
        ) : (
          lines.map((l) => (
            <p key={l.id} style={{ margin: '0 0 10px', color: '#e2e8f0' }}>{l.text}</p>
          ))
        )}
      </div>
      <div style={{ padding: '10px 18px', borderTop: '1px solid #1e293b', fontSize: 11, color: '#64748b' }}>
        Audio never leaves your device.
      </div>
    </div>
  );
}

function StatusPill({ status, error }: { status: 'init' | 'ready' | 'unsupported' | 'error'; error: string }) {
  if (status === 'ready') {
    return (
      <span className="mono" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#10b981' }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', animation: 'liqaa-pulse 2s infinite' }} aria-hidden="true" />
        on-device
      </span>
    );
  }
  if (status === 'init') {
    return (
      <span className="mono" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#94a3b8' }}>
        <Loader2 size={11} strokeWidth={2.6} style={{ animation: 'liqaa-spin 1s linear infinite' }} aria-hidden="true" />
        loading
      </span>
    );
  }
  if (status === 'unsupported') {
    return <span className="mono" style={{ fontSize: 11, color: '#94a3b8' }}>unsupported</span>;
  }
  return (
    <span className="mono" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#dc2626' }}>
      <AlertCircle size={11} strokeWidth={2.6} aria-hidden="true" />
      {error || 'error'}
    </span>
  );
}
