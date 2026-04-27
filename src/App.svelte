<script>
  import SettingsBar from './components/SettingsBar.svelte';
  import Slots from './components/Slots.svelte';
  import Pool from './components/Pool.svelte';
  import { settings, persist } from './store/settings.svelte.js';
  import {
    pickRoundDegrees,
    buildPool,
    noteFor,
    DEGREE_OFFSET,
    placeMidi,
    tonicTriadMidi,
    nextKey,
  } from './music/theory.js';
  import { play, playChord, preload } from './audio/player.js';

  let roundSeed = $state(0);
  let winTimer = null;
  let keyChange = $state(null);
  let countdownInterval = null;

  const effectiveLength = $derived(
    settings.mode === 'aural' && settings.scale === 'chromatic' ? settings.length : 3
  );

  const round = $derived.by(() => {
    void roundSeed;
    let labels = pickRoundDegrees(effectiveLength, settings.scale);
    let midis = settings.mode === 'aural' ? placeMidi(settings.tonic, labels) : null;
    if (midis) {
      const order = midis.map((_, i) => i).sort((a, b) => midis[b] - midis[a]);
      labels = order.map((i) => labels[i]);
      midis = order.map((i) => midis[i]);
    } else {
      labels = labels.sort((a, b) => DEGREE_OFFSET[b] - DEGREE_OFFSET[a]);
    }
    const pool = buildPool(settings.tonic, settings.scale, labels);
    const correctNotes = labels.map((l) => noteFor(settings.tonic, l));
    return { labels, pool, correctNotes, midis };
  });

  let placements = $state([]);

  $effect(() => {
    void round;
    placements = round.labels.map(() => null);
    if (winTimer !== null) {
      clearTimeout(winTimer);
      winTimer = null;
    }
  });

  $effect(() => {
    JSON.stringify(settings);
    persist();
  });

  // Preload current and next key's chord plus the round's notes so
  // the auto-advance chord plays without a fetch delay.
  $effect(() => {
    if (settings.mode !== 'aural') return;
    const toLoad = [
      ...tonicTriadMidi(settings.tonic),
      ...tonicTriadMidi(nextKey(settings.tonic)),
    ];
    if (round.midis) toLoad.push(...round.midis);
    preload(toLoad);
  });

  // Auto-preview: when a new aural round arrives, play its notes from the
  // bottom slot to the top slot so the user can try to name them by ear
  // without tapping anything. The leading delay leaves room for the I chord
  // when this round-change happens to coincide with a key change.
  $effect(() => {
    if (settings.mode !== 'aural' || !round.midis) return;
    const fromBottom = [...round.midis].reverse();
    const startDelay = 800;
    const gap = 450;
    const timers = fromBottom.map((m, i) =>
      setTimeout(() => play(m), startDelay + i * gap)
    );
    return () => {
      for (const t of timers) clearTimeout(t);
    };
  });

  // Whenever the tonic changes (manual pick or auto-advance), reset
  // progress and play the new key's I chord in aural mode.
  let lastTonic = settings.tonic;
  $effect(() => {
    if (settings.tonic === lastTonic) return;
    lastTonic = settings.tonic;
    settings.progress = 0;
    clearKeyChange();
    if (settings.mode === 'aural') {
      playChord(tonicTriadMidi(settings.tonic));
    }
  });

  const allPlaced = $derived(
    placements.length > 0 && placements.every((p) => p !== null)
  );

  function tryPlace(note) {
    if (allPlaced) return false;
    const i = round.correctNotes.findIndex(
      (correct, idx) => correct === note && placements[idx] === null
    );
    if (i === -1) return false;
    placements[i] = note;
    if (settings.mode === 'aural' && round.midis) {
      play(round.midis[i]);
    }
    if (placements.every((p) => p !== null)) onWin();
    return true;
  }

  function onWin() {
    const newProgress = settings.progress + 1;
    settings.progress = newProgress;
    if (winTimer !== null) clearTimeout(winTimer);
    winTimer = setTimeout(() => {
      winTimer = null;
      if (newProgress >= 10) {
        startKeyChangeCountdown();
      } else {
        roundSeed++;
      }
    }, 700);
  }

  function clearKeyChange() {
    if (countdownInterval !== null) {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }
    keyChange = null;
  }

  function startKeyChangeCountdown() {
    keyChange = { nextKey: nextKey(settings.tonic), secondsLeft: 5 };
    countdownInterval = setInterval(() => {
      keyChange.secondsLeft--;
      if (keyChange.secondsLeft <= 0) {
        const nk = keyChange.nextKey;
        clearKeyChange();
        settings.tonic = nk;
      }
    }, 1000);
  }

  function stayInCurrentKey() {
    clearKeyChange();
    settings.progress = 0;
    roundSeed++;
  }

  function onSlotTap(i) {
    if (settings.mode === 'aural' && round.midis) {
      play(round.midis[i]);
    }
  }

  function skip() {
    if (keyChange !== null) {
      stayInCurrentKey();
      return;
    }
    if (winTimer !== null) {
      clearTimeout(winTimer);
      winTimer = null;
    }
    roundSeed++;
  }

  function playTonicChord() {
    playChord(tonicTriadMidi(settings.tonic));
  }
</script>

<SettingsBar {settings} onSkip={skip} />
<Slots
  labels={round.labels}
  mode={settings.mode}
  {placements}
  won={allPlaced}
  {onSlotTap}
  tonic={settings.tonic}
  onPlayChord={playTonicChord}
/>
<Pool pool={round.pool} placed={placements} onTap={tryPlace} />

{#if keyChange}
  <div class="key-change-backdrop" role="dialog" aria-modal="true">
    <div class="key-change-card">
      <span>Moving to <strong>{keyChange.nextKey}</strong> in {keyChange.secondsLeft}…</span>
      <button type="button" onclick={stayInCurrentKey}>Stay on {settings.tonic}</button>
    </div>
  </div>
{/if}

<style>
  .key-change-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(2px);
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
  }

  .key-change-card {
    background: #1f1f1f;
    border: 1px solid #333;
    border-radius: 1rem;
    padding: 1.25rem 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    font-size: 1rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
    text-align: center;
  }

  .key-change-card button {
    background: #2a2a2a;
    color: var(--fg);
    border: 1px solid #444;
    border-radius: 999px;
    padding: 0.5rem 1rem;
    font: inherit;
    font-size: 0.95rem;
    cursor: pointer;
  }

  .key-change-card button:active {
    background: #333;
  }
</style>
