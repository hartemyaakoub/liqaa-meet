import { Check, X, Minus } from 'lucide-react';

type Cell = boolean | 'partial' | string;

const ROWS: { feature: string; meet: Cell; zoom: Cell; gmeet: Cell; jitsi: Cell }[] = [
  { feature: 'Open source', meet: true, zoom: false, gmeet: false, jitsi: true },
  { feature: 'Self-hostable in 1 command', meet: true, zoom: false, gmeet: false, jitsi: 'partial' },
  { feature: 'In-browser AI captions (no server)', meet: true, zoom: false, gmeet: false, jitsi: false },
  { feature: 'AI summary post-call', meet: true, zoom: 'paid Pro', gmeet: 'add-on', jitsi: false },
  { feature: 'E2E encryption by default', meet: true, zoom: 'paid', gmeet: 'partial', jitsi: 'optional' },
  { feature: 'Bring your own LLM', meet: true, zoom: false, gmeet: false, jitsi: false },
  { feature: 'No login required to join', meet: true, zoom: 'partial', gmeet: 'partial', jitsi: true },
  { feature: 'Works in browser without app', meet: true, zoom: 'partial', gmeet: true, jitsi: true },
  { feature: 'Cost (10 users / 100h / mo)', meet: '$0', zoom: '$150', gmeet: '$72', jitsi: '$0' },
];

export function ComparisonTable() {
  return (
    <div style={{ overflowX: 'auto', border: '1px solid var(--slate-200)', borderRadius: 14, background: '#fff' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}>
        <thead>
          <tr style={{ background: '#fff' }}>
            <th style={th}>Feature</th>
            <th style={{ ...th, color: 'var(--brand)', borderBottom: '2px solid var(--brand)' }}>LIQAA Meet</th>
            <th style={th}>Zoom</th>
            <th style={th}>Google Meet</th>
            <th style={th}>Jitsi</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r, i) => (
            <tr key={r.feature} style={{ borderTop: '1px solid var(--slate-200)', background: i % 2 ? '#fcfcfd' : '#fff' }}>
              <td style={td}>{r.feature}</td>
              <td style={{ ...td, fontWeight: 700, color: 'var(--brand)', background: '#f0f7ff' }}>{render(r.meet)}</td>
              <td style={td}>{render(r.zoom)}</td>
              <td style={td}>{render(r.gmeet)}</td>
              <td style={td}>{render(r.jitsi)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function render(c: Cell) {
  if (c === true) {
    return (
      <span aria-label="yes" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, borderRadius: 999, background: 'rgba(16, 185, 129, 0.12)', color: 'var(--emerald-500)' }}>
        <Check size={14} strokeWidth={3} />
      </span>
    );
  }
  if (c === false) {
    return (
      <span aria-label="no" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, borderRadius: 999, background: 'rgba(220, 38, 38, 0.08)', color: 'var(--red-500)' }}>
        <X size={14} strokeWidth={3} />
      </span>
    );
  }
  if (c === 'partial') {
    return (
      <span aria-label="partial" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 999, background: 'rgba(245, 158, 11, 0.12)', color: '#b45309', fontSize: 11, fontWeight: 700 }}>
        <Minus size={12} strokeWidth={3} />
        partial
      </span>
    );
  }
  return <span style={{ fontSize: 13, color: 'var(--slate-700)', fontWeight: 600 }}>{c}</span>;
}

const th: React.CSSProperties = {
  textAlign: 'left',
  padding: '14px 16px',
  fontSize: 12,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  fontWeight: 700,
  color: 'var(--slate-500)',
};
const td: React.CSSProperties = {
  padding: '14px 16px',
  fontSize: 14,
  color: 'var(--brand-ink)',
};
