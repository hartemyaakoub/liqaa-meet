import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { liqaa } from '@/lib/liqaa';
import { isValidRoomCode } from '@/lib/ids';

export async function POST(req: NextRequest) {
  const { code, user, name } = (await req.json().catch(() => ({}))) as Partial<{ code: string; user: string; name: string }>;
  if (!code || !isValidRoomCode(code)) return NextResponse.json({ error: 'invalid_code' }, { status: 400 });
  if (!user) return NextResponse.json({ error: 'missing_user' }, { status: 400 });

  const room = db.rooms.get(code);
  if (!room) return NextResponse.json({ error: 'room_not_found' }, { status: 404 });
  if (room.ended_at) return NextResponse.json({ error: 'room_ended' }, { status: 410 });

  let token;
  try {
    token = await liqaa.issueToken({
      user,
      rooms: [code],
      ttl: 3600,
      permissions: { canPublish: true, canSubscribe: true, canPublishData: true },
    });
  } catch (e) {
    return NextResponse.json({ error: 'liqaa_unreachable', detail: (e as Error).message }, { status: 502 });
  }

  if (name) db.participants.join(code, user, name);
  return NextResponse.json(token);
}
