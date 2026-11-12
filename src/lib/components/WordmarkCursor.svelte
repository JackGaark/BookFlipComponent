<svelte:options runes={false} />

<script>
	import { ARTBOARD_SIZE, CURSOR_SCALE, wordmarkFrame } from './wordmark-cursor.js';

	/** @type {HTMLDivElement} */
	let artwork;
	/** @type {HTMLImageElement[]} */
	let pages = [];

	/** Keep the letters, erase sector and page edges on the same reversible clock. */
	export function setDialPosition(position) {
		if (!artwork) return;
		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const frame = wordmarkFrame(reduced ? Math.round(position) : position);
		artwork.style.maskImage = frame.mask;
		artwork.style.webkitMaskImage = frame.mask;
		pages.forEach((page, index) => {
			page.style.transform = `translateY(-50%) rotate(${frame.angles[index] - 90}deg)`;
		});
	}
</script>

<div
	class="wordmark-cursor"
	aria-hidden="true"
	style:width={`${ARTBOARD_SIZE * CURSOR_SCALE}px`}
	style:height={`${ARTBOARD_SIZE * CURSOR_SCALE}px`}
>
	<div
		class="wordmark-cursor__stage"
		style:width={`${ARTBOARD_SIZE}px`}
		style:height={`${ARTBOARD_SIZE}px`}
		style:transform={`scale(${CURSOR_SCALE})`}
	>
		<div class="wordmark-cursor__artwork" bind:this={artwork}>
			<img
				class="letter-s"
				src="/images/cursor/s-letter.svg"
				width="48.0089"
				height="71.8391"
				alt=""
				draggable="false"
			/>
			<img
				class="letter-b"
				src="/images/cursor/sb-wordmark.svg"
				width="45.7109"
				height="68.8929"
				alt=""
				draggable="false"
			/>
		</div>
		{#each [0, 1, 2, 3, 4] as index}
			<img
				class="wordmark-cursor__page"
				bind:this={pages[index]}
				src="/images/cursor/page-line.svg"
				width="66.4512"
				height="3.59196"
				alt=""
				draggable="false"
			/>
		{/each}
	</div>
</div>

<style>
	.wordmark-cursor {
		position: relative;
		pointer-events: none;
		user-select: none;
	}
	.wordmark-cursor__stage {
		position: absolute;
		inset: 0;
		transform-origin: top left;
	}
	.wordmark-cursor__artwork {
		position: absolute;
		inset: 0;
		mask-repeat: no-repeat;
		mask-size: 100% 100%;
	}
	img {
		position: absolute;
		display: block;
		max-width: none;
		filter: brightness(0) invert(1);
	}
	.letter-s {
		left: 14.3672px;
		top: 32.3281px;
	}
	.letter-b {
		left: 71.8359px;
		top: 35.9219px;
	}
	.wordmark-cursor__page {
		left: 50%;
		top: 50%;
		transform-origin: 0 50%;
		transform: translateY(-50%) rotate(90deg);
	}
</style>
