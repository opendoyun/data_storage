#!/usr/bin/env node
// 오프라인 제미나이 REST 목업 — 키·네트워크 없이 generate.mjs 를 끝까지 시험하기 위한 서버.
// 실제 API 모양(ListModels + generateContent, inlineData base64)을 흉내 내고 진짜 작은 PNG/JPEG를 돌려준다.
//
//   node tools/gemini/mock-server.mjs --port=0 [--reject-image-only] [--reject-aspect] [--flaky=N] [--require-key=K]
//   → 표준출력 첫 줄: "MOCK_LISTENING <port>"
//   GEMINI_API_BASE=http://127.0.0.1:<port> GEMINI_API_KEY=mock node tools/gemini/generate.mjs --out=/tmp/x ...
//
// 동작
//   GET  /v1beta/models                       모델 목록 (한 페이지 3개 → nextPageToken 으로 페이지 넘김 시험)
//   POST /v1beta/models/<id>:generateContent  imageConfig.aspectRatio 에 맞는 작은 이미지 (16:9 는 JPEG, 나머지 PNG)
//   GET  /__mock/requests                     받은 generateContent 요청 요약 (테스트 검증용)
//   요청 본문은 실제 API처럼 엄격히 검사한다: 모르는 필드·잘못된 aspectRatio·mimeType/data 없는 inlineData·
//   이미지로 디코드되지 않는 base64 → 400 INVALID_ARGUMENT. 키는 x-goog-api-key 헤더로 왔는지 기록(keyVia).
//   프롬프트에 [[mock:no-image]] → 이미지 없이 finishReason IMAGE_SAFETY, [[mock:500]] → 항상 500,
//   [[mock:blocked]] → promptFeedback.blockReason=SAFETY (후보 없음), [[mock:quota0]] → 429 "limit: 0" (무료 등급 한도 0),
//   [[mock:thought]] → thought:true 중간 이미지(더 큼, 200×200)를 먼저, 최종 이미지를 나중에 돌려줌
//   --reject-image-only : responseModalities 가 ['IMAGE'] 단독이면 400 (TEXT,IMAGE 폴백 시험)
//   --reject-aspect     : imageConfig 가 있으면 400 (비율 없는 요청 폴백 시험)
//   --flaky=N           : N번째 요청마다 429(RetryInfo 50ms) / 503 을 번갈아 반환 (재시도 시험)
import { createServer } from 'node:http';
import { deflateSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const args = Object.fromEntries(process.argv.slice(2).map(a => { const m = /^--([^=]+)(?:=(.*))?$/.exec(a); return m ? [m[1], m[2] ?? true] : [a, true]; }));
const PORT = Number(args.port ?? 0);
const FLAKY = Number(args.flaky ?? 0);

const MODELS = [
  { name: 'models/gemini-2.5-flash', displayName: 'Gemini 2.5 Flash', supportedGenerationMethods: ['generateContent', 'countTokens'] },
  { name: 'models/text-embedding-004', displayName: 'Text Embedding 004', supportedGenerationMethods: ['embedContent'] },
  { name: 'models/gemini-2.5-flash-image', displayName: 'Gemini 2.5 Flash Image', supportedGenerationMethods: ['generateContent', 'countTokens'] },
  { name: 'models/imagen-4.0-generate-001', displayName: 'Imagen 4', supportedGenerationMethods: ['predict'] },
  { name: 'models/gemini-3-pro-image-preview', displayName: 'Gemini 3 Pro Image Preview', supportedGenerationMethods: ['generateContent', 'countTokens'] },
];
const MODEL_IDS = new Set(MODELS.map(m => m.name.slice(7)));

// ── 진짜 PNG 인코더 (RGB, 필터 0) ──
const CRC = new Uint32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
const crc32 = (buf) => { let c = 0xffffffff; for (const b of buf) c = CRC[(c ^ b) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
function chunk(type, data) { const len = Buffer.alloc(4); len.writeUInt32BE(data.length); const td = Buffer.concat([Buffer.from(type, 'ascii'), data]); const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td)); return Buffer.concat([len, td, crc]); }
export function makePng(w, h) {
  const raw = Buffer.alloc((w * 3 + 1) * h);
  for (let y = 0; y < h; y++) {
    raw[y * (w * 3 + 1)] = 0;
    for (let x = 0; x < w; x++) { const o = y * (w * 3 + 1) + 1 + x * 3; raw[o] = 200 - (x * 100 / w) | 0; raw[o + 1] = 180 - (y * 120 / h) | 0; raw[o + 2] = 230; }
  }
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 2; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  return Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}
const TINY_JPEG_16x9 = '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAA0JCgsKCA0LCgsODg0PEyAVExISEyccHhcgLikxMC4pLSwzOko+MzZGNywtQFdBRkxOUlNSMj5aYVpQYEpRUk//2wBDAQ4ODhMREyYVFSZPNS01T09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0//wAARCAAkAEADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDkljqRY6nWOpVjr0XMmnUIFjqRY6nWOpVjrJzO6nUK6x1KsdTrHUix1m5nbTqECx1KsdTrHUix1k5ndTqGYsdSLHVhY6kWOqcz4enUIFjqRY6nWOpVjrJzO2nUIFjqRY6nWOpVjrNzO6nUK6x1KsdTrHUix1k5ndTqGUqipVUUUVqz4umSKoqVVFFFZs7qZIqipFUUUVkzupkqqKkVRRRWbO6mf//Z'; // 64×36 JPEG
const DIMS = { '1:1': [64, 64], '3:4': [60, 80], '4:3': [80, 60], '2:3': [64, 96], '3:2': [96, 64], '4:5': [64, 80], '5:4': [80, 64], '9:16': [36, 64], '21:9': [147, 63] };
function imageFor(aspect) {
  if (aspect === '16:9') return { mimeType: 'image/jpeg', data: TINY_JPEG_16x9, w: 64, h: 36 };
  const [w, h] = DIMS[aspect] ?? [64, 64];
  return { mimeType: 'image/png', data: makePng(w, h).toString('base64'), w, h };
}

const API_ASPECTS = new Set(['1:1', '2:3', '3:2', '3:4', '4:3', '4:5', '5:4', '9:16', '16:9', '21:9']);
const sniff = (b) => b.length > 8 && b.readUInt32BE(0) === 0x89504e47 ? 'image/png' : b.length > 3 && b[0] === 0xff && b[1] === 0xd8 ? 'image/jpeg'
  : b.length > 12 && b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP' ? 'image/webp' : null;
// 실제 generateContent 가 거부하는 모양을 흉내 낸다. 문제 없으면 null.
function validateBody(j) {
  const unknown = (obj, allowed, where) => Object.keys(obj ?? {}).find(k => !allowed.includes(k)) && `Invalid JSON payload received. Unknown name "${Object.keys(obj).find(k => !allowed.includes(k))}" at '${where}': Cannot find field.`;
  let e = unknown(j, ['contents', 'generationConfig', 'safetySettings', 'systemInstruction', 'tools', 'toolConfig', 'cachedContent'], '');
  if (e) return e;
  if (!Array.isArray(j.contents) || !j.contents.length) return '* GenerateContentRequest.contents: contents is not specified';
  for (const [ci, c] of j.contents.entries()) {
    if ((e = unknown(c, ['role', 'parts'], `contents[${ci}]`))) return e;
    if (c.role && !['user', 'model'].includes(c.role)) return `Please use a valid role: user, model.`;
    if (!Array.isArray(c.parts) || !c.parts.length) return `* GenerateContentRequest.contents[${ci}].parts: contents.parts must not be empty.`;
    for (const [pi, p] of c.parts.entries()) {
      if ((e = unknown(p, ['text', 'inlineData', 'fileData', 'thought', 'thoughtSignature'], `contents[${ci}].parts[${pi}]`))) return e;
      const kinds = ['text', 'inlineData', 'fileData'].filter(k => k in p);
      if (kinds.length !== 1) return `* GenerateContentRequest.contents[${ci}].parts[${pi}].data: required oneof field 'data' must have one initialized field`;
      if (p.inlineData) {
        if ((e = unknown(p.inlineData, ['mimeType', 'data'], `contents[${ci}].parts[${pi}].inline_data`))) return e;
        if (!p.inlineData.mimeType || !p.inlineData.data) return `* GenerateContentRequest.contents[${ci}].parts[${pi}].inline_data: mime_type and data are required`;
        const buf = Buffer.from(p.inlineData.data, 'base64');
        const real = sniff(buf);
        if (!real || buf.toString('base64').replace(/=+$/, '') !== p.inlineData.data.replace(/=+$/, '')) return `Unable to process input image. Please retry or report in https://developers.generativeai.google/guide/troubleshooting`;
        if (real !== p.inlineData.mimeType) return `Provided image is not valid (mime_type ${p.inlineData.mimeType} does not match data ${real}).`;
      }
    }
  }
  const g = j.generationConfig ?? {};
  if ((e = unknown(g, ['responseModalities', 'imageConfig', 'temperature', 'topP', 'topK', 'candidateCount', 'seed', 'thinkingConfig'], 'generation_config'))) return e;
  for (const m of g.responseModalities ?? []) if (!['TEXT', 'IMAGE', 'AUDIO'].includes(m)) return `Invalid value at 'generation_config.response_modalities' (${m})`;
  if (g.imageConfig) {
    if ((e = unknown(g.imageConfig, ['aspectRatio', 'imageSize'], 'generation_config.image_config'))) return e;
    if (g.imageConfig.aspectRatio && !API_ASPECTS.has(g.imageConfig.aspectRatio)) return `Invalid aspect ratio: ${g.imageConfig.aspectRatio}`;
  }
  return null;
}

const requests = [];
let genCount = 0;
const send = (res, status, obj, headers = {}) => { res.writeHead(status, { 'content-type': 'application/json', ...headers }); res.end(JSON.stringify(obj)); };
const gErr = (res, status, statusText, message, details) => send(res, status, { error: { code: status, message, status: statusText, ...(details ? { details } : {}) } });

const server = createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  let body = '';
  req.on('data', d => { body += d; });
  req.on('end', () => {
    if (url.pathname === '/__mock/requests') return send(res, 200, requests);
    const keyVia = req.headers['x-goog-api-key'] ? 'header' : url.searchParams.get('key') ? 'query' : null;
    const key = req.headers['x-goog-api-key'] || url.searchParams.get('key');
    if (!key) return gErr(res, 403, 'PERMISSION_DENIED', 'Method doesn\'t allow unregistered callers (callers without established identity). Please use API Key or other form of API consumer identity to call this API.');
    if (args['require-key'] && key !== args['require-key']) return gErr(res, 400, 'INVALID_ARGUMENT', 'API key not valid. Please pass a valid API key.');

    if (req.method === 'GET' && url.pathname === '/v1beta/models') {
      const start = Number(url.searchParams.get('pageToken') || 0);
      const page = MODELS.slice(start, start + 3);
      return send(res, 200, { models: page, ...(start + 3 < MODELS.length ? { nextPageToken: String(start + 3) } : {}) });
    }
    const m = /^\/v1beta\/models\/([^/:]+):generateContent$/.exec(url.pathname);
    if (req.method === 'POST' && m) {
      const model = decodeURIComponent(m[1]);
      if (!MODEL_IDS.has(model)) return gErr(res, 404, 'NOT_FOUND', `models/${model} is not found for API version v1beta, or is not supported for generateContent.`);
      let j; try { j = JSON.parse(body); } catch { requests.push({ n: requests.length + 1, model, status: 400, invalid: 'json' }); return gErr(res, 400, 'INVALID_ARGUMENT', 'Invalid JSON payload received.'); }
      const invalid = validateBody(j);
      const parts = j.contents?.[0]?.parts ?? [];
      const text = parts.filter(p => p.text).map(p => p.text).join('\n');
      const inline = parts.filter(p => p.inlineData);
      const mods = j.generationConfig?.responseModalities ?? [];
      const aspect = j.generationConfig?.imageConfig?.aspectRatio ?? null;
      const key0 = /\[THIS IMAGE — ([^\s·\]]+)/.exec(text)?.[1] ?? null;
      const rec = { n: requests.length + 1, model, key: key0, keyVia, modalities: mods, aspect, inline: inline.length, inlineMimes: inline.map(p => p.inlineData?.mimeType), textChars: text.length, status: 200 };
      requests.push(rec);
      const fail = (status, st, msg, details) => { rec.status = status; return gErr(res, status, st, msg, details); };
      if (invalid) { rec.invalid = invalid; return fail(400, 'INVALID_ARGUMENT', invalid); }
      if (text.includes('[[mock:blocked]]')) { rec.status = 'blocked'; return send(res, 200, { promptFeedback: { blockReason: 'SAFETY' }, modelVersion: model }); }
      if (text.includes('[[mock:quota0]]')) return fail(429, 'RESOURCE_EXHAUSTED', `You exceeded your current quota, please check your plan and billing details. * Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests, limit: 0, model: ${model}`, [{ '@type': 'type.googleapis.com/google.rpc.RetryInfo', retryDelay: '0.05s' }]);
      if (args['reject-image-only'] && mods.length === 1 && mods[0] === 'IMAGE') return fail(400, 'INVALID_ARGUMENT', 'Model does not support the requested response modalities: image');
      if (args['reject-aspect'] && aspect) return fail(400, 'INVALID_ARGUMENT', 'Invalid JSON payload received. Unknown name "imageConfig" at \'generation_config\': Cannot find field.');
      if (!mods.includes('IMAGE')) return fail(400, 'INVALID_ARGUMENT', 'responseModalities must include IMAGE for this model');
      if (text.includes('[[mock:500]]')) return fail(500, 'INTERNAL', 'An internal error has occurred.');
      genCount++;
      if (FLAKY && genCount % FLAKY === 0) {
        if ((genCount / FLAKY) % 2) return fail(429, 'RESOURCE_EXHAUSTED', 'Resource has been exhausted (e.g. check quota).', [{ '@type': 'type.googleapis.com/google.rpc.RetryInfo', retryDelay: '0.05s' }]);
        return fail(503, 'UNAVAILABLE', 'The model is overloaded. Please try again later.');
      }
      if (text.includes('[[mock:no-image]]')) {
        rec.status = 'no-image';
        return send(res, 200, { candidates: [{ content: { role: 'model', parts: [{ text: 'I can\'t create that image.' }] }, finishReason: 'IMAGE_SAFETY', index: 0 }], modelVersion: model });
      }
      const img = imageFor(aspect);
      rec.returned = `${img.w}x${img.h} ${img.mimeType}`;
      const out = [{ inlineData: { mimeType: img.mimeType, data: img.data } }];
      if (text.includes('[[mock:thought]]')) {
        out.unshift({ inlineData: { mimeType: 'image/png', data: makePng(200, 200).toString('base64') }, thought: true });
        out.unshift({ text: 'Planning the composition…', thought: true });
        rec.returned += ' (+thought 200x200)';
      }
      if (mods.includes('TEXT')) out.unshift({ text: 'Here is the illustration.' });
      return send(res, 200, { candidates: [{ content: { role: 'model', parts: out }, finishReason: 'STOP', index: 0 }], usageMetadata: { promptTokenCount: Math.ceil(text.length / 4) + inline.length * 258, candidatesTokenCount: 1290 }, modelVersion: model });
    }
    return gErr(res, 404, 'NOT_FOUND', `mock: no route ${req.method} ${url.pathname}`);
  });
});

export { imageFor, TINY_JPEG_16x9 };
if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  server.listen(PORT, '127.0.0.1', () => { console.log(`MOCK_LISTENING ${server.address().port}`); });
  const stop = () => { server.close(() => process.exit(0)); setTimeout(() => process.exit(0), 500).unref(); };
  process.on('SIGTERM', stop);
  process.on('SIGINT', stop);
}
