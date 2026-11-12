<svelte:options runes={false} />

<script>
	import { onMount, createEventDispatcher } from 'svelte';
	import SiteLogo from './SiteLogo.svelte';
	import SiteMenu from './SiteMenu.svelte';
	import { dialBeat, stepDial } from './wordmark-cursor.js';
	import WordmarkCursor from './WordmarkCursor.svelte';

	export let studioOpen = false;
	const dispatch = createEventDispatcher();
	let touchStart = 0;
	let entering = false;

	const image = (file, alt, project = 11, position = '50% 50%') => ({
		src: `/images/${file}.jpg`,
		alt,
		project,
		position
	});
	const video = (file, poster, project) => ({
		src: `/videos/${file}.mp4`,
		type: 'video',
		poster: `/images/${poster}.jpg`,
		alt: `${file} campaign film`,
		project,
		position: '50% 50%'
	});
	const pairs = [
		{
			top: {
				src: '/images/landing-rise.png',
				alt: 'White petals and dried flowers reflected in a pink and violet mirror',
				crop: 'still-life'
			},
			bottom: {
				src: '/images/landing-accra.png',
				alt: 'Fashion portrait in amber sunglasses beneath a clear blue sky',
				crop: 'portrait'
			}
		},
		{
			title: 'Fable Home',
			category: 'Campaign direction · Still life',
			top: video('Fable_6', '01_details_matter', 2),
			bottom: image('01_lay_the_table-03', 'Sunlit Fable tableware on a warm ochre table', 2)
		},
		{
			title: 'Call It Spring / Kit & Ace',
			category: 'Art direction · Photography',
			top: image('01-sb_cis_7', 'A model holding a sculpted bust against blue tile', 11, '50% 38%'),
			bottom: image(
				'05-sb_ka_1',
				'Kit & Ace campaign with architectural forms and blue knitwear',
				11,
				'50% 42%'
			)
		},
		{
			title: 'Nike / Little Burgundy',
			category: 'Campaign direction · Film',
			top: video('NIKE_6', '06-sb_cis_2', 9),
			bottom: video('LB_2_2v', '11-sb_2', 6)
		},
		{
			title: 'Fable Home',
			category: 'Art direction · Photography',
			top: image('01_details_matter', 'Light reflecting on polished Fable cutlery', 2),
			bottom: image('04_lay_the_table-04', 'Ceramics and fruit on a pink tablecloth', 2)
		},
		{
			title: 'ALDO / Rise',
			category: 'Campaign direction · Photography',
			top: image(
				'02-sb_aldo2',
				'ALDO fashion portraits with sunglasses and black dresses',
				11,
				'50% 35%'
			),
			bottom: image(
				'04-sb_rise_1b',
				'Fashion editorial against pale sky and textured stone',
				7,
				'50% 42%'
			)
		},
		{
			title: 'Nine Point',
			category: 'Branding · Film',
			top: video('NP_3', '12-sb-berlinb', 4),
			bottom: video('NP_4', '08-sb-boxts', 4)
		},
		{
			title: 'Fable Home',
			category: 'Campaign direction · Still life',
			top: image('03_back_in_stock', 'Stacked ceramic bowls in warm natural light', 2),
			bottom: image('05_come_together-02', 'A composition of Fable plates and bowls', 2)
		},
		{
			title: 'Call It Spring',
			category: 'Art direction · Campaign',
			top: image('06-sb_cis_2', 'Two models resting on colorful exercise mats', 11),
			bottom: image('07-sb_cis_3', 'Portrait against vivid pink flowers', 11, '50% 65%')
		},
		{
			title: 'Studio selections',
			category: 'Design · Identity',
			top: image('08-sb-boxts', 'Burgundy T-shirt with illustrated basketball graphics', 11),
			bottom: image('18-sb-denisets', 'Purple and yellow illustrated Denise shirts', 11)
		},
		{
			title: 'DAVIDs TEA / Fable Home',
			category: 'Campaign direction · Film & photography',
			top: video('DT_2', '06_shot_so_fresh', 17),
			bottom: image('06_shot_so_fresh', 'Fable ceramics submerged in sparkling water', 2)
		},
		{
			title: 'Kit & Ace / Call It Spring',
			category: 'Art direction · Photography',
			top: image(
				'09-sb_ka_3',
				'Sunlit campaign portraits against sky and a winding road',
				11,
				'50% 35%'
			),
			bottom: image('10-sb_4', 'A swimmer floating in a bright blue pool', 11)
		},
		{
			title: 'Little Burgundy / Call It Spring',
			category: 'Campaign direction · Photography',
			top: image(
				'11-sb_2',
				'Fashion portraits in front of an oversized pretzel mural',
				6,
				'50% 40%'
			),
			bottom: image('14-sb_cis_6', 'Portrait reflected in a car mirror in a desert landscape', 11)
		},
		{
			title: 'Studio selections',
			category: 'Design · Art direction',
			top: image('12-sb-berlinb', 'Blue illustrated bottles and Berlin Weiss typography', 11),
			bottom: image('20-sb-rentree4', 'Pink, lime and olive exhibition posters', 11)
		},
		{
			title: 'Rise / Call It Spring',
			category: 'Art direction · Photography',
			top: image('13-sb_rise_4b', 'Fashion editorial with metallic fabric and blue nails', 7),
			bottom: image('19-sb_cis_9b', 'Model in yellow on a typographic playground', 11)
		},
		{
			title: 'Call It Spring',
			category: 'Campaign direction · Photography',
			top: image('16-sb_boy_1', 'Playful fashion portraits in animal costumes', 11),
			bottom: image('17-sb_cis_5', 'Model posing beneath a giant green dinosaur', 11, '50% 60%')
		},
		{
			title: 'Call It Spring / Rise',
			category: 'Art direction · Photography',
			top: image(
				'21-sb_cis_8',
				'Red beret portrait paired with a streetwear photograph',
				11,
				'50% 35%'
			),
			bottom: image(
				'22-sb_rise_3',
				'Fashion compositions using bright red studio backdrops',
				7,
				'50% 35%'
			)
		},
		{
			title: 'Studio selections',
			category: 'Design · Campaign direction',
			top: image('23-sb-aluminium3', 'Aluminium design publication on vivid red fabric', 11),
			bottom: image('24-sb_cis_10', 'Model against a multicolored striped wall', 11)
		}
	];
	const DEFAULT_CUT_INTERVAL_MS = 300;
	const CENTER_CUT_INTERVAL_MS = 100;
	const EDGE_CUT_INTERVAL_MS = 2000;
	let leftInterval = DEFAULT_CUT_INTERVAL_MS;
	let rightInterval = DEFAULT_CUT_INTERVAL_MS * 3;
	let bookDirection = 1;
	let cursorActive = false;
	let cursorX = 0;
	let cursorY = 0;
	let book;
	let leftCurrent = 0;
	let rightCurrent = 0;
	let paused = false;
	let hidden = false;
	let ready = false;
	const panels = [pairs.map((pair) => pair.top), pairs.map((pair) => pair.bottom)];
	$: activeIndices = [leftCurrent, rightCurrent];
	$: playing = ready && !paused && !hidden && !studioOpen;

	function controlPlayback(element, state) {
		let latest = state;
		let blocked = false;
		function apply() {
			if (latest.active && latest.playing && !blocked) {
				element.muted = true;
				element.play().catch((error) => {
					if (error.name !== 'AbortError') {
						blocked = true;
						console.warn(
							'Video playback unavailable; keeping its poster while the sequence continues.',
							element.currentSrc,
							error
						);
					}
				});
			} else {
				element.pause();
			}
		}
		element.addEventListener('canplay', apply);
		apply();
		return {
			update(state) {
				latest = state;
				apply();
			},
			destroy() {
				element.pause();
				element.removeEventListener('canplay', apply);
			}
		};
	}

	function advance(direction) {
		leftCurrent = (leftCurrent + direction + pairs.length) % pairs.length;
		rightCurrent = (rightCurrent + direction + pairs.length) % pairs.length;
	}

	function updateCutInterval(event) {
		if (
			event.pointerType !== 'mouse' ||
			!window.matchMedia('(hover: hover) and (pointer: fine)').matches
		)
			return;
		cursorX = event.clientX;
		cursorY = event.clientY;
		const { left, width } = event.currentTarget.getBoundingClientRect();
		const position = (event.clientX - left) / width;
		const edgeProgress = Math.min(1, Math.abs(position - 0.5) * 2);
		const slowdown = edgeProgress ** 2 * (3 - 2 * edgeProgress);
		const interval =
			CENTER_CUT_INTERVAL_MS + slowdown * (EDGE_CUT_INTERVAL_MS - CENTER_CUT_INTERVAL_MS);
		bookDirection = position < 0.5 ? -1 : 1;
		cursorActive = true;
		if (position < 0.5) {
			leftInterval = interval;
			rightInterval = DEFAULT_CUT_INTERVAL_MS * 3;
		} else {
			leftInterval = DEFAULT_CUT_INTERVAL_MS;
			rightInterval = interval;
		}
	}

	onMount(() => {
		let mounted = true;
		const updateVisibility = () => {
			hidden = document.hidden;
		};
		updateVisibility();
		document.addEventListener('visibilitychange', updateVisibility);
		const sources = [
			...new Set(
				pairs.flatMap((pair) => [pair.top, pair.bottom]).map((item) => item.poster || item.src)
			)
		];
		Promise.all(
			sources.map(
				(src) =>
					new Promise((resolve) => {
						const img = new Image();
						img.onload = resolve;
						img.onerror = resolve;
						img.src = src;
					})
			)
		).then(() => {
			if (mounted) ready = true;
		});
		const TEMPO_RESPONSE_MS = 180;
		let lastFrame;
		const left = { rate: 1 / leftInterval, beat: 0 };
		const right = { rate: 1 / rightInterval, beat: 0 };
		const clocks = { [-1]: left, 1: right };
		let dial = 0;
		let activeSide = 0;
		let frame = requestAnimationFrame(tick);

		/** Advance both image clocks and return the dial position to paint. */
		function advanceClocks(elapsed, side) {
			const blend = 1 - Math.exp(-elapsed / TEMPO_RESPONSE_MS);
			left.rate += (1 / leftInterval - left.rate) * blend;
			right.rate += (1 / rightInterval - right.rate) * blend;
			let paint = dial;
			if (side) {
				const next = stepDial(dial, clocks[side].beat, elapsed * clocks[side].rate, side);
				dial = next.position;
				paint = next.paint;
			}
			left.beat += elapsed * left.rate;
			right.beat += elapsed * right.rate;
			if (left.beat >= 1) {
				leftCurrent = (leftCurrent + 1) % pairs.length;
				left.beat -= 1;
			}
			if (right.beat >= 1) {
				rightCurrent = (rightCurrent + 1) % pairs.length;
				right.beat -= 1;
			}
			return paint;
		}

		function tick(now) {
			const elapsed = Math.min(now - (lastFrame ?? now), 50);
			lastFrame = now;
			const side = cursorActive ? bookDirection : 0;
			if (side && side !== activeSide) clocks[side].beat = dialBeat(dial, side);
			activeSide = side;
			book?.setDialPosition(playing ? advanceClocks(elapsed, side) : dial);
			frame = requestAnimationFrame(tick);
		}

		return () => {
			mounted = false;
			cancelAnimationFrame(frame);
			document.removeEventListener('visibilitychange', updateVisibility);
		};
	});

	function enter() {
		if (!studioOpen && !entering) {
			entering = true;
			dispatch('enter');
		}
	}
</script>

<svelte:window
	on:keydown={(event) => {
		if (studioOpen || /INPUT|TEXTAREA|SELECT/.test(event.target.tagName)) return;
		if (event.key === 'ArrowRight') advance(1);
		if (event.key === 'ArrowLeft') advance(-1);
	}}
/>

<div
	class="landing"
	class:book-cursor={cursorActive && !studioOpen}
	on:pointerleave={() => {
		cursorActive = false;
	}}
	on:pointermove|passive={updateCutInterval}
	on:wheel|passive={(event) => {
		if (event.deltaY > 45) enter();
	}}
	on:touchstart|passive={(event) => {
		touchStart = event.touches[0].clientY;
	}}
	on:touchend|passive={(event) => {
		if (touchStart - event.changedTouches[0].clientY > 65) enter();
	}}
>
	<main class="stage" aria-label="Selected creative work">
		{#each panels as items, panelIndex}
			<div class="panel">
				{#each items as item, index}
					<div
						class="media"
						class:visible={index === activeIndices[panelIndex]}
						aria-hidden={index !== activeIndices[panelIndex]}
					>
						{#if item.type === 'video'}
							<video
								class="sequence-image"
								src={item.src}
								poster={item.poster}
								muted
								playsinline
								loop
								preload="auto"
								aria-label={item.alt}
								style:object-position={item.position}
								use:controlPlayback={{ active: index === activeIndices[panelIndex], playing }}
							/>
						{:else if item.crop}
							<div class="crop {item.crop}"><img src={item.src} alt={item.alt} /></div>
						{:else}
							<img
								class="sequence-image"
								src={item.src}
								alt={item.alt}
								style:object-position={item.position}
							/>
						{/if}
					</div>
				{/each}
			</div>
		{/each}
	</main>

	{#if !studioOpen}
		<div
			class="landing-book"
			class:following={cursorActive}
			style:--cursor-x={`${cursorX}px`}
			style:--cursor-y={`${cursorY}px`}
			inert={cursorActive}
		>
			<WordmarkCursor bind:this={book} />
		</div>
	{/if}

	<SiteLogo onclick={enter} />
	<SiteMenu onwork={enter} onindex={enter} onstudio={() => dispatch('studio')} />
	<button
		class="playback"
		aria-label={paused ? 'Play media sequence' : 'Pause media sequence'}
		aria-pressed={paused}
		on:click={() => {
			paused = !paused;
		}}>{paused ? 'Play' : 'Pause'}</button
	>
</div>

<style>
	.landing {
		position: relative;
		height: 100svh;
		min-height: 320px;
		background: #fff;
	}
	.landing-book {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		display: flex;
		z-index: 1;
	}
	@media (hover: hover) and (pointer: fine) {
		.book-cursor,
		.book-cursor :global(*) {
			cursor: none !important;
		}
		.landing-book {
			visibility: hidden;
			pointer-events: none;
		}
		.landing-book.following {
			visibility: visible;
			position: fixed;
			top: 0;
			left: 0;
			transform: translate3d(var(--cursor-x), var(--cursor-y), 0) translate(-50%, -50%);
			z-index: 30;
		}
	}
	.stage {
		position: absolute;
		inset: 0;
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
	.panel {
		position: relative;
		overflow: hidden;
	}
	.media {
		position: absolute;
		inset: 0;
		visibility: hidden;
	}
	.media.visible {
		visibility: visible;
	}
	.crop {
		position: absolute;
		width: max(100%, 81.8182svh);
		height: max(100%, 61.1111vw);
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}
	.panel img {
		position: absolute;
		max-width: none;
		display: block;
	}
	.panel .sequence-image {
		position: absolute;
		display: block;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.playback {
		position: absolute;
		right: 16px;
		bottom: 16px;
		min-width: 44px;
		min-height: 44px;
		color: white;
		font:
			10px 'Opposit-Medium',
			Arial,
			sans-serif;
		text-shadow: 0 1px 4px #000;
	}
	.still-life img {
		width: 208.45%;
		height: auto;
		left: -68.06%;
		top: -58.14%;
	}
	.portrait img {
		width: 155.13%;
		height: auto;
		left: -27.56%;
		top: -34.55%;
	}
	button {
		border: 0;
		border-radius: 0;
		margin: 0;
		padding: 0;
		background: transparent;
		cursor: pointer;
	}
	button:focus-visible {
		outline: 2px solid #bd62ff;
		outline-offset: 4px;
	}
</style>
