'use client';

import { useEffect, useRef } from 'react';

export type Participant = {
  id: string;
  name: string;
  isLocal: boolean;
  isSpeaking: boolean;
  micMuted: boolean;
  camOff: boolean;
  videoStream: MediaStream | null;
  screenStream: MediaStream | null;
};

export function ParticipantTile({ participant, self }: { participant: Participant; self: boolean }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const screenRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.srcObject !== participant.videoStream) v.srcObject = participant.videoStream;
    if (participant.videoStream) v.play().catch(() => { /* autoplay policy */ });
  }, [participant.videoStream]);

  useEffect(() => {
    const v = screenRef.current;
    if (!v) return;
    if (v.srcObject !== participant.screenStream) v.srcObject = participant.screenStream;
    if (participant.screenStream) v.play().catch(() => { /* autoplay policy */ });
  }, [participant.screenStream]);

  const initials = participant.name
    .split(/\s+/).map((s) => s[0]).slice(0, 2).join('').toUpperCase() || '?';
  const isCamOff = participant.camOff || !participant.videoStream;

  return (
    <div
      className="liqaa-tile"
      data-speaking={participant.isSpeaking ? 'true' : 'false'}
      data-screen={participant.screenStream ? 'true' : 'false'}
      aria-label={`${participant.name}${self ? ' (you)' : ''}`}
    >
      {participant.screenStream ? (
        <video ref={screenRef} muted={self} playsInline className="liqaa-tile__media liqaa-tile__media--contain" />
      ) : isCamOff ? (
        <div className="liqaa-tile__avatar"><span>{initials}</span></div>
      ) : (
        <video
          ref={videoRef}
          muted={self}
          playsInline
          className={`liqaa-tile__media${self ? ' liqaa-tile__media--mirror' : ''}`}
        />
      )}

      <div className="liqaa-tile__caption">
        <span className="liqaa-tile__name">
          {participant.name}{self ? ' (you)' : ''}
        </span>
        <span className="liqaa-tile__icons">
          {participant.micMuted && <span title="Muted" aria-label="Muted" style={{ fontSize: 12 }}>🔇</span>}
          {participant.screenStream && <span title="Sharing screen" aria-label="Sharing screen" style={{ fontSize: 12 }}>🖥</span>}
        </span>
      </div>
    </div>
  );
}
