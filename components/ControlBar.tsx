'use client';

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
      <ControlBtn active={!muted} onClick={onToggleMute} icon={muted ? '🔇' : '🎤'} label={muted ? 'Unmute' : 'Mute'} />
      <ControlBtn active={!camOff} onClick={onToggleCam} icon={camOff ? '📷❌' : '📷'} label={camOff ? 'Camera on' : 'Camera off'} />
      <ControlBtn active={sharing} onClick={onToggleScreen} icon={sharing ? '🖥✓' : '🖥'} label={sharing ? 'Stop share' : 'Share screen'} accent />
      {captionsAvailable && <span className="mono" style={{ marginLeft: 12, fontSize: 11, color: '#94a3b8' }}>CC privately in your browser</span>}
    </footer>
  );
}

function ControlBtn({
  active, onClick, icon, label, accent,
}: {
  active: boolean; onClick: () => void; icon: string; label: string; accent?: boolean;
}) {
  const bg = !active && !accent
    ? '#dc2626'
    : active && accent
    ? '#1d4ed8'
    : '#1e293b';
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      aria-pressed={active}
      style={{
        padding: '11px 18px', borderRadius: 10, border: 0, background: bg, color: '#fff',
        fontWeight: 600, fontSize: 13, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8,
        transition: 'background 0.12s',
      }}
    >
      <span aria-hidden="true">{icon}</span>
      <span>{label}</span>
    </button>
  );
}
