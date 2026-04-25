<script>
  import SettingsBar from './components/SettingsBar.svelte';
  import Slots from './components/Slots.svelte';
  import Pool from './components/Pool.svelte';
  import { settings, persist } from './store/settings.svelte.js';
  import { pickRoundDegrees, buildPool } from './music/theory.js';

  let roundSeed = $state(0);

  const round = $derived.by(() => {
    void roundSeed;
    const labels = pickRoundDegrees(settings.length, settings.scale);
    const pool = buildPool(settings.tonic, settings.scale, labels);
    return { labels, pool };
  });

  $effect(() => {
    JSON.stringify(settings);
    persist();
  });

  function skip() {
    roundSeed++;
  }
</script>

<SettingsBar {settings} progress={0} onSkip={skip} />
<Slots labels={round.labels} mode={settings.mode} />
<Pool pool={round.pool} />
