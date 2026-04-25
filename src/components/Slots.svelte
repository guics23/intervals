<script>
  let { labels, mode, placements, won, onSlotTap } = $props();
</script>

<section class:won>
  {#each labels as label, i}
    <button
      type="button"
      class="slot"
      class:filled={placements[i] !== null}
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
      {/if}
    </button>
  {/each}
</section>

<style>
  section {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.85rem;
    padding: 1rem;
    transition: background 0.3s ease;
  }

  section.won {
    background: rgba(60, 110, 60, 0.12);
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
</style>
