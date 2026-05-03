export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fff',
        color: '#0a0d18',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <span
          aria-hidden="true"
          style={{
            width: 18, height: 18, borderRadius: '50%',
            border: '2px solid #e2e8f0', borderTopColor: '#1d4ed8',
            animation: 'liqaa-spin 0.8s linear infinite',
          }}
        />
        <span style={{ fontSize: 14, color: '#64748b' }}>Loading…</span>
      </div>
      <style>{'@keyframes liqaa-spin { to { transform: rotate(360deg); } }'}</style>
    </div>
  );
}
