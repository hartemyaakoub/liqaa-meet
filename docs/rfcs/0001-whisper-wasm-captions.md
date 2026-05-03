# RFC 0001 — In-browser Whisper.cpp WASM captions (v0.4)

- **Status:** proposed
- **Author:** @hartemyaakoub
- **Date:** 2026-05-03
- **Tracking:** TBD
- **Targets:** v0.4

## Summary

Replace the Web Speech API caption fallback with whisper.cpp compiled to WebAssembly, accelerated by WebGPU when available. The model loads once per browser, is cached in IndexedDB, and runs in a Web Worker so the UI stays responsive.

## Motivation

The marketing of LIQAA Meet promises "in-browser AI captions, audio never leaves the device". The v0.3 implementation is the Web Speech API, which:

- Is Chromium-only (Safari and Firefox get nothing)
- On most Chromium builds **does** send audio to a Google server (we don't actually meet our promise)
- Supports a limited language set
- Has no offline mode

This is a credibility issue. The headline feature must be honest before we put it on a product page.

## Goals

1. Captions render locally in any browser supporting WebAssembly + WebGPU (Chromium, Edge, modern Firefox, modern Safari).
2. Audio data **never** crosses the process boundary — verified via DevTools network tab having zero audio uploads during a call.
3. ≥ 95% transcription latency budget: model output within 400 ms of speech end on a 2024 laptop.
4. ≥ 99 supported languages.
5. Graceful degradation: Web Speech API fallback for unsupported browsers, "captions unavailable" for the rest.

## Non-goals

- Server-side fallback transcription. We're explicitly not doing this — the privacy promise is the whole point.
- Translation (separate RFC, v0.6).
- Speaker diarization (separate RFC).
- Live cloud-side training on user transcripts. **Never.**

## Detailed design

### Library choice

**[`@huggingface/transformers`](https://github.com/huggingface/transformers.js)** (formerly `@xenova/transformers`).

- ✅ Ships pre-quantised Whisper models (`tiny`, `base`, `small`)
- ✅ Auto-detects WebGPU and falls back to WASM SIMD
- ✅ Models are CDN-fetched from HuggingFace and cached in IndexedDB
- ✅ Permissive licence (Apache 2.0)
- ✅ Active maintenance

Alternatives rejected:

- **whisper-web (build-our-own with whisper.cpp)** — too much WASM compilation maintenance.
- **Browser-native Web Speech API** — already shipped in v0.3 as the fallback.
- **OpenAI realtime ASR** — violates the privacy promise.
- **Deepgram in-browser SDK** — closed source, doesn't meet AGPL alignment.

### Architecture

```
   Microphone audio (Web Audio API)
        │
        ▼  16 kHz mono PCM, 30-second sliding window
   AudioWorklet (off main thread)
        │
        ▼  postMessage(Float32Array)
   Web Worker (whisper-worker.ts)
        │
        ▼
   @huggingface/transformers .pipeline('automatic-speech-recognition', model)
        │
        ▼  WebGPU when available, WASM SIMD otherwise
   { text, language, timestamps }
        │
        ▼  postMessage to main thread
   <Captions /> component renders
```

The `AudioWorklet` is critical — running audio capture on the main thread causes frame drops during inference. The worklet runs in a separate audio rendering thread.

### Model selection

Default: `Xenova/whisper-tiny.en` for English-only (39 MB, fastest), `Xenova/whisper-tiny` for multilingual (39 MB).

Configurable via env:

```env
WHISPER_MODEL=tiny   # tiny | base | small | medium
WHISPER_LANG=auto    # auto-detect, or ISO code: en, ar, fr, ja, …
```

Model size vs. accuracy tradeoff:

| Model | Size | RTF on M2 | RTF on i5 | WER (English) |
|-------|------|-----------|-----------|---------------|
| tiny  | 39 MB | 0.05 | 0.18 | 7.5% |
| base  | 142 MB | 0.10 | 0.32 | 6.0% |
| small | 466 MB | 0.27 | 0.85 | 4.7% |

`tiny` is the right default — it stays well under real-time even on modest hardware.

### Code shape

A new `lib/whisper-worker.ts`:

```ts
import { pipeline, env } from '@huggingface/transformers';

env.allowLocalModels = false;
env.useBrowserCache = true;

let asr: Awaited<ReturnType<typeof pipeline>> | null = null;

self.onmessage = async (e: MessageEvent<{ kind: string; pcm?: Float32Array; model?: string }>) => {
  if (e.data.kind === 'init') {
    asr = await pipeline('automatic-speech-recognition', e.data.model ?? 'Xenova/whisper-tiny');
    self.postMessage({ kind: 'ready' });
    return;
  }
  if (e.data.kind === 'audio' && asr && e.data.pcm) {
    const out = await asr(e.data.pcm, { language: 'auto', task: 'transcribe' });
    self.postMessage({ kind: 'text', text: out.text });
  }
};
```

The `Captions.tsx` component spawns this worker on mount, feeds it 30-second sliding windows of mic audio, renders results.

### Migration

- v0.3 → v0.4: feature-flagged. `FEATURE_WHISPER_WASM=true` opts in. Default for v0.4.0 is `false` while we collect bug reports; flip to `true` in v0.4.1.
- Web Speech API code stays as second fallback.

## Drawbacks

- **First call pays a 39 MB model download** (cached forever after). We mitigate by streaming + showing progress.
- **WebGPU support varies** — Safari 17.4+ has it behind a flag, Firefox 121+ has it stable. The fallback to WASM SIMD adds ~3× latency.
- **Cross-Origin-Embedder-Policy: require-corp** is required for SharedArrayBuffer (which the worker uses for performance). v0.3 already adds COEP scoped to `/r/*`, so this is in place.
- **Bundle weight**: `@huggingface/transformers` is ~600 KB minified. Acceptable for the meeting page; not on the landing.

## Unresolved questions

- Should we ship a separate Docker image with `whisper-base` pre-baked into a service worker cache for self-hosters with poor connectivity? (Probably yes for v0.4.1.)
- How do we handle WebGPU adapter loss mid-call? (Re-init worker silently; if that fails, fall back to Web Speech API.)
- What's our model update strategy? (Use `Xenova/whisper-*` by default — they own the model registry. Self-hosters can override with their own model URL.)

## Acceptance criteria

- [ ] Captions appear in Chrome, Edge, Firefox, Safari with WebGPU
- [ ] Network tab shows zero audio uploads during a 5-minute call (verified manually + via Playwright assertion)
- [ ] Latency p50 < 400 ms, p95 < 800 ms on a 2024 laptop
- [ ] Captions display in language detected by the model (Arabic / French / English / Mandarin smoke test)
- [ ] On unsupported browsers, "captions unavailable" message renders without errors

## Prior art

- [whisper.cpp](https://github.com/ggerganov/whisper.cpp) — C++ port, the basis of the WASM build.
- [transformers.js](https://github.com/huggingface/transformers.js) — the runtime.
- [whisper-web](https://github.com/xenova/whisper-web) — reference UI from the transformers.js author.
- [Daily Vapi](https://www.daily.co/blog/) blog posts on browser-side ASR latency.
