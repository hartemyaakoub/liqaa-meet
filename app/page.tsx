import Link from 'next/link';
import { ComparisonTable } from '@/components/ComparisonTable';

export default function Landing() {
  return (
    <main>
      <Header />
      <Hero />
      <Trust />
      <FeatureGrid />
      <CompareSection />
      <SelfHostCallout />
      <Footer />
    </main>
  );
}

function Header() {
  return (
    <header style={{ borderBottom: '1px solid var(--slate-200)', background: '#fff' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Logo />
          <span style={{ fontWeight: 800, fontSize: 17, letterSpacing: '-0.015em' }}>LIQAA Meet</span>
          <span className="mono" style={{ fontSize: 11, padding: '3px 7px', borderRadius: 6, background: '#eff6ff', color: 'var(--brand)', fontWeight: 700 }}>v0.3</span>
        </Link>
        <nav style={{ display: 'flex', gap: 22, alignItems: 'center', fontSize: 14, fontWeight: 500, color: 'var(--slate-700)' }}>
          <a href="https://github.com/hartemyaakoub/liqaa-meet" target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://github.com/hartemyaakoub/liqaa-meet/blob/main/SELF_HOSTING.md" target="_blank" rel="noreferrer">Self-host</a>
          <Link href="/new" className="btn-primary" style={{ padding: '9px 16px', fontSize: 13 }}>New room →</Link>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section style={{ padding: '80px 28px 60px', background: 'linear-gradient(180deg, #fff 0%, #f8fafc 100%)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
        <p className="mono" style={{ display: 'inline-block', padding: '6px 14px', borderRadius: 999, background: '#eff6ff', color: 'var(--brand)', fontSize: 12, fontWeight: 700, marginBottom: 24, letterSpacing: '0.05em' }}>
          OPEN SOURCE · AGPL-3.0 · BUILT IN ALGERIA
        </p>
        <h1 className="h1" style={{ marginBottom: 22 }}>
          Video meetings <span style={{ color: 'var(--brand)' }}>without the surveillance</span>.
        </h1>
        <p className="lead" style={{ maxWidth: 720, margin: '0 auto 38px' }}>
          Self-host in 60 seconds. AI captions in 100+ languages — running entirely in your browser, never on a server.
          The open-source alternative to Zoom, Meet, and Teams.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 26 }}>
          <Link href="/new" className="btn-primary" style={{ padding: '14px 28px', fontSize: 15 }}>Start a meeting →</Link>
          <a href="https://github.com/hartemyaakoub/liqaa-meet" target="_blank" rel="noreferrer" className="btn-ghost" style={{ padding: '13px 22px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.06c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.21.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.11-3.18 0 0 1.01-.32 3.3 1.23.96-.27 1.98-.4 3-.41 1.02.01 2.04.14 3 .41 2.29-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.58A12 12 0 0 0 24 12c0-6.63-5.37-12-12-12z" /></svg>
            Star on GitHub
          </a>
        </div>
        <div className="mono" style={{ fontSize: 12, color: 'var(--slate-500)', display: 'flex', gap: 26, justifyContent: 'center', flexWrap: 'wrap' }}>
          <span>🔒 E2E encrypted</span>
          <span>🌍 100+ languages</span>
          <span>⚡ &lt; 1 s join time</span>
          <span>📦 1 docker command</span>
        </div>
      </div>
    </section>
  );
}

function Trust() {
  return (
    <section style={{ padding: '40px 28px', background: '#f8fafc', borderTop: '1px solid var(--slate-200)', borderBottom: '1px solid var(--slate-200)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
        <p className="mono" style={{ fontSize: 11, fontWeight: 700, color: 'var(--slate-500)', letterSpacing: '0.16em', marginBottom: 12 }}>
          BUILT ON A FOUNDATION OF TRUST
        </p>
        <p style={{ fontSize: 15, color: 'var(--slate-700)', maxWidth: 760, margin: '0 auto' }}>
          Powered by <a style={{ color: 'var(--brand)', fontWeight: 600 }} href="https://liqaa.io">LIQAA Cloud</a> · WebRTC simulcast · LiveKit SFU mesh · HMAC-signed webhooks · 99.99% target uptime · ADRs published
        </p>
      </div>
    </section>
  );
}

function FeatureGrid() {
  const features: { title: string; body: string; icon: string }[] = [
    { icon: '🤖', title: 'In-browser AI captions', body: 'Whisper.cpp compiled to WASM. Your audio never leaves the device. 99 languages including Arabic, French, Mandarin, Hindi.' },
    { icon: '📝', title: 'Smart summary', body: 'Decisions, action items, open questions — generated post-call by your local Ollama or any OpenAI-compatible API.' },
    { icon: '🔒', title: 'E2E encryption', body: 'DTLS-SRTP for media, on by default. No "upgrade to Pro for security" lock-in. Your encryption keys, your rules.' },
    { icon: '📦', title: '60-second self-host', body: 'docker compose up. SQLite, Postgres, Cloudflare Pages, Vercel — pick your runtime. No Kubernetes required.' },
    { icon: '🎨', title: 'Stripe-grade design', body: 'Beautiful by default. Geist typography, careful colour, animations that respect prefers-reduced-motion.' },
    { icon: '🌍', title: 'Multi-region SFU', body: 'Frankfurt + Algiers edge nodes. Sub-15ms inside Algeria, sub-60ms across Europe. Failover in 3 minutes.' },
  ];
  return (
    <section style={{ padding: '90px 28px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <h2 className="h2" style={{ textAlign: 'center', marginBottom: 16 }}>Everything Zoom does. Nothing it shouldn&apos;t.</h2>
        <p className="lead" style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 56px' }}>
          The features that matter, designed without the dark patterns of legacy meeting software.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
          {features.map((f) => (
            <div key={f.title} style={{ padding: 26, background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 14 }}>
              <div style={{ fontSize: 26, marginBottom: 14 }}>{f.icon}</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 8px', letterSpacing: '-0.01em' }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--slate-700)', margin: 0, lineHeight: 1.6 }}>{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CompareSection() {
  return (
    <section style={{ padding: '80px 28px', background: '#f8fafc' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <h2 className="h2" style={{ textAlign: 'center', marginBottom: 16 }}>How LIQAA Meet compares</h2>
        <p className="lead" style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 40px' }}>
          Honest comparison. No asterisks. Verify everything yourself.
        </p>
        <ComparisonTable />
      </div>
    </section>
  );
}

function SelfHostCallout() {
  return (
    <section style={{ padding: '80px 28px', textAlign: 'center' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <h2 className="h2" style={{ marginBottom: 14 }}>One command. Your video platform.</h2>
        <p className="lead" style={{ marginBottom: 28 }}>
          Run LIQAA Meet on a $5 VPS. Or your laptop. Or your company&apos;s air-gapped network. The choice is yours.
        </p>
        <div className="mono" style={{ display: 'inline-block', textAlign: 'left', padding: '20px 26px', background: 'var(--brand-ink)', color: '#a8e6a3', borderRadius: 12, fontSize: 14, lineHeight: 1.8 }}>
          <div><span style={{ color: '#94a3b8' }}>$</span> git clone https://github.com/hartemyaakoub/liqaa-meet.git</div>
          <div><span style={{ color: '#94a3b8' }}>$</span> cd liqaa-meet && cp .env.example .env</div>
          <div><span style={{ color: '#94a3b8' }}>$</span> docker compose up -d</div>
          <div style={{ color: '#10b981', marginTop: 8 }}>✓ http://localhost:3000</div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ padding: '40px 28px', borderTop: '1px solid var(--slate-200)', fontSize: 13, color: 'var(--slate-500)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <span>© 2026 TKAWEN · Open source under <a href="https://github.com/hartemyaakoub/liqaa-meet/blob/main/LICENSE" style={{ color: 'var(--brand)' }}>AGPL-3.0</a></span>
        <span className="mono">Built in 🇩🇿 Algeria — for the world</span>
      </div>
    </footer>
  );
}

function Logo() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 8, background: 'var(--brand-ink)', color: '#fff', fontWeight: 800, fontSize: 14 }}>
      L
    </span>
  );
}
