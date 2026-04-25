<script>
  let { labels, mode, placements, won, onSlotTap, tonic, onPlayChord } = $props();
</script>

<section class:won>
  <div class="column">
    {#each labels as label, i}
      <button
        type="button"
        class="slot"
        class:filled={placements[i] !== null}
        disabled={mode === 'silent'}
        onclick={() => onSlotTap(i)}
        aria-label={placements[i] !== null ? `slot ${i + 1}, ${placements[i]}` : `slot ${i + 1}, empty`}
      >
        {#if placements[i] !== null}
          {#if mode === 'silent'}
            <span class="degree-corner">{label}</span>
          {/if}
          <span class="note">{placements[i]}</span>
        {:else if mode === 'silent'}
          <span class="degree-large">{label}</span>
        {:else}
          <span class="play-hint">♪</span>
        {/if}
      </button>
    {/each}
  </div>

  {#if mode === 'aural'}
    <button type="button" class="anchor" onclick={onPlayChord} aria-label="play I chord">
      <span class="anchor-tonic">{tonic}</span>
      <span class="anchor-icon">♪</span>
    </button>
  {/if}
</section>

<style>
  section {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.25rem;
    padding: 1rem;
    transition: background 0.3s ease;
  }

  section.won {
    background: rgba(60, 110, 60, 0.12);
  }

  .column {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.85rem;
  }

  .slot {
    position: relative;
    width: 5rem;
    height: 5rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #181818;
    border: 2px dashed #333;
    color: var(--fg);
    font: inherit;
    cursor: pointer;
    padding: 0;
    transition: border-color 0.2s ease, background 0.2s ease;
  }

  .slot:disabled {
    cursor: default;
  }

  .slot.filled {
    border-style: solid;
    border-color: #3a3a3a;
    background: #1f1f1f;
  }

  section.won .slot {
    border-color: #4a7a4a;
  }

  .degree-large {
    font-size: 1.6rem;
    font-weight: 600;
    color: var(--muted);
  }

  .note {
    font-size: 1.3rem;
    font-weight: 600;
  }

  .degree-corner {
    position: absolute;
    top: 0.45rem;
    right: 0.55rem;
    font-size: 0.7rem;
    color: var(--muted);
  }

  .play-hint {
    font-size: 1.4rem;
    color: var(--muted);
    opacity: 0.4;
  }

  .anchor {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.55rem 1.1rem;
    background: #1f1f1f;
    border: 1px solid #333;
    border-radius: 999px;
    color: var(--fg);
    font: inherit;
    cursor: pointer;
  }

  .anchor:active {
    background: #2a2a2a;
  }

  .anchor-tonic {
    font-size: 1.1rem;
    font-weight: 700;
  }

  .anchor-icon {
    font-size: 1rem;
    color: var(--muted);
  }
</style>
