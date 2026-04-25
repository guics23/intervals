import { KEYS, SPELLINGS } from '../src/music/spellings.js';
import {
  DIATONIC_LABELS,
  CHROMATIC_LABELS,
  DEGREE_OFFSET,
  TONIC_PC,
  pickRoundDegrees,
  noteFor,
  buildPool,
  midiFor,
  placeMidi,
  tonicTriadMidi,
  nextKey,
} from '../src/music/theory.js';

let pass = 0;
let fail = 0;

function check(actual, expected, msg) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (ok) {
    pass++;
  } else {
    fail++;
    console.log(`✗ ${msg}\n    got:      ${JSON.stringify(actual)}\n    expected: ${JSON.stringify(expected)}`);
  }
}

function checkTrue(cond, msg) {
  if (cond) pass++;
  else { fail++; console.log(`✗ ${msg}`); }
}

// --- spellings table ---
check(KEYS.length, 12, 'KEYS has 12 entries');
check(KEYS, ['C','F','Bb','Eb','Ab','Db','Gb','B','E','A','D','G'], 'KEYS in cycle-of-fourths order');

// User's example: B is the #4 of F (not Cb / b5)
check(noteFor('F', '#4'), 'B', "F major: #4 = B");
check(noteFor('F', 'b5'), 'Cb', "F major: b5 = Cb");

// Sharp keys
check(noteFor('C', '3'), 'E', 'C major: 3 = E');
check(noteFor('C', '#4'), 'F#', 'C major: #4 = F#');
check(noteFor('C', 'b5'), 'Gb', 'C major: b5 = Gb');
check(noteFor('G', 'b7'), 'F', 'G major: b7 = F');
check(noteFor('B', '#4'), 'E#', 'B major: #4 = E#');

// Flat keys with double-accidental fallback to enharmonic natural
check(noteFor('Eb', 'b5'), 'A', "Eb major: b5 = A (was Bbb)");
check(noteFor('Ab', 'b2'), 'A', "Ab major: b2 = A (was Bbb)");
check(noteFor('Db', 'b6'), 'A', "Db major: b6 = A (was Bbb)");
check(noteFor('Gb', 'b3'), 'A', "Gb major: b3 = A (was Bbb)");

// Spellings completeness
let missing = 0;
for (const k of KEYS) {
  for (const lbl of CHROMATIC_LABELS) {
    if (typeof SPELLINGS[k][lbl] !== 'string') missing++;
  }
}
check(missing, 0, 'every key has every label');

// --- diatonic round picking ---
let allOk = true;
for (let i = 0; i < 200; i++) {
  const d = pickRoundDegrees(5, 'diatonic');
  if (d.length !== 5) allOk = false;
  if (new Set(d).size !== 5) allOk = false;
  for (const l of d) if (!DIATONIC_LABELS.includes(l)) allOk = false;
}
checkTrue(allOk, 'diatonic round picking: 5 distinct labels each time (200 trials)');

// --- chromatic round picking ---
allOk = true;
let sawHashFour = false, sawFlatFive = false;
for (let i = 0; i < 500; i++) {
  const d = pickRoundDegrees(5, 'chromatic');
  if (d.length !== 5) allOk = false;
  // Distinct pitch classes (so #4 and b5 cannot both appear)
  const pcs = d.map(l => DEGREE_OFFSET[l]);
  if (new Set(pcs).size !== 5) allOk = false;
  for (const l of d) if (!CHROMATIC_LABELS.includes(l)) allOk = false;
  if (d.includes('#4')) sawHashFour = true;
  if (d.includes('b5')) sawFlatFive = true;
}
checkTrue(allOk, 'chromatic round picking: 5 distinct pitch classes each time (500 trials)');
checkTrue(sawHashFour, 'chromatic picking emits #4 sometimes');
checkTrue(sawFlatFive, 'chromatic picking emits b5 sometimes');

// --- pool building ---
{
  const labels = ['3', 'b3', 'b7'];
  const pool = buildPool('C', 'chromatic', labels);
  check(pool.length, 8, 'chromatic pool size = 8');
  for (const l of labels) {
    checkTrue(pool.includes(noteFor('C', l)), `chromatic pool contains correct note for ${l}`);
  }
  check(pool[0], 'C', 'chromatic pool starts with tonic');
  checkTrue(pool.includes('C'), 'chromatic pool always contains tonic, even when not in round');
}
{
  const pool = buildPool('C', 'diatonic', ['3', '5']);
  check(pool, ['C','D','E','F','G','A','B'], 'diatonic pool = scale in order (tonic first)');
}
// Edge case: Eb chromatic — palette dedups #4 and b5 (both 'A')
{
  const pool = buildPool('Eb', 'chromatic', ['#4']);
  checkTrue(pool.includes('A'), 'Eb chromatic pool contains A (the picked #4)');
  check(pool[0], 'Eb', 'Eb chromatic pool starts with tonic');
  checkTrue(pool.length === 8, 'Eb chromatic pool size = 8 even with collapsed palette');
}
// Pool ordering: notes ascend by pitch class from tonic
{
  const pool = buildPool('F', 'chromatic', ['3', '5']);
  const offsets = pool.map(n => ((((n[0].charCodeAt(0) - 67 + 7) * 0) || 0)));
  // simpler: just verify monotonic non-decreasing offset from tonic F
  let lastOff = -1;
  let monotonic = true;
  for (const n of pool) {
    let pc = { C:0, D:2, E:4, F:5, G:7, A:9, B:11 }[n[0]];
    for (let i = 1; i < n.length; i++) {
      if (n[i] === '#') pc++;
      else if (n[i] === 'b') pc--;
    }
    const off = ((pc - 5) % 12 + 12) % 12;
    if (off < lastOff) monotonic = false;
    lastOff = off;
  }
  checkTrue(monotonic, 'chromatic pool sorted by pitch ascending from tonic');
}

// --- MIDI math ---
check(midiFor('C', '1', 4), 60, 'midiFor: C4 = 60 (middle C)');
check(midiFor('C', '5', 4), 67, 'midiFor: G4 = 67');
check(midiFor('A', '1', 4), 69, 'midiFor: A4 = 69');
check(midiFor('Bb', '1', 3), 58, 'midiFor: Bb3 = 58');

// placeMidi: every note within 2 octaves and within sample range [30, 90]
allOk = true;
let inRange = true;
for (const key of KEYS) {
  for (let i = 0; i < 100; i++) {
    const labels = pickRoundDegrees(5, 'chromatic');
    const midis = placeMidi(key, labels);
    const span = Math.max(...midis) - Math.min(...midis);
    if (span > 24) allOk = false;
    if (new Set(midis).size !== midis.length) allOk = false;
    for (const m of midis) {
      if (m < 30 || m > 90) inRange = false;
    }
  }
}
checkTrue(allOk, 'placeMidi: span ≤ 24, all distinct (1200 trials across 12 keys)');
checkTrue(inRange, 'placeMidi: all MIDI in sample range [30, 90] across 12 keys');

// tonic triad
check(tonicTriadMidi('C'), [60, 64, 67], 'tonic triad C = [C4, E4, G4]');
check(tonicTriadMidi('F'), [65, 69, 72], 'tonic triad F = [F4, A4, C5]');

// nextKey advances around the cycle
check(nextKey('C'), 'F', 'next after C = F');
check(nextKey('Gb'), 'B', 'next after Gb = B (enharmonic jump)');
check(nextKey('G'), 'C', 'cycle wraps: next after G = C');

// --- summary ---
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
