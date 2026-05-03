import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { isValidRoomCode } from '@/lib/ids';

export default async function RecapPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  if (!isValidRoomCode(code)) notFound();
  const room = db.rooms.get(code);
  if (!room) notFound();

  return (
    <main style={{ minHeight: '100vh', padding: '40px 24px', maxWidth: 760, margin: '0 auto' }}>
      <header style={{ marginBottom: 32 }}>
        <Link href="/" style={{ fontSize: 13, color: 'var(--slate-500)' }}>← Back to home</Link>
      </header>

      <p className="mono" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', color: 'var(--slate-500)', marginBottom: 8 }}>
        MEETING RECAP
      </p>
      <h1 className="h2" style={{ marginBottom: 4 }}>{room.title || 'Untitled meeting'}</h1>
      <p style={{ color: 'var(--slate-500)', marginBottom: 32, fontSize: 14 }}>
        Room <span className="mono">{code}</span> · {new Date(room.created_at).toLocaleString()}
        {room.ended_at ? ` · ended ${new Date(room.ended_at).toLocaleTimeString()}` : ''}
      </p>

      {room.summary ? (
        <article
          style={{
            padding: 24,
            background: '#fff',
            border: '1px solid var(--slate-200)',
            borderRadius: 14,
            fontSize: 15,
            lineHeight: 1.7,
            whiteSpace: 'pre-wrap',
          }}
        >
          {room.summary}
        </article>
      ) : (
        <div style={{ padding: 24, background: '#fef3c7', borderRadius: 14, color: '#92400e', fontSize: 14 }}>
          No summary yet — the LLM may still be generating, or summary was disabled for this meeting.
        </div>
      )}

      {room.transcript && (
        <details style={{ marginTop: 24, padding: 18, background: '#f8fafc', borderRadius: 12, fontSize: 13, color: 'var(--slate-700)' }}>
          <summary style={{ cursor: 'pointer', fontWeight: 700, color: 'var(--brand-ink)' }}>Full transcript</summary>
          <pre style={{ marginTop: 12, whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: 13, lineHeight: 1.6 }}>{room.transcript}</pre>
        </details>
      )}

      <div style={{ marginTop: 32, display: 'flex', gap: 12 }}>
        <Link href="/new" className="btn-primary">New meeting</Link>
        <Link href="/" className="btn-ghost">Home</Link>
      </div>
    </main>
  );
}
