<script>
  let { pool, placed, onTap } = $props();

  let shakingNote = $state(null);
  let shakeTimer = null;

  function tap(note) {
    if (placed.includes(note)) return;
    const ok = onTap(note);
    if (ok) return;
    shakingNote = note;
    clearTimeout(shakeTimer);
    shakeTimer = setTimeout(() => {
      shakingNote = null;
    }, 350);
  }
</script>

<footer>
  {#each pool as note (note)}
    <button
      type="button"
      class="note"
      class:shaking={shakingNote === note}
      class:used={placed.includes(note)}
      onclick={() => tap(note)}
    >
      {note}
    </button>
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
    transition: opacity 0.2s ease, background 0.2s ease;
  }

  .note:active {
    background: #333;
  }

  .note.used {
    opacity: 0.25;
    cursor: default;
  }

  .shaking {
    animation: shake 0.32s ease-in-out;
    background: #3a1f1f;
    border-color: #6a3030;
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-7px); }
    40% { transform: translateX(7px); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(4px); }
  }
</style>
