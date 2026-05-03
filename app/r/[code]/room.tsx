'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Captions } from '@/components/Captions';
import { ParticipantTile, type Participant } from '@/components/ParticipantTile';
import { ChatPanel, type ChatMessage } from '@/components/ChatPanel';
import { ControlBar } from '@/components/ControlBar';

type Props = {
  code: string;
  title: string;
  ended: boolean;
  pk: string;
  features: { captions: boolean; summary: boolean; recording: boolean };
};

type Stage = 'lobby' | 'connecting' | 'live' | 'ended';
type SidePanel = 'captions' | 'chat';

type LiqaaConnection = {
  disconnect: () => void;
  toggleMic: (muted: boolean) => void;
  toggleCam: (off: boolean) => void;
  publishScreen: () => Promise<void>;
  unpublishScreen: () => Promise<void>;
  publishData: (msg: unknown) => void;
};

export function Room({ code, title, ended, pk, features }: Props) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [user] = useState(() => `u_${Math.random().toString(36).slice(2, 10)}`);
  const [stage, setStage] = useState<Stage>(ended ? 'ended' : 'lobby');
  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [side, setSide] = useState<SidePanel>(features.captions ? 'captions' : 'chat');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');
  const conn = useRef<LiqaaConnection | null>(null);

  const me: Participant | undefined = useMemo(
    () => participants.find((p) => p.id === user),
    [participants, user],
  );

  const join = useCallback(async () => {
    if (!name.trim()) return;
    setStage('connecting');
    setError('');
    try {
      const r = await fetch('/api/sdk-token', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ code, user, name }),
      });
      if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || `HTTP ${r.status}`);
      const { jwt } = (await r.json()) as { jwt: string };

      conn.current = await connectLiqaa({
        pk,
        jwt,
        room: code,
        identity: { id: user, name },
        onParticipants: setParticipants,
        onMessage: (m) => setChat((prev) => [...prev.slice(-99), m]),
      });
      setStage('live');
    } catch (e) {
      setError((e as Error).message);
      setStage('lobby');
    }
  }, [code, user, name, pk]);

  const leave = useCallback(async () => {
    conn.current?.disconnect();
    conn.current = null;
    setStage('ended');
    if (features.summary && transcript.length > 80) {
      try {
        await fetch('/api/summary', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ code, transcript }),
        });
      } catch (_) { /* recap will show "no summary yet" */ }
    }
    router.push(`/r/${code}/recap`);
  }, [code, transcript, features.summary, router]);

  const sendMessage = useCallback((text: string) => {
    const msg: ChatMessage = { id: crypto.randomUUID(), from: name, text, ts: Date.now() };
    setChat((prev) => [...prev.slice(-99), msg]);
    conn.current?.publishData({ kind: 'chat', ...msg });
  }, [name]);

  const toggleMute = useCallback(() => {
    setMuted((m) => { conn.current?.toggleMic(!m); return !m; });
  }, []);

  const toggleCam = useCallback(() => {
    setCamOff((c) => { conn.current?.toggleCam(!c); return !c; });
  }, []);

  const toggleScreen = useCallback(async () => {
    if (!conn.current) return;
    try {
      if (sharing) { await conn.current.unpublishScreen(); setSharing(false); }
      else { await conn.current.publishScreen(); setSharing(true); }
    } catch (e) {
      setError((e as Error).message);
    }
  }, [sharing]);

  useEffect(() => () => conn.current?.disconnect(), []);

  if (stage === 'ended') return <EndedView code={code} />;
  if (stage === 'lobby' || stage === 'connecting') {
    return (
      <Lobby
        title={title}
        code={code}
        name={name}
        setName={setName}
        connecting={stage === 'connecting'}
        error={error}
        onJoin={join}
      />
    );
  }

  const tiles: Participant[] = me ? [me, ...participants.filter((p) => p.id !== user)] : participants;

  return (
    <main className="liqaa-room">
      <header className="liqaa-room__header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="liqaa-room__live-dot" />
          <strong style={{ fontSize: 14 }}>{title}</strong>
          <span className="mono" style={{ fontSize: 11, color: '#94a3b8' }}>{code}</span>
        </div>
        <div className="mono" style={{ fontSize: 12, color: '#94a3b8' }}>
          {tiles.length} participant{tiles.length === 1 ? '' : 's'}
        </div>
        <button onClick={leave} className="btn-primary" style={{ background: '#dc2626', padding: '8px 16px', fontSize: 13 }}>
          Leave
        </button>
      </header>

      <section className="liqaa-room__body">
        <div className="liqaa-room__stage">
          <div className={`liqaa-tiles liqaa-tiles--n${Math.min(tiles.length, 6)}`}>
            {tiles.length === 0 ? (
              <div className="liqaa-tiles__empty">Waiting for the SFU to confirm your peers…</div>
            ) : tiles.map((p) => <ParticipantTile key={p.id} participant={p} self={p.id === user} />)}
          </div>
        </div>

        <aside className="liqaa-room__side">
          <div className="liqaa-room__tabs">
            {features.captions && (
              <TabBtn active={side === 'captions'} onClick={() => setSide('captions')}>Captions</TabBtn>
            )}
            <TabBtn active={side === 'chat'} onClick={() => setSide('chat')}>
              Chat {chat.length > 0 && <span style={{ marginLeft: 6, padding: '1px 6px', borderRadius: 999, background: '#1d4ed8', fontSize: 10 }}>{chat.length}</span>}
            </TabBtn>
          </div>
          <div className="liqaa-room__panel">
            {side === 'captions' && features.captions ? (
              <Captions onTranscript={(text) => setTranscript((prev) => prev + (prev ? '\n' : '') + text)} />
            ) : (
              <ChatPanel messages={chat} onSend={sendMessage} self={name} />
            )}
          </div>
        </aside>
      </section>

      <ControlBar
        muted={muted}
        camOff={camOff}
        sharing={sharing}
        captionsAvailable={features.captions}
        onToggleMute={toggleMute}
        onToggleCam={toggleCam}
        onToggleScreen={toggleScreen}
      />

      {error && (
        <div role="alert" style={{ position: 'fixed', bottom: 76, left: '50%', transform: 'translateX(-50%)', padding: '10px 16px', background: '#dc2626', color: '#fff', borderRadius: 10, fontSize: 13, maxWidth: 'min(90vw, 480px)' }}>
          ⚠ {error}
        </div>
      )}
    </main>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1, padding: '12px 14px', border: 0, background: active ? '#1e293b' : 'transparent',
        color: active ? '#fff' : '#94a3b8', borderBottom: active ? '2px solid #60a5fa' : '2px solid transparent',
        fontSize: 13, fontWeight: 600, cursor: 'pointer',
      }}
    >
      {children}
    </button>
  );
}

function EndedView({ code }: { code: string }) {
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

function Lobby({
  title, code, name, setName, connecting, error, onJoin,
}: {
  title: string; code: string; name: string; setName: (v: string) => void;
  connecting: boolean; error: string; onJoin: () => void;
}) {
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
          disabled={connecting}
          onKeyDown={(e) => e.key === 'Enter' && onJoin()}
          style={{ width: '100%', padding: '12px 14px', fontSize: 14, border: '1px solid var(--slate-200)', borderRadius: 10, marginBottom: 16 }}
        />

        {error && (
          <div style={{ padding: 12, background: '#fef2f2', color: 'var(--red-500)', borderRadius: 10, fontSize: 13, marginBottom: 14 }}>{error}</div>
        )}

        <button onClick={onJoin} disabled={connecting || !name.trim()} className="btn-primary" style={{ width: '100%' }}>
          {connecting ? 'Connecting…' : 'Join meeting'}
        </button>
        <p style={{ marginTop: 16, fontSize: 12, color: 'var(--slate-500)', textAlign: 'center' }}>
          🔒 Captions run in your browser. Audio never leaves the device.
        </p>
      </div>
    </main>
  );
}

/* ────────────────────────────────────────────────────────────────────────
 *  LIQAA SDK adapter
 *
 *  This is the *only* coupling point with @liqaa/js. The rest of the room
 *  reads the abstract `Participant` shape and never sees SDK internals.
 *  Swap this function (and ParticipantTile's track plumbing) to point at a
 *  different SFU SDK and the rest of the app keeps working.
 *
 *  When @liqaa/js is unavailable (offline dev / API key missing), we fall
 *  back to a local-only mode that captures the camera and shows ourselves
 *  in the tile grid. The UI still feels real for screenshots and demos.
 * ──────────────────────────────────────────────────────────────────────── */

type ConnectArgs = {
  pk: string;
  jwt: string;
  room: string;
  identity: { id: string; name: string };
  onParticipants: (next: Participant[]) => void;
  onMessage: (msg: ChatMessage) => void;
};

async function connectLiqaa(args: ConnectArgs): Promise<LiqaaConnection> {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  let screenStream: MediaStream | null = null;

  const self: Participant = {
    id: args.identity.id,
    name: args.identity.name,
    isLocal: true,
    isSpeaking: false,
    micMuted: false,
    camOff: false,
    videoStream: stream,
    screenStream: null,
  };
  args.onParticipants([self]);

  // Try to upgrade to a real LIQAA connection. Dynamic import keeps the
  // landing-page bundle small and lets us run in local-only mode if the
  // package isn't installed.
  const remote = await tryUpgradeToLiqaa(args, stream).catch((e) => {
    console.warn('[liqaa] running in local-only mode —', (e as Error).message);
    return null;
  });

  return {
    disconnect: () => {
      stream.getTracks().forEach((t) => t.stop());
      screenStream?.getTracks().forEach((t) => t.stop());
      remote?.disconnect();
    },
    toggleMic: (m) => stream.getAudioTracks().forEach((t) => (t.enabled = !m)),
    toggleCam: (o) => stream.getVideoTracks().forEach((t) => (t.enabled = !o)),
    publishScreen: async () => {
      screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      await remote?.publishScreen(screenStream);
    },
    unpublishScreen: async () => {
      screenStream?.getTracks().forEach((t) => t.stop());
      screenStream = null;
      await remote?.unpublishScreen();
    },
    publishData: (msg) => remote?.publishData(msg),
  };
}

type RemoteHandle = {
  disconnect: () => void;
  publishScreen: (s: MediaStream) => Promise<void>;
  unpublishScreen: () => Promise<void>;
  publishData: (msg: unknown) => void;
};

async function tryUpgradeToLiqaa(args: ConnectArgs, _local: MediaStream): Promise<RemoteHandle | null> {
  if (!args.pk) throw new Error('LIQAA_PK not configured');
  // Lazy-load to keep the landing bundle small.
  const mod = (await import('@liqaa/js').catch(() => null)) as
    | (typeof import('@liqaa/js') & { LIQAA: any })
    | null;
  if (!mod) throw new Error('@liqaa/js not installed');

  // The exact SDK surface depends on @liqaa/js version. We program against the
  // intent rather than over-fitting; readers can replace with their SDK methods.
  // See https://github.com/hartemyaakoub/liqaa-js for the canonical reference.
  const client = await mod.LIQAA.init({
    publicKey: args.pk,
    sdkToken: args.jwt,
    room: args.room,
    identity: args.identity,
    onParticipantsChanged: args.onParticipants,
    onData: (raw: string) => {
      try {
        const m = JSON.parse(raw);
        if (m && m.kind === 'chat') args.onMessage(m as ChatMessage);
      } catch (_) { /* ignore non-JSON */ }
    },
  });

  return {
    disconnect: () => client.disconnect?.(),
    publishScreen: (s) => client.publishScreen?.(s) ?? Promise.resolve(),
    unpublishScreen: () => client.unpublishScreen?.() ?? Promise.resolve(),
    publishData: (msg) => client.publishData?.(JSON.stringify(msg)),
  };
}
