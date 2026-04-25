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
  } from './music/theory.js';
  import { play, playChord, preload } from './audio/player.js';

  let roundSeed = $state(0);

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
  });

  $effect(() => {
    JSON.stringify(settings);
    persist();
  });

  // Warm up the audio elements as soon as we're in aural mode or pick a round.
  $effect(() => {
    if (settings.mode !== 'aural') return;
    const toLoad = [...tonicTriadMidi(settings.tonic)];
    if (round.midis) toLoad.push(...round.midis);
    preload(toLoad);
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
    return true;
  }

  function onSlotTap(i) {
    if (settings.mode === 'aural' && round.midis) {
      play(round.midis[i]);
    }
  }

  $effect(() => {
    if (!allPlaced) return;
    const t = setTimeout(() => {
      roundSeed++;
    }, 700);
    return () => clearTimeout(t);
  });

  function skip() {
    roundSeed++;
  }

  function playTonicChord() {
    playChord(tonicTriadMidi(settings.tonic));
  }
</script>

<SettingsBar
  {settings}
  progress={0}
  onSkip={skip}
/>
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
