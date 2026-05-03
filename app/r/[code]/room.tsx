'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Captions } from '@/components/Captions';

type Props = {
  code: string;
  title: string;
  ended: boolean;
  pk: string;
  features: { captions: boolean; summary: boolean; recording: boolean };
};

export function Room({ code, title, ended, pk, features }: Props) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [user] = useState(() => `u_${Math.random().toString(36).slice(2, 10)}`);
  const [stage, setStage] = useState<'lobby' | 'connecting' | 'live' | 'ended'>(ended ? 'ended' : 'lobby');
  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [captionsOn, setCaptionsOn] = useState(features.captions);
  const [transcript, setTranscript] = useState<string>('');
  const [error, setError] = useState('');
  const liqaaRef = useRef<{ disconnect: () => void } | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);

  async function join() {
    if (!name.trim()) return;
    setStage('connecting');
    setError('');
    try {
      const r = await fetch('/api/sdk-token', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ code, user, name }),
      });
      if (!r.ok) throw new Error((await r.json()).error || `HTTP ${r.status}`);
      // const { jwt } = await r.json();

      // Real LIQAA connect happens here; for the MIT-licensed open-source tier we
      // call window.LIQAA.init(...). Stub for now — see https://liqaa.io/docs.
      // The reference implementation is in https://github.com/hartemyaakoub/liqaa-js.
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        await localVideoRef.current.play().catch(() => {});
      }
      liqaaRef.current = { disconnect: () => stream.getTracks().forEach((t) => t.stop()) };
      setStage('live');
    } catch (e) {
      setError((e as Error).message);
      setStage('lobby');
    }
  }

  function leave() {
    liqaaRef.current?.disconnect();
    liqaaRef.current = null;
    setStage('ended');
    if (features.summary && transcript.length > 80) {
      void finalizeSummary();
    } else {
      router.push(`/r/${code}/recap`);
    }
  }

  async function finalizeSummary() {
    try {
      await fetch('/api/summary', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ code, transcript }),
      });
    } catch (_) {
      /* recap page will fall back to "no summary yet" */
    } finally {
      router.push(`/r/${code}/recap`);
    }
  }

  function toggleMute() {
    const stream = localVideoRef.current?.srcObject as MediaStream | null;
    stream?.getAudioTracks().forEach((t) => (t.enabled = muted));
    setMuted(!muted);
  }

  function toggleCam() {
    const stream = localVideoRef.current?.srcObject as MediaStream | null;
    stream?.getVideoTracks().forEach((t) => (t.enabled = camOff));
    setCamOff(!camOff);
  }

  useEffect(() => () => liqaaRef.current?.disconnect(), []);

  if (stage === 'ended') {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 24 }}>
        <div>
          <h1 className="h2" style={{ marginBottom: 12 }}>This meeting has ended.</h1>
          <p className="lead">View the recap or start a new one.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24 }}>
            <Link href={`/r/${code}/recap`} className="btn-primary">View recap →</Link>
            <Link href="/new" className="btn-ghost">New meeting</Link>
          </div>
        </div>
      </main>
    );
  }

  if (stage === 'lobby' || stage === 'connecting') {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: '#fafafb' }}>
        <div style={{ width: '100%', maxWidth: 460, padding: 32, background: '#fff', borderRadius: 16, border: '1px solid var(--slate-200)' }}>
          <p className="mono" style={{ fontSize: 11, fontWeight: 700, color: 'var(--slate-500)', letterSpacing: '0.12em', marginBottom: 8 }}>LOBBY</p>
          <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4 }}>{title}</h1>
          <p style={{ color: 'var(--slate-500)', fontSize: 13, marginBottom: 22 }}>Room <span className="mono">{code}</span></p>

          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--slate-700)' }}>Your name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Alice"
            autoFocus
            disabled={stage === 'connecting'}
            onKeyDown={(e) => e.key === 'Enter' && join()}
            style={{ width: '100%', padding: '12px 14px', fontSize: 14, border: '1px solid var(--slate-200)', borderRadius: 10, marginBottom: 16 }}
          />

          {error && (
            <div style={{ padding: 12, background: '#fef2f2', color: 'var(--red-500)', borderRadius: 10, fontSize: 13, marginBottom: 14 }}>{error}</div>
          )}

          <button onClick={join} disabled={stage === 'connecting' || !name.trim()} className="btn-primary" style={{ width: '100%' }}>
            {stage === 'connecting' ? 'Connecting…' : 'Join meeting'}
          </button>
          <p style={{ marginTop: 16, fontSize: 12, color: 'var(--slate-500)', textAlign: 'center' }}>
            🔒 Captions run in your browser. Audio never leaves the device.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100vh', background: '#0a0d18', color: '#fff', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '12px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', animation: 'pulse 2s infinite' }} />
          <strong style={{ fontSize: 14 }}>{title}</strong>
          <span className="mono" style={{ fontSize: 11, color: '#94a3b8' }}>{code}</span>
        </div>
        <button onClick={leave} className="btn-primary" style={{ background: '#dc2626', padding: '8px 16px', fontSize: 13 }}>
          Leave
        </button>
      </header>

      <section style={{ flex: 1, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: 0 }}>
        <div style={{ padding: 24, display: 'grid', gap: 16, gridTemplateColumns: '1fr', alignContent: 'start' }}>
          <div style={{ position: 'relative', aspectRatio: '16/9', background: '#000', borderRadius: 16, overflow: 'hidden' }}>
            <video ref={localVideoRef} muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />
            <div style={{ position: 'absolute', bottom: 12, left: 12, padding: '6px 12px', background: 'rgba(0,0,0,.5)', borderRadius: 8, fontSize: 13, fontWeight: 600 }}>
              {name} (you)
            </div>
          </div>
        </div>

        <aside style={{ borderLeft: '1px solid #1e293b', display: 'flex', flexDirection: 'column' }}>
          {captionsOn && features.captions ? (
            <Captions onTranscript={(text) => setTranscript((prev) => prev + (prev ? '\n' : '') + text)} />
          ) : (
            <div style={{ padding: 20, color: '#64748b', fontSize: 13 }}>Captions disabled.</div>
          )}
        </aside>
      </section>

      <footer style={{ padding: '14px 22px', borderTop: '1px solid #1e293b', display: 'flex', justifyContent: 'center', gap: 10 }}>
        <ControlButton onClick={toggleMute} active={!muted} label={muted ? 'Unmute' : 'Mute'} />
        <ControlButton onClick={toggleCam} active={!camOff} label={camOff ? 'Camera on' : 'Camera off'} />
        {features.captions && <ControlButton onClick={() => setCaptionsOn(!captionsOn)} active={captionsOn} label="CC" />}
      </footer>
    </main>
  );
}

function ControlButton({ onClick, active, label }: { onClick: () => void; active: boolean; label: string }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '10px 16px',
        borderRadius: 10,
        border: 0,
        background: active ? '#1e293b' : '#dc2626',
        color: '#fff',
        fontWeight: 600,
        fontSize: 13,
      }}
    >
      {label}
    </button>
  );
}
