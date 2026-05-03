import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { isValidRoomCode } from '@/lib/ids';
import { Room } from './room';

export default async function RoomPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  if (!isValidRoomCode(code)) notFound();
  const room = db.rooms.get(code);
  if (!room) notFound();

  const featuresEnabled = {
    captions: process.env.FEATURE_CAPTIONS !== 'false',
    summary: process.env.FEATURE_SUMMARY !== 'false',
    recording: process.env.FEATURE_RECORDING === 'true',
  };

  return (
    <Room
      code={code}
      title={room.title || 'Meeting'}
      ended={!!room.ended_at}
      pk={process.env.LIQAA_PK || ''}
      features={featuresEnabled}
    />
  );
}
