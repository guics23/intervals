const BASE = import.meta.env.BASE_URL;
const audios = new Map();

function get(midi) {
  let a = audios.get(midi);
  if (!a) {
    a = new Audio(`${BASE}sounds/${midi}.mp3`);
    a.preload = 'auto';
    audios.set(midi, a);
  }
  return a;
}

export function preload(midis) {
  for (const m of midis) get(m);
}

export function play(midi) {
  const a = get(midi);
  try {
    a.currentTime = 0;
    const p = a.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
  } catch {}
}

export function playChord(midis) {
  for (const m of midis) play(m);
}
