import { KEYS, SPELLINGS } from './spellings.js';

export const DIATONIC_LABELS = ['1', '2', '3', '4', '5', '6', '7'];

// All chromatic labels we use. #4 and b5 alias the same pitch class (semitone 6).
export const CHROMATIC_LABELS = ['1', 'b2', '2', 'b3', '3', '4', '#4', 'b5', '5', 'b6', '6', 'b7', '7'];

// Semitone offset from tonic for each label.
export const DEGREE_OFFSET = {
  '1': 0, 'b2': 1, '2': 2, 'b3': 3, '3': 4, '4': 5,
  '#4': 6, 'b5': 6, '5': 7, 'b6': 8, '6': 9, 'b7': 10, '7': 11,
};

// Pitch class (0..11) for a tonic name. Only single-accidental tonic names occur in KEYS.
export const TONIC_PC = {
  C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, F: 5,
  'F#': 6, Gb: 6, G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11,
};

// Single canonical label per pitch class for chromatic round generation.
// The tritone (semitone 6) is handled separately so we can randomize between #4 and b5.
const NON_TRITONE_LABEL = {
  0: '1', 1: 'b2', 2: '2', 3: 'b3', 4: '3', 5: '4',
  7: '5', 8: 'b6', 9: '6', 10: 'b7', 11: '7',
};

function shuffle(arr) {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// Pick `qty` distinct degrees for one round.
// Distinctness is enforced at the pitch-class level; if the tritone is picked,
// it's randomly emitted as #4 or b5.
export function pickRoundDegrees(qty, mode) {
  if (mode === 'diatonic') {
    return shuffle(DIATONIC_LABELS).slice(0, qty);
  }
  const offsets = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]).slice(0, qty);
  return offsets.map(off =>
    off === 6
      ? (Math.random() < 0.5 ? '#4' : 'b5')
      : NON_TRITONE_LABEL[off]
  );
}

export function noteFor(key, label) {
  return SPELLINGS[key][label];
}

// Build the bottom-area pool: the round's correct notes plus distractors.
// Diatonic: returns the 7 scale notes in scale order (always contains the answers).
// Chromatic: returns 8 notes — the correct ones plus enough distractors, shuffled.
export function buildPool(key, mode, roundLabels) {
  if (mode === 'diatonic') {
    return DIATONIC_LABELS.map(l => SPELLINGS[key][l]);
  }
  const correct = roundLabels.map(l => SPELLINGS[key][l]);
  const allChromatic = CHROMATIC_LABELS.map(l => SPELLINGS[key][l]);
  const palette = Array.from(new Set(allChromatic));
  const distractors = palette.filter(n => !correct.includes(n));
  const need = 8 - correct.length;
  const picked = shuffle(distractors).slice(0, need);
  return shuffle([...correct, ...picked]);
}

// MIDI 60 = C4 (middle C). Tonic MIDI in octave o = TONIC_PC[key] + 12*(o+1).
export function midiFor(key, label, tonicOctave) {
  const tonicMidi = TONIC_PC[key] + 12 * (tonicOctave + 1);
  return tonicMidi + DEGREE_OFFSET[label];
}

// Place each round label at a MIDI number within a 2-octave window above the tonic.
// Tonic octave is randomized in {3, 4} so ranges stay within the available samples (30..90).
export function placeMidi(key, roundLabels) {
  const tonicOctave = 3 + Math.floor(Math.random() * 2);
  return roundLabels.map(label => {
    const base = midiFor(key, label, tonicOctave);
    const shift = Math.random() < 0.5 ? 0 : 12;
    return base + shift;
  });
}

// MIDI numbers for the I chord (1, 3, 5) in a fixed register, used as an aural reference.
export function tonicTriadMidi(key, octave = 4) {
  return ['1', '3', '5'].map(l => midiFor(key, l, octave));
}

export function nextKey(current) {
  const i = KEYS.indexOf(current);
  return KEYS[(i + 1) % KEYS.length];
}
