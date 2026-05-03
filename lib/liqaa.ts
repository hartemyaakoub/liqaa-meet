const BASE = process.env.LIQAA_API_BASE || 'https://api.liqaa.io';
const SK = process.env.LIQAA_SK || '';

if (!SK && process.env.NODE_ENV === 'production') {
  console.warn('[liqaa] LIQAA_SK is not set — token issuance will fail.');
}

type IssueOpts = {
  user: string;
  rooms: string[];
  ttl?: number;
  permissions?: { canPublish?: boolean; canSubscribe?: boolean; canPublishData?: boolean };
};

export const liqaa = {
  async issueToken(opts: IssueOpts): Promise<{ jwt: string; expiresAt: number }> {
    const r = await fetch(`${BASE}/v1/sdk-token`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${SK}` },
      body: JSON.stringify({
        user: opts.user,
        rooms: opts.rooms,
        ttl: opts.ttl ?? 3600,
        permissions: opts.permissions ?? { canPublish: true, canSubscribe: true, canPublishData: true },
      }),
    });
    if (!r.ok) throw new Error(`liqaa /sdk-token failed: ${r.status} ${await r.text()}`);
    return r.json();
  },

  async createRoom(name: string, opts: { maxParticipants?: number } = {}): Promise<{ id: string; name: string }> {
    const r = await fetch(`${BASE}/v1/rooms`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${SK}` },
      body: JSON.stringify({ name, maxParticipants: opts.maxParticipants ?? 50 }),
    });
    if (!r.ok) throw new Error(`liqaa /rooms failed: ${r.status} ${await r.text()}`);
    return r.json();
  },
};
