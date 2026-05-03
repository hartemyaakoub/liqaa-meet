'use client';

import { useEffect } from 'react';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[liqaa-meet]', error);
  }, [error]);

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 24 }}>
      <div style={{ maxWidth: 480 }}>
        <p className="mono" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', color: '#dc2626', marginBottom: 12 }}>
          UNEXPECTED ERROR
        </p>
        <h1 className="h2" style={{ marginBottom: 12 }}>Something broke.</h1>
        <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24 }}>
          We logged the error. If this keeps happening, please{' '}
          <a href="https://github.com/hartemyaakoub/liqaa-meet/issues/new?template=bug.yml" style={{ color: '#1d4ed8' }}>
            file a bug report
          </a>{' '}
          with the digest below.
        </p>
        {error.digest && (
          <code className="mono" style={{ display: 'inline-block', padding: '6px 12px', borderRadius: 8, background: '#f1f5f9', fontSize: 12, color: '#334155', marginBottom: 24 }}>
            {error.digest}
          </code>
        )}
        <div>
          <button onClick={() => reset()} className="btn-primary">Try again</button>
        </div>
      </div>
    </main>
  );
}
