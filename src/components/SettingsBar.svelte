<script>
  import TonicPicker from './TonicPicker.svelte';

  let { settings, progress, onSkip } = $props();

  let pickerOpen = $state(false);

  function toggleMode() {
    settings.mode = settings.mode === 'silent' ? 'aural' : 'silent';
  }

  function toggleScale() {
    settings.scale = settings.scale === 'diatonic' ? 'chromatic' : 'diatonic';
  }

  function cycleLength() {
    settings.length = settings.length === 5 ? 3 : settings.length + 1;
  }

  function pickKey(k) {
    settings.tonic = k;
    pickerOpen = false;
  }
</script>

<header>
  <button class="pill prominent" onclick={() => (pickerOpen = true)}>{settings.tonic}</button>
  <button class="pill" onclick={toggleMode}>{settings.mode}</button>
  <button class="pill" onclick={toggleScale}>{settings.scale}</button>
  {#if settings.mode === 'aural' && settings.scale === 'chromatic'}
    <button class="pill" onclick={cycleLength}>{settings.length}</button>
  {/if}
  <span class="progress">{progress}/10</span>
  <button class="pill skip" onclick={onSkip} aria-label="skip round">↻</button>
</header>

{#if pickerOpen}
  <TonicPicker
    current={settings.tonic}
    onSelect={pickKey}
    onClose={() => (pickerOpen = false)}
  />
{/if}

<style>
  header {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.6rem 0.75rem;
    border-bottom: 1px solid #222;
  }

  .pill {
    background: #1f1f1f;
    color: var(--fg);
    border: 1px solid #333;
    border-radius: 999px;
    padding: 0.35rem 0.7rem;
    font: inherit;
    font-size: 0.9rem;
    cursor: pointer;
    min-height: 2rem;
  }

  .pill:active {
    background: #2a2a2a;
  }

  .pill.prominent {
    font-size: 1rem;
    font-weight: 700;
    padding: 0.35rem 0.9rem;
  }

  .progress {
    margin-left: auto;
    color: var(--muted);
    font-variant-numeric: tabular-nums;
    font-size: 0.85rem;
  }

  .pill.skip {
    padding: 0.35rem 0.6rem;
    font-size: 1rem;
  }
</style>
