<script>
  import SettingsBar from './components/SettingsBar.svelte';
  import Slots from './components/Slots.svelte';
  import Pool from './components/Pool.svelte';
  import { pickRoundDegrees, buildPool } from './music/theory.js';

  // Hardcoded round for layout preview. Interactions land in step 5.
  const tonic = 'C';
  const mode = 'silent';
  const scale = 'diatonic';
  const length = 4;
  const progress = 0;

  const labels = pickRoundDegrees(length, scale);
  const pool = buildPool(tonic, scale, labels);
</script>

<SettingsBar {tonic} {mode} {scale} {length} {progress} />
<Slots {labels} {mode} />
<Pool {pool} />
