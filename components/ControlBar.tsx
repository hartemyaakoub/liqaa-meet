'use client';

import { Mic, MicOff, Video, VideoOff, Monitor, MonitorOff, Sparkles } from 'lucide-react';

export function ControlBar({
  muted, camOff, sharing, captionsAvailable,
  onToggleMute, onToggleCam, onToggleScreen,
}: {
  muted: boolean;
  camOff: boolean;
  sharing: boolean;
  captionsAvailable: boolean;
  onToggleMute: () => void;
  onToggleCam: () => void;
  onToggleScreen: () => void;
}) {
  return (
    <footer className="liqaa-room__footer">
      <div className="liqaa-controls">
        <ControlBtn
          danger={muted}
          active={!muted}
          onClick={onToggleMute}
          Icon={muted ? MicOff : Mic}
          label={muted ? 'Unmute' : 'Mute'}
        />
        <ControlBtn
          danger={camOff}
          active={!camOff}
          onClick={onToggleCam}
          Icon={camOff ? VideoOff : Video}
          label={camOff ? 'Start camera' : 'Stop camera'}
        />
        <ControlBtn
          accent={sharing}
          active={sharing}
          onClick={onToggleScreen}
          Icon={sharing ? MonitorOff : Monitor}
          label={sharing ? 'Stop sharing' : 'Share screen'}
        />
        {captionsAvailable && (
          <span className="liqaa-controls__hint">
            <Sparkles size={12} strokeWidth={2.4} aria-hidden="true" />
            <span>Captions on-device</span>
          </span>
        )}
      </div>
    </footer>
  );
}

function ControlBtn({
  active, onClick, Icon, label, accent, danger,
}: {
  active: boolean;
  onClick: () => void;
  Icon: typeof Mic;
  label: string;
  accent?: boolean;
  danger?: boolean;
}) {
  const variant = danger ? 'danger' : accent ? 'accent' : 'default';
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      aria-pressed={active}
      className="liqaa-ctrl"
      data-variant={variant}
    >
      <Icon size={18} strokeWidth={2.2} aria-hidden="true" />
      <span className="liqaa-ctrl__label">{label}</span>
    </button>
  );
}
