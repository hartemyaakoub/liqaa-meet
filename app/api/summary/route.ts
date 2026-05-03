import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isValidRoomCode } from '@/lib/ids';

const PROVIDER = (process.env.LLM_PROVIDER || 'ollama') as 'ollama' | 'openai' | 'anthropic';
const MODEL = process.env.LLM_MODEL || 'llama3.2:3b';
const BASE = process.env.LLM_BASE_URL || 'http://localhost:11434';
const KEY = process.env.LLM_API_KEY || '';

const PROMPT = `You are an assistant summarising a video meeting transcript. Produce a concise, accurate brief in this exact Markdown structure:

## Decisions
- bullet (single sentence each, factual, no speculation)

## Action items
- [name] task — assigned to whoever said they'd do it

## Open questions
- bullet (only items left unresolved at the end)

If a section has no content, write a single line: \`(none)\`. Do not invent information not in the transcript.`;

export async function POST(req: NextRequest) {
  const { code, transcript } = (await req.json().catch(() => ({}))) as Partial<{ code: string; transcript: string }>;
  if (!code || !isValidRoomCode(code)) return NextResponse.json({ error: 'invalid_code' }, { status: 400 });
  if (!transcript || transcript.length < 50) return NextResponse.json({ error: 'transcript_too_short' }, { status: 400 });

  const room = db.rooms.get(code);
  if (!room) return NextResponse.json({ error: 'room_not_found' }, { status: 404 });

  let summary: string;
  try {
    summary = await callLlm(transcript);
  } catch (e) {
    return NextResponse.json({ error: 'llm_unreachable', detail: (e as Error).message }, { status: 502 });
  }

  db.rooms.end(code, summary, transcript);
  return NextResponse.json({ summary });
}

async function callLlm(transcript: string): Promise<string> {
  if (PROVIDER === 'ollama') {
    const r = await fetch(`${BASE}/api/chat`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        stream: false,
        messages: [
          { role: 'system', content: PROMPT },
          { role: 'user', content: transcript },
        ],
      }),
    });
    if (!r.ok) throw new Error(`ollama: ${r.status}`);
    const j = (await r.json()) as { message: { content: string } };
    return j.message.content.trim();
  }

  if (PROVIDER === 'openai') {
    const r = await fetch(`${BASE.replace(/\/$/, '') || 'https://api.openai.com/v1'}/chat/completions`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${KEY}` },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: PROMPT },
          { role: 'user', content: transcript },
        ],
      }),
    });
    if (!r.ok) throw new Error(`openai: ${r.status}`);
    const j = (await r.json()) as { choices: { message: { content: string } }[] };
    return j.choices[0].message.content.trim();
  }

  if (PROVIDER === 'anthropic') {
    const r = await fetch(`${BASE.replace(/\/$/, '') || 'https://api.anthropic.com/v1'}/messages`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 2048,
        system: PROMPT,
        messages: [{ role: 'user', content: transcript }],
      }),
    });
    if (!r.ok) throw new Error(`anthropic: ${r.status}`);
    const j = (await r.json()) as { content: { text: string }[] };
    return j.content.map((c) => c.text).join('\n').trim();
  }

  throw new Error(`unknown LLM_PROVIDER: ${PROVIDER}`);
}
