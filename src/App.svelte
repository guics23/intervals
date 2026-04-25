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

  const effectiveLength = $derived(
    settings.mode === 'aural' && settings.scale === 'chromatic' ? settings.length : 3
  );

  const round = $derived.by(() => {
    void roundSeed;
    const labels = pickRoundDegrees(effectiveLength, settings.scale)
      .sort((a, b) => DEGREE_OFFSET[b] - DEGREE_OFFSET[a]);
    const pool = buildPool(settings.tonic, settings.scale, labels);
    const correctNotes = labels.map((l) => noteFor(settings.tonic, l));
    const midis = settings.mode === 'aural' ? placeMidi(settings.tonic, labels) : null;
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
        settings.tonic = nextKey(settings.tonic);
      } else {
        roundSeed++;
      }
    }, 700);
  }

  function onSlotTap(i) {
    if (settings.mode === 'aural' && round.midis) {
      play(round.midis[i]);
    }
  }

  function skip() {
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
