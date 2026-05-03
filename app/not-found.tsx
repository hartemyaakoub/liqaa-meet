import Link from 'next/link';

export default function NotFound() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 24 }}>
      <div style={{ maxWidth: 460 }}>
        <p className="mono" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', color: '#64748b', marginBottom: 12 }}>
          ROOM NOT FOUND
        </p>
        <h1 className="h2" style={{ marginBottom: 12 }}>That meeting code doesn&apos;t match any room.</h1>
        <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24 }}>
          Double-check the link, or start a new meeting.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link href="/new" className="btn-primary">New meeting</Link>
          <Link href="/" className="btn-ghost">Home</Link>
        </div>
      </div>
    </main>
  );
}
