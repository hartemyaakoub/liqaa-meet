import type { Metadata, Viewport } from 'next';
import './globals.css';

const BRAND = process.env.BRAND_NAME || 'LIQAA Meet';
const SITE = process.env.MEET_DOMAIN ? `https://${process.env.MEET_DOMAIN}` : 'https://meet.liqaa.io';

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: `${BRAND} · Open-source video meetings`, template: `%s · ${BRAND}` },
  description:
    'Open-source video meeting platform you can self-host in 60 seconds. Real-time AI captions in 100+ languages — running entirely in your browser.',
  keywords: ['video conferencing', 'open source', 'self-hosted', 'zoom alternative', 'webrtc', 'AI captions'],
  authors: [{ name: 'TKAWEN', url: 'https://tkawen.com' }],
  openGraph: {
    type: 'website',
    siteName: BRAND,
    title: `${BRAND} · Open-source video meetings`,
    description:
      'Self-host in 60 seconds. AI captions and summaries — running in your browser, never on a server.',
    url: SITE,
  },
  twitter: { card: 'summary_large_image', creator: '@liqaa_io' },
  // app/icon.tsx + app/opengraph-image.tsx are auto-detected by Next.js
};

export const viewport: Viewport = {
  themeColor: process.env.BRAND_PRIMARY || '#1d4ed8',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
