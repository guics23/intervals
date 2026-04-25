const STORAGE_KEY = 'intervals.settings';

const defaults = {
  tonic: 'C',
  mode: 'silent',     // 'silent' | 'aural'
  scale: 'diatonic',  // 'diatonic' | 'chromatic'
  length: 4,          // 3 | 4 | 5
};

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaults };
    return { ...defaults, ...JSON.parse(raw) };
  } catch {
    return { ...defaults };
  }
}

export const settings = $state(load());

export function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {}
}
