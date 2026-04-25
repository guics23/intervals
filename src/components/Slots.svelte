<script>
  let { labels, mode } = $props();
</script>

<section>
  {#each labels as label}
    <div class="slot" class:filled={mode === 'silent'}>
      {#if mode === 'silent'}
        <span class="degree">{label}</span>
      {/if}
    </div>
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
  }

  .slot {
    width: 5rem;
    height: 5rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #181818;
    border: 2px dashed #333;
  }

  .slot.filled {
    border-style: solid;
    border-color: #2a2a2a;
  }

  .degree {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--muted);
  }
</style>
