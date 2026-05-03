import { ImageResponse } from 'next/og';

export const alt = 'LIQAA Meet — open-source video meetings without surveillance';
export const contentType = 'image/png';
export const size = { width: 1200, height: 630 };

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #0a0d18 0%, #1e293b 100%)',
          color: '#fff',
          padding: 80,
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: '#1d4ed8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 36,
              fontWeight: 800,
              letterSpacing: -2,
            }}
          >
            L
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em' }}>LIQAA Meet</div>
            <div style={{ fontSize: 13, color: '#94a3b8', letterSpacing: 2 }}>v0.3 · OPEN SOURCE · AGPL-3.0</div>
          </div>
          <div style={{ marginLeft: 'auto', padding: '6px 14px', borderRadius: 999, background: '#1d4ed8', fontSize: 13, fontWeight: 800, letterSpacing: 1 }}>
            🇩🇿 ALGERIA
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: 80, fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.035em' }}>
            <div>Video meetings</div>
            <div>without <span style={{ color: '#60a5fa' }}>surveillance.</span></div>
          </div>
          <div style={{ marginTop: 24, fontSize: 22, fontWeight: 600, color: '#cbd5e1' }}>
            Self-host in 60 seconds · AI captions in your browser · 100+ languages
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: 'ui-monospace, SFMono-Regular, monospace', fontSize: 18, color: '#10b981', fontWeight: 700, letterSpacing: 1 }}>
            $ docker compose up
          </div>
          <div style={{ fontSize: 16, color: '#94a3b8', fontWeight: 600 }}>
            github.com/hartemyaakoub/liqaa-meet
          </div>
        </div>
      </div>
    ),
    size,
  );
}
