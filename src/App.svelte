<script>
  import SettingsBar from './components/SettingsBar.svelte';
  import Slots from './components/Slots.svelte';
  import Pool from './components/Pool.svelte';
  import { settings, persist } from './store/settings.svelte.js';
  import { pickRoundDegrees, buildPool, noteFor, DEGREE_OFFSET } from './music/theory.js';

  let roundSeed = $state(0);

  const effectiveLength = $derived(settings.mode === 'silent' ? 3 : settings.length);

  const round = $derived.by(() => {
    void roundSeed;
    const labels = pickRoundDegrees(effectiveLength, settings.scale)
      .sort((a, b) => DEGREE_OFFSET[b] - DEGREE_OFFSET[a]);
    const pool = buildPool(settings.tonic, settings.scale, labels);
    const correctNotes = labels.map((l) => noteFor(settings.tonic, l));
    return { labels, pool, correctNotes };
  });

  let placements = $state([]);

  // Reset placements whenever the round changes.
  $effect(() => {
    void round;
    placements = round.labels.map(() => null);
  });

  $effect(() => {
    JSON.stringify(settings);
    persist();
  });

  const allPlaced = $derived(
    placements.length > 0 && placements.every((p) => p !== null)
  );

  // Try to place a pool note. Returns true if it found a matching empty slot.
  function tryPlace(note) {
    if (allPlaced) return false;
    const i = round.correctNotes.findIndex(
      (correct, idx) => correct === note && placements[idx] === null
    );
    if (i === -1) return false;
    placements[i] = note;
    return true;
  }

  function unplace(i) {
    if (allPlaced) return;
    if (placements[i] !== null) placements[i] = null;
  }

  // Auto-roll a new round shortly after a win.
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
</script>

<SettingsBar {settings} progress={0} onSkip={skip} />
<Slots
  labels={round.labels}
  mode={settings.mode}
  {placements}
  won={allPlaced}
  onSlotTap={unplace}
/>
<Pool pool={round.pool} placed={placements} onTap={tryPlace} />
