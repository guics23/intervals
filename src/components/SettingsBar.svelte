<script>
  let { tonic, mode, scale, length, progress } = $props();
</script>

<header>
  <button class="pill prominent">{tonic}</button>
  <button class="pill">{mode}</button>
  <button class="pill">{scale}</button>
  <button class="pill">{length}</button>
  <span class="progress">{progress}/10</span>
  <button class="pill skip" aria-label="skip">↻</button>
</header>

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
  }
</style>
