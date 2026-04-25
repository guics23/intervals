<script>
  import { KEYS } from '../music/spellings.js';

  let { current, onSelect, onClose } = $props();

  const minors = {
    C: 'Am', F: 'Dm', Bb: 'Gm', Eb: 'Cm', Ab: 'Fm', Db: 'Bbm',
    Gb: 'Ebm', B: 'G#m', E: 'C#m', A: 'F#m', D: 'Bm', G: 'Em',
  };
</script>

<div
  class="overlay"
  onclick={(e) => { if (e.target === e.currentTarget) onClose(); }}
  onkeydown={(e) => { if (e.key === 'Escape') onClose(); }}
  role="presentation"
>
  <div class="sheet" role="dialog" aria-modal="true" aria-label="Choose key" tabindex="-1">
    <div class="grid">
      {#each KEYS as k}
        <button class="key" class:active={k === current} onclick={() => onSelect(k)}>
          <span class="major">{k}</span>
          <span class="minor">{minors[k]}</span>
        </button>
      {/each}
    </div>
  </div>
</div>

<style>
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
  }

  .sheet {
    background: #181818;
    border: 1px solid #2a2a2a;
    border-radius: 1rem;
    padding: 1rem;
    width: min(92vw, 22rem);
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }

  .key {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.15rem;
    background: #222;
    color: var(--fg);
    border: 1px solid #333;
    border-radius: 0.7rem;
    padding: 0.7rem 0.4rem;
    font: inherit;
    cursor: pointer;
  }

  .key.active {
    background: #2c4a2c;
    border-color: #4a7a4a;
  }

  .major {
    font-size: 1.25rem;
    font-weight: 700;
  }

  .minor {
    font-size: 0.75rem;
    color: var(--muted);
  }
</style>
