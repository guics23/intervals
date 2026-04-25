<script>
  let { pool } = $props();
</script>

<footer>
  {#each pool as note}
    <button class="note">{note}</button>
  {/each}
</footer>

<style>
  footer {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.5rem;
    padding: 0.75rem;
    border-top: 1px solid #222;
  }

  .note {
    background: #2a2a2a;
    color: var(--fg);
    border: 1px solid #3a3a3a;
    border-radius: 0.7rem;
    padding: 0.9rem 0.4rem;
    font: inherit;
    font-size: 1.15rem;
    font-weight: 600;
    cursor: pointer;
    min-height: 3rem;
  }
</style>
