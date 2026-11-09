<svelte:options runes={false} />

<script>
	import { onMount } from 'svelte';
	import { bookFlip, initialBookFlip, flipAttribute } from './book-flip.js';

	/** @type {HTMLButtonElement} */
	let book;
	let state = initialBookFlip;
	export let dial = false;
	let landingDial = dial;
	let dialAngle = 0;

	/** Advance the dial from the landing page's shared frame clock and signed tempo. */
	export function setLandingTempo(rate, playing, elapsed) {
		if (!book || !playing) return;
		if (!landingDial) {
			book.removeAttribute('data-flipping');
			landingDial = true;
		}
		dialAngle = (dialAngle + elapsed * rate * 360 / 1320) % 360;
		book.querySelectorAll('.book__page').forEach((page, index) => {
			const phase = ((dialAngle / 360 - index * 75 / 1320) % 1 + 1) % 1;
			const angle = (phase < 0.5 ? 2 * phase * phase : 1 - 2 * (1 - phase) ** 2) * 360;
			page.style.transform = `rotate(${angle}deg)`;
		});
	}

	/** @param {import('./book-flip.js').FlipAction} action */
	function send(action) {
		if (landingDial && (action.type === 'hover' || action.type === 'click')) return;
		const previous = state;
		state = bookFlip(state, action);
		if (state === previous || !book) return;
		if (state.status === 'flipping' && state.run !== previous.run) play(state.run);
		else if (state.status !== 'flipping') book.removeAttribute('data-flipping');
	}

	/** @param {number} run */
	function play(run) {
		book.removeAttribute('data-flipping');
		// Resolve the resting style before starting the next CSS sequence.
		book.getAnimations({ subtree: true });
		book.setAttribute('data-flipping', flipAttribute(state) ?? '');
		const turns = [...book.querySelectorAll('.book__page')].flatMap((page) => page.getAnimations());
		Promise.allSettled(turns.map((turn) => turn.finished)).then((results) => {
			const completed =
				turns.length > 0 && results.every((result) => result.status === 'fulfilled');
			send({ type: completed ? 'finished' : 'cancelled', run });
		});
	}

	/** @param {'sliderGrab' | 'sliderMove' | 'sliderRelease'} phase */
	export function zoomGesture(phase) {
		send({ type: phase });
	}

	onMount(() => {
		const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
		const pointer = window.matchMedia('(hover: hover) and (pointer: fine)');
		const update = () =>
			send({ type: 'environment', reducedMotion: motion.matches, finePointer: pointer.matches });
		update();
		motion.addEventListener('change', update);
		pointer.addEventListener('change', update);
		return () => {
			send({ type: 'unmount' });
			motion.removeEventListener('change', update);
			pointer.removeEventListener('change', update);
		};
	});
</script>

<button
	bind:this={book}
	class="book"
	type="button"
	aria-label="Turn book pages"
	onpointerenter={() => send({ type: 'hover' })}
	onclick={() => send({ type: 'click' })}
>
	<svg viewBox="0 0 23 23" fill="none" aria-hidden="true">
		{#each [0, 75, 150, 225, 300] as delay (delay)}
			<path class="book__page" style={`--delay: ${delay}ms`} d="M11.5 11V1" vector-effect="non-scaling-stroke" />
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
		stroke-width: 1.5;
		stroke-linecap: round;
	}

	.book__page {
		transform-box: view-box;
		transform-origin: 11.5px 11px;
		transform: rotate(0deg);
	}

	.book:global([data-flipping]) .book__page {
		animation:
			book-flip 360ms ease-in-out,
			book-flip-back 360ms ease-in-out;
		animation-delay: var(--delay), calc(660ms + var(--delay));
	}

	@keyframes book-flip {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	@keyframes book-flip-back {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(-360deg);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.book:global([data-flipping]:not([data-flipping='requested'])) .book__page {
			animation: none;
		}
	}
</style>
