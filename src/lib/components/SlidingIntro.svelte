<svelte:options runes={false} />

<script>
	import { createEventDispatcher, onMount, onDestroy } from 'svelte';
	import { introLayouts } from './intro-layouts';
	import { featuredProjects } from './project-details';
	import ProjectIndex from './ProjectIndex.svelte';
	import ZoomThumb from './ZoomThumb.svelte';
	import SiteLogo from './SiteLogo.svelte';
	import SiteMenu from './SiteMenu.svelte';
	import { detent, nearestStop } from './zoom-thumb.js';

	export let zoom = 0;
	export let projects = [];
	export let studioOpen = false;
	export let view = 'work';
	let reducedMotion = true;
	let animatedZoom = zoom;
	let zoomTrack;
	let zoomContent;
	let zoomScroll;
	onMount(() => {
		let mounted = true;
		import('locomotive-scroll').then(({ default: LocomotiveScroll }) => {
			if (!mounted) return;
			zoomScroll = new LocomotiveScroll({
				lenisOptions: { wrapper: zoomTrack, content: zoomContent, smoothWheel: false },
				scrollCallback: ({ scroll }) => {
					animatedZoom = scroll / 10;
				}
			});
		});
		const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
		const update = () => {
			reducedMotion = preference.matches;
		};
		update();
		preference.addEventListener('change', update);
		return () => {
			mounted = false;
			zoomScroll?.destroy();
			preference.removeEventListener('change', update);
		};
	});
	$: if (zoomScroll) {
		zoomScroll.scrollTo(zoom * 10, { immediate: reducedMotion, lerp: 0.09 });
		if (reducedMotion) animatedZoom = zoom;
	} else {
		animatedZoom = zoom;
	}
	const dispatch = createEventDispatcher();
	let width = 1440;
	let scroller;
	let draggingZoom = false;
	let keyboardZoom = false;
	/** @type {number | null} */
	let snappedZoom = null;
	let zoomTravel = 1;
	let zoomPointerReleased = false;
	let settlingThumb = false;
	/** @type {HTMLInputElement | undefined} */
	let zoomInput;
	/** @type {ReturnType<typeof setTimeout> | undefined} */
	let zoomReleaseTimer;
	onDestroy(releaseZoom);
	$: scale = Math.max(width, 720) / 1440;
	// Build the middle view from the overview order so every card keeps its identity,
	// crop, and place in the reading sequence at every zoom level.
	const orderedCards = introLayouts[0].map((small, index) => {
		const w = 120;
		const h = w * (small.h / small.w);
		const row = Math.floor(index / 10);
		const column = index % 10;
		const baseline = 293 + row * 240;
		return {
			...small,
			id: index,
			x: 84 + column * 128,
			y: baseline - h,
			w,
			h
		};
	});
	const largeCards = orderedCards.map((card, index) => {
		const template = introLayouts[2].find((large) => large.asset === card.asset);
		return {
			x: 84 + index * 384,
			y: template.y,
			w: template.w,
			h: template.h
		};
	});
	$: verticalGallery = zoom === 50 && Math.abs(animatedZoom - 50) < 0.1;
	$: horizontalGallery = zoom === 100 && animatedZoom > 99.9;
	$: progress = Math.max(0, Math.min(animatedZoom / 50, 1));
	$: largeProgress = Math.max(0, Math.min((animatedZoom - 50) / 50, 1));
	$: description =
		zoom < 25 ? 'Dense overview' : zoom < 75 ? 'Medium gallery' : 'Large horizontal gallery';
	const mix = (a, b, t) => a + (b - a) * t;
	const clamp = (value) => Math.max(0, Math.min(value, 1));
	const smoothstep = (value) => value * value * (3 - 2 * value);
	const stagger = (value, index) => {
		if (reducedMotion) return value;
		const delay = ((index * 7) % 13) * 0.017;
		return smoothstep(clamp((value - delay) / (1 - delay)));
	};
	$: cards = orderedCards.map((middle, index) => {
		const small = introLayouts[0][index];
		const large = largeCards[index];
		const middleT = stagger(progress, index);
		const largeT = stagger(largeProgress, orderedCards.length - index - 1);
		const middleArc = reducedMotion ? 0 : Math.sin(Math.PI * middleT);
		const largeArc = reducedMotion ? 0 : Math.sin(Math.PI * largeT);
		const direction = (index % 5) - 2;
		const motion = reducedMotion ? 0 : 4 * (middleArc + largeArc);
		const cardWidth = mix(mix(small.w, middle.w, middleT), large.w, largeT);
		const aspectRatio = small.h / small.w;
		const largeHeight = large.w * aspectRatio;
		const largeY = large.y + large.h - largeHeight;
		return {
			...middle,
			motion: motion * (0.6 + (index % 5) * 0.1),
			captionSize: mix(mix(3, 6, middleT), 12, largeT),
			captionTrailX: -direction * 3 * (middleArc + largeArc),
			captionTrailY: (14 + (index % 4) * 3) * (middleArc + largeArc),
			x:
				mix(mix(small.x, middle.x, middleT), large.x, largeT) +
				direction * 1.5 * (middleArc + largeArc),
			y:
				mix(mix(small.y, middle.y, middleT), largeY, largeT) -
				(6 + (index % 4) * 2) * (middleArc + largeArc),
			w: cardWidth,
			h: cardWidth * aspectRatio
		};
	});
	$: canvasWidth = Math.max(1440, ...cards.map((c) => c.x + c.w + 84));
	$: canvasHeight = Math.max(880, ...cards.map((c) => c.y + c.h + 77));

	/** @param {number} value */
	function changeZoom(value) {
		if (zoom === value) return;
		zoom = value;
	}

	/** @param {Event & { currentTarget: HTMLInputElement }} event */
	function updateZoom(event) {
		const input = event.currentTarget;
		const raw = Number(input.value);
		if (!draggingZoom) {
			settlingThumb = false;
			changeZoom(raw);
			return;
		}
		const next = detent(raw, snappedZoom, zoomTravel);
		snappedZoom = next.snapped;
		// Keep the native thumb at the captured stop while the pointer moves.
		input.value = String(next.value);
		changeZoom(next.value);
	}

	/** @param {PointerEvent & { currentTarget: HTMLInputElement }} event */
	function grabZoom(event) {
		const input = event.currentTarget;
		zoomTravel = input.clientWidth - parseFloat(getComputedStyle(input).getPropertyValue('--hit'));
		snappedZoom = [0, 50, 100].includes(zoom) ? zoom : null;
		settlingThumb = false;
		zoomPointerReleased = false;
		draggingZoom = true;
	}

	function releaseZoom() {
		clearTimeout(zoomReleaseTimer);
		zoomReleaseTimer = undefined;
		zoomPointerReleased = false;
		draggingZoom = false;
		keyboardZoom = false;
		snappedZoom = null;
		settlingThumb = false;
	}

	function blurZoomInput() {
		// WebKit can blur a keyboard-focused range as a pointer drag begins.
		if (!draggingZoom) releaseZoom();
	}

	/** @param {KeyboardEvent} event */
	function releaseZoomKey(event) {
		if (keyboardZoom && event.key.startsWith('Arrow')) releaseZoom();
	}

	function commitZoomDrag() {
		if (!draggingZoom) return;
		releaseZoom();
		settlingThumb = true;
		if (zoomInput) zoomInput.value = String(zoom);
	}

	function finishZoomChange() {
		if (zoomPointerReleased) commitZoomDrag();
	}

	function finishZoomDrag() {
		if (!draggingZoom) return;
		zoomPointerReleased = true;
		// Firefox emits its final native input/change after pointerup.
		// change commits first; the timer also covers a grab with no value change.
		clearTimeout(zoomReleaseTimer);
		zoomReleaseTimer = setTimeout(commitZoomDrag, 0);
	}

	/** @param {KeyboardEvent} event */
	function handleZoomKeydown(event) {
		const direction = ['ArrowRight', 'ArrowUp'].includes(event.key)
			? 1
			: ['ArrowLeft', 'ArrowDown'].includes(event.key)
				? -1
				: 0;
		if (!direction) return;
		event.preventDefault();
		settlingThumb = false;
		keyboardZoom = true;
		changeZoom(Math.max(0, Math.min(100, Math.round(zoom) + direction)));
	}

	const SCROLL_KEYS = new Set([
		'PageUp',
		'PageDown',
		' ',
		'Home',
		'End',
		'ArrowUp',
		'ArrowDown',
		'ArrowLeft',
		'ArrowRight'
	]);

	function isScrollIntent(event) {
		if (event.type === 'wheel') return !event.ctrlKey;
		if (event.type === 'keydown') return event.target !== zoomInput && SCROLL_KEYS.has(event.key);
		return true;
	}

	function alignGallery(event) {
		if (!isScrollIntent(event)) return;
		const stop = nearestStop(zoom);
		if (view !== 'work' || studioOpen || draggingZoom || keyboardZoom || zoom === stop) return;
		settlingThumb = true;
		changeZoom(stop);
	}

	function handleGalleryWheel(event) {
		if (event.ctrlKey) return;
		alignGallery(event);
		if (!horizontalGallery || !scroller || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
		event.preventDefault();
		scroller.scrollLeft += event.deltaY;
	}
</script>

<svelte:window
	on:wheel|passive={alignGallery}
	on:touchmove|passive={alignGallery}
	on:keydown={alignGallery}
	on:pointerup={finishZoomDrag}
	on:pointercancel={releaseZoom}
	on:blur={releaseZoom}
/>

<section class="intro" aria-label="Selected work" bind:clientWidth={width}>
	<div class="zoom-track" aria-hidden="true" bind:this={zoomTrack}>
		<div bind:this={zoomContent}></div>
	</div>
	<div class="guide-vertical" aria-hidden="true" />
	<div class="guide-horizontal" aria-hidden="true" />
	<SiteLogo
		dark
		onclick={() => {
			view = 'work';
			dispatch('closestudio');
		}}
	/>
	<SiteMenu
		active={studioOpen ? 'studio' : view}
		onwork={() => {
			view = 'work';
			dispatch('closestudio');
		}}
		onindex={() => {
			view = 'index';
			dispatch('closestudio');
		}}
		onstudio={() => dispatch('studio')}
	/>
	{#if view === 'work'}
		<div class="control" data-snapped={snappedZoom !== null}>
			<input
				bind:this={zoomInput}
				type="range"
				min="0"
				max="100"
				step="0.1"
				value={zoom}
				on:input={updateZoom}
				on:change={finishZoomChange}
				on:keydown={handleZoomKeydown}
				on:pointerdown={grabZoom}
				on:keyup={releaseZoomKey}
				on:blur={blurZoomInput}
				aria-label="Image size"
				aria-valuetext={description}
			/>
			<ZoomThumb
				value={zoom}
				animate={draggingZoom || settlingThumb}
				onsettled={() => {
					if (!draggingZoom) settlingThumb = false;
				}}
			/>
		</div>
		<div
			class="gallery-scroll"
			class:vertical={verticalGallery}
			class:horizontal={horizontalGallery}
			bind:this={scroller}
			on:wheel|nonpassive={handleGalleryWheel}
		>
			<div
				class="canvas"
				style={`width:${canvasWidth * scale}px;height:${canvasHeight * scale}px;`}
			>
				{#each cards as card (card.id)}
					<button
						class="image-card"
						style={`transform:translate(${card.x * scale}px,${card.y * scale}px);width:${
							card.w * scale
						}px;--caption-size:${card.captionSize * scale}px;--caption-motion:${card.motion}px;--caption-trail-x:${card.captionTrailX}px;--caption-trail-y:${card.captionTrailY}px;`}
						aria-label={`View ${featuredProjects[card.asset].name}`}
						on:click={() => dispatch('select', featuredProjects[card.asset].projectId)}
					>
						<img
							src={`/images/intro/image-${card.asset}.jpg`}
							alt=""
							draggable="false"
							style={`height:${card.h * scale}px;`}
						/>
						<span class="caption">
							<span>{featuredProjects[card.asset].name}</span>
							<span>{featuredProjects[card.asset].client}</span>
							<span>{featuredProjects[card.asset].year}</span>
						</span>
					</button>
				{/each}
			</div>
		</div>
		<button class="enter" on:click={() => dispatch('select', 0)}>View projects →</button>
	{:else}
		<ProjectIndex {projects} on:select />
	{/if}
</section>

<style>
	.zoom-track {
		position: fixed;
		width: 1px;
		height: 1px;
		overflow: hidden;
		opacity: 0;
		pointer-events: none;
	}
	.zoom-track > div {
		height: 1001px;
	}

	.guide-vertical,
	.guide-horizontal {
		position: fixed;
		z-index: 10;
		background: #ff0000;
		pointer-events: none;
	}
	.guide-vertical {
		top: 0;
		bottom: 0;
		left: 74.26px;
		width: 1px;
	}
	.guide-horizontal {
		top: 38.07px;
		left: 0;
		right: 0;
		height: 1px;
	}
	.intro {
		position: relative;
		width: 100%;
		min-height: 100vh;
		background: white;
		color: #000;
	}
	.control {
		--hit: 35px;
		position: absolute;
		top: max(64px, 4.4vw);
		left: 5.15%;
		right: 5.85%;
		z-index: 2;
	}
	input {
		display: block;
		appearance: none;
		-webkit-appearance: none;
		width: 100%;
		height: 35px;
		padding: 0;
		margin: 0;
		border: 0;
		border-radius: 0;
		background: transparent;
		cursor: ew-resize;
	}
	input::-webkit-slider-runnable-track {
		height: 1px;
		background: #000;
	}
	input::-moz-range-track {
		height: 1px;
		background: #000;
	}
	input::-webkit-slider-thumb {
		appearance: none;
		-webkit-appearance: none;
		width: var(--hit);
		height: var(--hit);
		margin-top: calc((1px - var(--hit)) / 2);
		border: 0;
		border-radius: 50%;
		background: transparent;
	}
	input::-moz-range-thumb {
		width: var(--hit);
		height: var(--hit);
		border: 0;
		border-radius: 50%;
		background: transparent;
	}
	input:focus-visible {
		outline: 2px solid #bd62ff;
		outline-offset: 5px;
	}
	.gallery-scroll {
		padding-bottom: 80px;
		padding-top: max(0px, calc(90px - 7.85vw));
		overflow: auto;
		overscroll-behavior-x: contain;
	}
	.gallery-scroll.vertical {
		height: 100vh;
		box-sizing: border-box;
		overflow-x: hidden;
		overflow-y: auto;
		overscroll-behavior-y: contain;
	}
	.gallery-scroll.horizontal {
		overflow-x: auto;
		overflow-y: hidden;
	}
	.canvas {
		position: relative;
	}
	.image-card {
		position: absolute;
		top: 0;
		left: 0;
		contain: layout;
		display: block;
		padding: 0;
		margin: 0;
		border: 0;
		border-radius: 0;
		background: transparent;
		color: black;
		text-align: left;
		cursor: pointer;
		will-change: transform;
	}
	.image-card img {
		display: block;
		width: 100%;
		object-fit: cover;
	}
	.caption {
		display: block;
		margin-top: 5px;
		font-family: roc-grotesk, sans-serif;
		font-weight: 300;
		font-size: var(--caption-size);
		line-height: 1;
		color: #000;
		transform: translate(var(--caption-trail-x), var(--caption-trail-y));
		will-change: transform;
	}
	.caption > span {
		display: block;
		transform: translateY(var(--caption-motion));
	}
	.caption > span:nth-child(2) {
		transform: translateY(calc(var(--caption-motion) * 2));
	}
	.caption > span:nth-child(3) {
		transform: translateY(calc(var(--caption-motion) * 3));
	}
	.image-card:hover,
	.image-card:active {
		background: transparent;
	}
	.image-card:focus-visible {
		outline: 2px solid #bd62ff;
		outline-offset: 5px;
	}
	.enter {
		display: block;
		margin: 0 5.85% 24px auto;
		padding: 10px 0;
		border: 0;
		background: transparent;
		color: #000;
		font-family: 'Opposit-Medium';
		cursor: pointer;
	}
	.enter:focus-visible {
		outline: 2px solid #bd62ff;
	}
	@media (max-width: 720px) {
		.caption {
			font-size: max(6px, var(--caption-size));
		}
		.control {
			--hit: 25px;
			top: 64px;
		}
	}
</style>
