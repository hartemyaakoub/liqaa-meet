'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewRoom() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  async function create() {
    setError('');
    setCreating(true);
    try {
      const r = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ title: title.trim() || null }),
      });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        throw new Error(j.error || `HTTP ${r.status}`);
      }
      const { code } = (await r.json()) as { code: string };
      router.push(`/r/${code}`);
    } catch (e) {
      setError((e as Error).message || 'Could not create the room. Try again.');
      setCreating(false);
    }
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '14px 28px', borderBottom: '1px solid var(--slate-200)' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 8, background: 'var(--brand-ink)', color: '#fff', fontWeight: 800, fontSize: 14 }}>L</span>
          <span style={{ fontWeight: 800, letterSpacing: '-0.015em' }}>LIQAA Meet</span>
        </Link>
      </header>

      <section style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: 520 }}>
          <h1 className="h2" style={{ marginBottom: 12 }}>Start a meeting</h1>
          <p style={{ color: 'var(--slate-700)', marginBottom: 28, fontSize: 15 }}>
            One link. No login. Captions and summary on by default.
          </p>

          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--slate-700)', marginBottom: 8 }}>
            Title <span style={{ fontWeight: 400, color: 'var(--slate-500)' }}>(optional)</span>
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Weekly product sync"
            style={{ width: '100%', padding: '13px 16px', fontSize: 15, border: '1px solid var(--slate-200)', borderRadius: 10, marginBottom: 18, outline: 'none' }}
            onKeyDown={(e) => e.key === 'Enter' && create()}
          />

          {error && (
            <div style={{ padding: 12, background: '#fef2f2', color: 'var(--red-500)', borderRadius: 10, fontSize: 13, marginBottom: 18 }}>
              {error}
            </div>
          )}

          <button onClick={create} disabled={creating} className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: 15 }}>
            {creating ? 'Creating room…' : 'Create and join →'}
          </button>

          <p style={{ marginTop: 24, fontSize: 12, color: 'var(--slate-500)', textAlign: 'center' }}>
            By creating a room, you agree to the <a href="https://liqaa.io/terms" style={{ color: 'var(--brand)' }}>Terms</a>.
            Self-hosted? Your terms, your rules.
          </p>
        </div>
      </section>
    </main>
  );
}
