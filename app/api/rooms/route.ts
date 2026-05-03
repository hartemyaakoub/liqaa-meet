import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { liqaa } from '@/lib/liqaa';
import { newRoomCode } from '@/lib/ids';

export async function POST(req: NextRequest) {
  let body: { title?: string; createdBy?: string } = {};
  try { body = await req.json(); } catch { /* empty body is fine */ }

  const code = newRoomCode();
  try {
    await liqaa.createRoom(code, { maxParticipants: 50 });
  } catch (e) {
    return NextResponse.json({ error: 'liqaa_unreachable', detail: (e as Error).message }, { status: 502 });
  }

  db.rooms.create(code, body.title ?? null, body.createdBy ?? null);
  return NextResponse.json({ code });
}
