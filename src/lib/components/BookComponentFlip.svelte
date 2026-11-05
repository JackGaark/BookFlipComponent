<script>
  let { zoom = 50 } = $props();
  const turn = $derived((zoom - 50) * 7.2);

  /** @param {MouseEvent | PointerEvent} event */
  function flip(event) {
    const book = event.currentTarget;
    if (!(book instanceof HTMLButtonElement) || book.hasAttribute('data-flipping')) return;
    const requested = event.type === 'click';
    if (!requested && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!requested && !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    book.setAttribute('data-flipping', requested ? 'requested' : '');
    const turns = [...book.querySelectorAll('.book__page')].flatMap((page) => page.getAnimations());
    Promise.allSettled(turns.map((turn) => turn.finished)).then(() => {
      book.removeAttribute('data-flipping');
    });
  }
</script>

<button class="book" type="button" aria-label="Turn book pages" onpointerenter={flip} onclick={flip}>
  <svg viewBox="0 0 23 23" fill="none" aria-hidden="true">
    {#each [0, 75, 150, 225, 300] as delay, index}
      <path
        class="book__page"
        style={`--delay: ${delay}ms; --zoom-turn: ${turn - index * 12 * Math.sin(turn * Math.PI / 180)}deg`}
        d="M11.5 11V1"
      />
    {/each}
  </svg>
</button>

<style>
  .book {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    padding: 0;
    border: 0;
    background: transparent;
    color: #000;
    cursor: pointer;
  }

  .book:focus-visible {
    outline: 2px solid #bd62ff;
    outline-offset: 4px;
  }

  svg {
    width: 32px;
    height: 32px;
    stroke: currentColor;
    stroke-width: 1.2;
    stroke-linecap: round;
  }

  .book__page {
    transform-box: view-box;
    transform-origin: 11.5px 11px;
    transform: rotate(var(--zoom-turn));
  }

  .book:global([data-flipping]) .book__page {
    animation: book-flip 360ms ease-in-out, book-flip-back 360ms ease-in-out;
    animation-delay: var(--delay), calc(660ms + var(--delay));
  }

  @keyframes book-flip {
    from { transform: rotate(var(--zoom-turn)); }
    to { transform: rotate(calc(var(--zoom-turn) + 360deg)); }
  }

  @keyframes book-flip-back {
    from { transform: rotate(var(--zoom-turn)); }
    to { transform: rotate(calc(var(--zoom-turn) - 360deg)); }
  }

  @media (prefers-reduced-motion: reduce) {
    .book:global([data-flipping]:not([data-flipping='requested'])) .book__page { animation: none; }
  }
</style>
