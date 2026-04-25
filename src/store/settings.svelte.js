const STORAGE_KEY = 'intervals.settings';

const defaults = {
  tonic: 'C',
  mode: 'silent',     // 'silent' | 'aural'
  scale: 'diatonic',  // 'diatonic' | 'chromatic'
  length: 4,          // 3 | 4 | 5
  progress: 0,        // 0..9, completed rounds in current key
};

function load() {
  let parsed = {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) parsed = JSON.parse(raw);
  } catch {}
  // Always start in silent mode so the first tap into aural is an explicit
  // gesture — iOS uses that gesture to unlock audio.
  return { ...defaults, ...parsed, mode: 'silent' };
}

export const settings = $state(load());

export function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {}
}
