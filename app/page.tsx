import Link from 'next/link';
import { Sparkles, FileText, Lock, Package, Palette, Globe, Zap, ShieldCheck, ArrowRight } from 'lucide-react';

function GithubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.06c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.21.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.11-3.18 0 0 1.01-.32 3.3 1.23.96-.27 1.98-.4 3-.41 1.02.01 2.04.14 3 .41 2.29-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.58A12 12 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}
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
    <header style={{ borderBottom: '1px solid var(--slate-200)', background: 'rgba(255, 255, 255, 0.86)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Logo />
          <span style={{ fontWeight: 800, fontSize: 17, letterSpacing: '-0.015em' }}>LIQAA Meet</span>
          <span className="mono" style={{ fontSize: 11, padding: '3px 7px', borderRadius: 6, background: '#eff6ff', color: 'var(--brand)', fontWeight: 700 }}>v0.4</span>
        </Link>
        <nav style={{ display: 'flex', gap: 22, alignItems: 'center', fontSize: 14, fontWeight: 500, color: 'var(--slate-700)' }}>
          <a href="https://github.com/hartemyaakoub/liqaa-meet" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <GithubIcon size={15} />
            GitHub
          </a>
          <a href="https://github.com/hartemyaakoub/liqaa-meet/blob/main/SELF_HOSTING.md" target="_blank" rel="noreferrer">Self-host</a>
          <Link href="/new" className="btn-primary" style={{ padding: '9px 16px', fontSize: 13 }}>
            New room
            <ArrowRight size={14} strokeWidth={2.4} aria-hidden="true" />
          </Link>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="liqaa-hero">
      <div className="liqaa-hero__glow" aria-hidden="true" />
      <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
        <p className="mono liqaa-hero__pill">
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} aria-hidden="true" />
          OPEN SOURCE · AGPL-3.0 · BUILT IN ALGERIA
        </p>
        <h1 className="h1" style={{ marginBottom: 22 }}>
          Video meetings <span style={{ color: 'var(--brand)' }}>without the surveillance</span>.
        </h1>
        <p className="lead" style={{ maxWidth: 720, margin: '0 auto 38px' }}>
          Self-host in 60 seconds. AI captions in 100+ languages — running entirely in your browser, never on a server.
          The open-source alternative to Zoom, Meet, and Teams.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 30 }}>
          <Link href="/new" className="btn-primary btn-primary--xl">
            Start a meeting
            <ArrowRight size={16} strokeWidth={2.4} aria-hidden="true" />
          </Link>
          <a href="https://github.com/hartemyaakoub/liqaa-meet" target="_blank" rel="noreferrer" className="btn-ghost btn-ghost--xl">
            <GithubIcon size={16} />
            Star on GitHub
          </a>
        </div>
        <div className="liqaa-hero__chips">
          <Chip Icon={ShieldCheck} text="E2E encrypted" />
          <Chip Icon={Globe} text="100+ languages" />
          <Chip Icon={Zap} text="< 1s join time" />
          <Chip Icon={Package} text="1 docker command" />
        </div>
      </div>
    </section>
  );
}

function Chip({ Icon, text }: { Icon: typeof Lock; text: string }) {
  return (
    <span className="liqaa-chip">
      <Icon size={13} strokeWidth={2.2} aria-hidden="true" />
      {text}
    </span>
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
  const features: { title: string; body: string; Icon: typeof Lock; tone: 'brand' | 'emerald' | 'violet' | 'amber' | 'pink' | 'cyan' }[] = [
    { Icon: Sparkles,    tone: 'brand',   title: 'In-browser AI captions',  body: 'Whisper.cpp compiled to WASM. Your audio never leaves the device. 99 languages including Arabic, French, Mandarin, Hindi.' },
    { Icon: FileText,    tone: 'cyan',    title: 'Smart summary',           body: 'Decisions, action items, open questions — generated post-call by your local Ollama or any OpenAI-compatible API.' },
    { Icon: ShieldCheck, tone: 'emerald', title: 'E2E encryption',          body: 'DTLS-SRTP for media, on by default. No "upgrade to Pro for security" lock-in. Your encryption keys, your rules.' },
    { Icon: Package,     tone: 'amber',   title: '60-second self-host',     body: 'docker compose up. SQLite, Postgres, Cloudflare Pages, Vercel — pick your runtime. No Kubernetes required.' },
    { Icon: Palette,     tone: 'pink',    title: 'Stripe-grade design',     body: 'Beautiful by default. Geist typography, careful colour, animations that respect prefers-reduced-motion.' },
    { Icon: Globe,       tone: 'violet',  title: 'Multi-region SFU',        body: 'Frankfurt + Algiers edge nodes. Sub-15ms inside Algeria, sub-60ms across Europe. Failover in 3 minutes.' },
  ];
  return (
    <section style={{ padding: '90px 28px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <h2 className="h2" style={{ textAlign: 'center', marginBottom: 16 }}>Everything Zoom does. Nothing it shouldn&apos;t.</h2>
        <p className="lead" style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 56px' }}>
          The features that matter, designed without the dark patterns of legacy meeting software.
        </p>
        <div className="liqaa-features">
          {features.map((f) => (
            <article key={f.title} className="liqaa-feature">
              <span className={`liqaa-feature__icon liqaa-feature__icon--${f.tone}`}>
                <f.Icon size={20} strokeWidth={2.2} aria-hidden="true" />
              </span>
              <h3 className="liqaa-feature__title">{f.title}</h3>
              <p className="liqaa-feature__body">{f.body}</p>
            </article>
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
        <div className="liqaa-terminal">
          <div className="liqaa-terminal__bar">
            <span /><span /><span />
          </div>
          <div className="liqaa-terminal__body mono">
            <div><span className="liqaa-terminal__prompt">$</span> git clone https://github.com/hartemyaakoub/liqaa-meet.git</div>
            <div><span className="liqaa-terminal__prompt">$</span> cd liqaa-meet && cp .env.example .env</div>
            <div><span className="liqaa-terminal__prompt">$</span> docker compose up -d</div>
            <div className="liqaa-terminal__ok">Ready on http://localhost:3000</div>
          </div>
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
        <span className="mono">Built in Algeria — for the world</span>
      </div>
    </footer>
  );
}

function Logo() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: 9, background: 'linear-gradient(135deg, #1d4ed8 0%, #4f46e5 100%)', color: '#fff', fontWeight: 800, fontSize: 14, boxShadow: '0 4px 14px rgba(29, 78, 216, 0.32), inset 0 1px 0 rgba(255, 255, 255, 0.16)' }}>
      L
    </span>
  );
}
