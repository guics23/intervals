const BASE = import.meta.env.BASE_URL;

let ctx = null;
const buffers = new Map();   // midi → AudioBuffer
const loading = new Map();   // midi → Promise<AudioBuffer>

function getCtx() {
  if (ctx) return ctx;
  const Ctor = window.AudioContext || window.webkitAudioContext;
  ctx = new Ctor();
  return ctx;
}

async function load(midi) {
  if (buffers.has(midi)) return buffers.get(midi);
  if (loading.has(midi)) return loading.get(midi);
  const c = getCtx();
  const promise = (async () => {
    const res = await fetch(`${BASE}sounds/${midi}.mp3`);
    const arr = await res.arrayBuffer();
    const buf = await c.decodeAudioData(arr);
    buffers.set(midi, buf);
    loading.delete(midi);
    return buf;
  })();
  loading.set(midi, promise);
  return promise;
}

export function preload(midis) {
  for (const m of midis) {
    if (!buffers.has(m) && !loading.has(m)) load(m).catch(() => {});
  }
}

function start(c, buf) {
  const src = c.createBufferSource();
  src.buffer = buf;
  src.connect(c.destination);
  src.start(0);
}

export function play(midi) {
  const c = getCtx();
  if (c.state === 'suspended') c.resume().catch(() => {});
  const buf = buffers.get(midi);
  if (buf) {
    start(c, buf);
  } else {
    load(midi).then((b) => start(c, b)).catch(() => {});
  }
}

export function playChord(midis) {
  for (const m of midis) play(m);
}
