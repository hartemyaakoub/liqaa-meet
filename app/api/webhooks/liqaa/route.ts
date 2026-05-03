import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'node:crypto';

const SECRET = process.env.LIQAA_WEBHOOK_SECRET || '';
const TOLERANCE_S = 300;

export async function POST(req: NextRequest) {
  const sig = req.headers.get('liqaa-signature') || '';
  const raw = await req.text();

  if (!SECRET) return new NextResponse('webhook_secret_unset', { status: 500 });
  if (!verify(raw, sig)) return new NextResponse('invalid_signature', { status: 401 });

  const event = JSON.parse(raw) as { type: string; data: { room?: string } };

  switch (event.type) {
    case 'call.started':
    case 'call.ended':
    case 'recording.ready':
      // hooks for future use — db.rooms.end already fires from /api/summary
      break;
  }

  return NextResponse.json({ ok: true });
}

function verify(body: string, header: string): boolean {
  const parts = Object.fromEntries(header.split(',').map((p) => p.split('=')));
  const t = Number(parts.t);
  const v1 = parts.v1;
  if (!t || !v1) return false;
  if (Math.abs(Date.now() / 1000 - t) > TOLERANCE_S) return false;

  const expected = createHmac('sha256', SECRET).update(`${t}.${body}`).digest('hex');
  if (expected.length !== v1.length) return false;
  return timingSafeEqual(Buffer.from(expected), Buffer.from(v1));
}
