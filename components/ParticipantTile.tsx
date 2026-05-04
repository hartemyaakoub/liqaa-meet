'use client';

import { useEffect, useRef, useState } from 'react';
import { MicOff, MonitorUp, PictureInPicture2 } from 'lucide-react';

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
  const [inPip, setInPip] = useState(false);

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

  // Track PiP state so the tile shows the avatar (not a black hole) while
  // the floating window is open.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const enter = () => setInPip(true);
    const leave = () => setInPip(false);
    v.addEventListener('enterpictureinpicture', enter);
    v.addEventListener('leavepictureinpicture', leave);
    return () => {
      v.removeEventListener('enterpictureinpicture', enter);
      v.removeEventListener('leavepictureinpicture', leave);
    };
  }, [participant.videoStream]);

  const togglePip = async () => {
    const v = videoRef.current;
    if (!v) return;
    try {
      if (document.pictureInPictureElement === v) {
        await document.exitPictureInPicture();
      } else if (document.pictureInPictureEnabled) {
        await v.requestPictureInPicture();
      }
    } catch {
      /* user-cancelled or unsupported — ignore */
    }
  };

  const initials = participant.name
    .split(/\s+/).map((s) => s[0]).slice(0, 2).join('').toUpperCase() || '?';
  const isCamOff = participant.camOff || !participant.videoStream;
  const showAvatar = !participant.screenStream && (isCamOff || inPip);

  return (
    <div
      className="liqaa-tile"
      data-speaking={participant.isSpeaking ? 'true' : 'false'}
      data-screen={participant.screenStream ? 'true' : 'false'}
      data-pip={inPip ? 'true' : 'false'}
      aria-label={`${participant.name}${self ? ' (you)' : ''}`}
    >
      {participant.screenStream ? (
        <video ref={screenRef} muted={self} playsInline className="liqaa-tile__media liqaa-tile__media--contain" />
      ) : (
        <video
          ref={videoRef}
          muted={self}
          playsInline
          className={`liqaa-tile__media${self ? ' liqaa-tile__media--mirror' : ''}${showAvatar ? ' liqaa-tile__media--hidden' : ''}`}
        />
      )}

      {showAvatar && (
        <div className="liqaa-tile__avatar">
          <span>{initials}</span>
          {inPip && (
            <span className="liqaa-tile__pip-tag">
              <PictureInPicture2 size={11} strokeWidth={2.4} aria-hidden="true" />
              Picture-in-picture
            </span>
          )}
        </div>
      )}

      {/* PiP toggle — appears only when supported, only on the LOCAL tile to keep the UI calm. */}
      {self && !participant.screenStream && (
        <button
          type="button"
          onClick={togglePip}
          className="liqaa-tile__pip-btn"
          aria-label={inPip ? 'Exit picture-in-picture' : 'Open picture-in-picture'}
          title={inPip ? 'Exit picture-in-picture' : 'Picture-in-picture'}
        >
          <PictureInPicture2 size={14} strokeWidth={2.4} aria-hidden="true" />
        </button>
      )}

      <div className="liqaa-tile__caption">
        <span className="liqaa-tile__name">
          {participant.name}{self ? ' (you)' : ''}
        </span>
        <span className="liqaa-tile__icons">
          {participant.micMuted && (
            <span title="Muted" aria-label="Muted" className="liqaa-tile__icon liqaa-tile__icon--danger">
              <MicOff size={11} strokeWidth={2.6} />
            </span>
          )}
          {participant.screenStream && (
            <span title="Sharing screen" aria-label="Sharing screen" className="liqaa-tile__icon liqaa-tile__icon--accent">
              <MonitorUp size={11} strokeWidth={2.6} />
            </span>
          )}
        </span>
      </div>
    </div>
  );
}
