<script>
	import { onMount } from 'svelte';
	import { _ } from 'svelte-i18n';

	/** @type {{open?: boolean, motion?: 'system' | 'full', onclose?: () => void, onnavigate?: (view: string) => void}} */
	let { open = false, motion = 'system', onclose = () => {}, onnavigate = () => {} } = $props();
	/** @type {HTMLDialogElement | undefined} */
	let sheet = $state();
	let section = $state('bonjour');
	let reducedMotion = $state(true);
	const services = [
		'Creative Direction',
		'Brand Strategy, Naming & Strategy',
		'Campaign Direction',
		'Voice & Messaging',
		'Content Strategy & Creation',
		'Digital Strategy & Design',
		'Photography, Film & Motion Direction',
		'Art Direction',
		'Editorial Design',
		'Packaging Design',
		'Experiential Activations'
	];
	const clients = [
		'Nike',
		'Herschel Supply',
		'Little Burgundy Shoes',
		'Kombi',
		'Altitude Sports',
		'Ground Sounds',
		'Saje Wellness',
		'Fable Home',
		'Nine Point Cannabis PR',
		'Frank Ghery, The Grand LA',
		'Osei Duro',
		'HIRRS Bodywear',
		'La Firme',
		'Alain Carle Architect',
		'Call It Spring',
		'ALDO',
		'DAVIDs TEA',
		'Kit & Ace',
		'Eddie Bauer',
		'enRoute',
		'SAXX',
		'RISE Kombucha'
	];

	onMount(() => {
		const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
		const update = () => {
			reducedMotion = preference.matches;
		};
		update();
		preference.addEventListener('change', update);
		return () => preference.removeEventListener('change', update);
	});

	$effect(() => {
		const dialog = sheet;
		if (!dialog || (!open && !dialog.open)) return;
		const opening = open;
		const instant = reducedMotion && motion === 'system';
		const firstOpen = opening && !dialog.open;
		let cancelled = false;
		let frame = 0;
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';

		if (firstOpen) {
			section = 'bonjour';
			dialog.dataset.visible = 'false';
			dialog.showModal();
			dialog.querySelector('.content')?.scrollTo(0, 0);
		}

		const move = () => {
			if (cancelled) return;
			dialog.dataset.visible = String(opening);
			dialog.getBoundingClientRect();
			const finish = () => {
				if (!cancelled && !opening) {
					dialog.close();
					document.body.style.overflow = previousOverflow;
				}
			};
			if (instant) finish();
			else
				Promise.allSettled(dialog.getAnimations().map((animation) => animation.finished)).then(
					finish
				);
		};

		if (firstOpen && !instant) {
			// Paint the newly displayed dialog below the viewport before changing its target.
			// A layout read alone can coalesce both states when entering the top layer.
			frame = requestAnimationFrame(() => {
				frame = requestAnimationFrame(move);
			});
		} else move();

		return () => {
			cancelled = true;
			cancelAnimationFrame(frame);
			document.body.style.overflow = previousOverflow;
		};
	});

	/** @param {string} value */
	function selectSection(value) {
		section = value;
		sheet?.querySelector('.content')?.scrollTo(0, 0);
	}
</script>

<dialog
	bind:this={sheet}
	class="studio-sheet"
	data-visible="false"
	data-reduced-motion={reducedMotion && motion === 'system'}
	aria-label="Super Bonjour Studio"
	oncancel={(event) => {
		event.preventDefault();
		onclose();
	}}
	onclick={(event) => {
		if (
			sheet &&
			event.target === sheet &&
			(event.clientX < sheet.getBoundingClientRect().left ||
				event.clientX > sheet.getBoundingClientRect().right ||
				event.clientY < sheet.getBoundingClientRect().top)
		)
			onclose();
	}}
>
	<div class="sheet-layout">
		<nav class="sections" aria-label="Studio sections">
			<button
				class:active={section === 'bonjour'}
				aria-pressed={section === 'bonjour'}
				onclick={() => selectSection('bonjour')}>BONJOUR, HI</button
			>

			<button
				class:active={section === 'contact'}
				aria-pressed={section === 'contact'}
				onclick={() => selectSection('contact')}>CONTACT</button
			>
			<a href="https://www.superbonjour.com/" target="_blank" rel="noreferrer">PREVIOUS SITE</a>
		</nav>
		<div class="content">
			{#if section !== 'contact'}
				<h1>{$_('dialog.title')}</h1>
				<p class="intro">{$_('dialog.leftText')}</p>
				<div class="studio-lists">
					<section aria-labelledby="studio-services-title">
						<h2 id="studio-services-title">Services</h2>
						<ul>
							{#each services as service}<li>{service}</li>{/each}
						</ul>
					</section>
					<section aria-labelledby="studio-clients-title">
						<h2 id="studio-clients-title">Client List</h2>
						<ul>
							{#each clients as client}<li>{client}</li>{/each}
						</ul>
					</section>
				</div>
			{:else}
				<h1>{$_('dialog.sayHi.title')}</h1>
				<p class="intro">{$_('dialog.sayHi.p1.text1')}</p>
				<p class="contact-links">
					<a href="mailto:salut@superbonjour.com">salut@superbonjour.com</a><a
						href="https://www.instagram.com/super_bonjour/"
						target="_blank"
						rel="noreferrer">Instagram ↗</a
					><a
						href="https://www.linkedin.com/company/super-bonjour/"
						target="_blank"
						rel="noreferrer">LinkedIn ↗</a
					>
				</p>
				<p>{$_('dialog.sayHi.p1.text4')}</p>
				<div class="columns addresses">
					{#each ['address1', 'address2'] as address}<section>
							<h1>{@html $_(`dialog.sayHi.${address}.title`)}</h1>
							<p>{$_(`dialog.sayHi.${address}.text`)}</p>
						</section>{/each}
				</div>
			{/if}
		</div>

		<nav class="main-nav" aria-label="Studio navigation">
			<button onclick={() => onnavigate('work')}>WORK</button>
			<button onclick={() => onnavigate('index')}>INDEX</button>
			<button class="active" aria-label="Close Studio" onclick={onclose}>STUDIO</button>
		</nav>
	</div>
</dialog>

<style>
	.studio-sheet {
		position: fixed;
		transform: translateY(calc(100% + 40px));
		transition: transform 750ms cubic-bezier(0.23, 1, 0.32, 1);
		inset: min(4.545dvh, 40px) 0 0;
		width: auto;
		max-width: none;
		height: auto;
		max-height: none;
		margin: 0;
		padding: 0;
		border: 0;
		overflow: visible;
		background: #fff;
		color: #000;
		box-shadow: 0 -5px 20px 0 rgb(189 98 255 / 40%);
		font-family: roc-grotesk, sans-serif;
	}
	.studio-sheet:global([data-visible='true']) {
		transform: translateY(0);
		transition-duration: 1000ms;
		transition-timing-function: cubic-bezier(0.7, 0, 0.3, 1);
	}
	.studio-sheet[data-reduced-motion='true'] {
		transition: none;
	}
	.studio-sheet::backdrop {
		background: transparent;
	}
	.sheet-layout {
		position: relative;
		isolation: isolate;
		overflow: hidden;
		height: 100%;
		display: grid;
		grid-template-rows: 74px minmax(0, 1fr);
	}
	button,
	a {
		color: inherit;
	}
	button {
		border: 0;
		border-radius: 0;
		background: transparent;
		margin: 0;
		padding: 8px 0;
		cursor: pointer;
	}
	button:active {
		background: transparent;
	}
	button:focus-visible,
	a:focus-visible {
		outline: 2px solid #bd62ff;
		outline-offset: 4px;
	}
	.active {
		color: #bd62ff;
	}
	.sections {
		position: relative;
		z-index: 2;
		display: flex;
		justify-content: center;
		align-items: start;
		padding-top: 18px;
		gap: 75px;
	}
	.sections button,
	.sections a {
		font-family: moret, serif;
		font-size: 10px;
		font-weight: 400;
		line-height: 13px;
		white-space: nowrap;
	}
	.sections a {
		padding: 8px 0;
	}
	.content {
		overflow: auto;
		overscroll-behavior: contain;
		padding: 0 6.944444% 40px 6.527778%;
		scrollbar-width: none;
	}
	h1,
	h2 {
		font-family: moret, serif;
		font-weight: 400;
		font-size: 14px;
		line-height: 1.3;
		letter-spacing: 0.7px;
		margin: 0 0 12px;
	}
	.intro {
		font-size: clamp(24px, 2.5vw, 48px);
		font-weight: 500;
		line-height: 1.44;
		margin: 0;
	}
	.main-nav {
		position: absolute;
		bottom: 40px;
		left: 50%;
		transform: translateX(-50%);
		z-index: 2;
		display: flex;
		align-self: center;
		justify-self: center;
		justify-content: space-around;
		width: 245px;
		background: rgb(226 238 117 / 30%);
	}
	.main-nav button {
		font-size: 12px;
		line-height: 18px;
		padding: 0 12px;
	}
	.studio-lists {
		margin-top: 80px;
		display: grid;
		gap: 55px;
	}
	.studio-lists h2 {
		margin-bottom: 24px;
	}
	.studio-lists ul {
		list-style: none;
		margin: 0;
		padding: 0;
		font-size: 16px;
		font-weight: 500;
		line-height: 23px;
	}
	.columns {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 32px;
	}
	.contact-links {
		display: flex;
		flex-wrap: wrap;
		gap: 24px;
		margin: 32px 0;
		font-size: clamp(18px, 2vw, 28px);
	}
	.contact-links a {
		text-decoration: underline;
		text-underline-offset: 4px;
	}
	.addresses {
		margin-top: 40px;
	}
	@media (max-width: 600px) {
		.studio-sheet {
			left: 0;
			right: 0;
			top: 24px;
		}
		.sheet-layout {
			grid-template-rows: 90px minmax(0, 1fr) 72px;
		}
		.sections {
			flex-wrap: wrap;
			align-content: start;
			gap: 0 16px;
			padding: 16px 12px 0;
		}
		.content {
			padding: 0 24px 96px;
		}
		.intro {
			font-size: 25px;
			line-height: 1.35;
		}
		.columns {
			grid-template-columns: 1fr;
		}
		.main-nav {
			bottom: 24px;
		}
		.main-nav button {
			padding-block: 12px;
		}
	}
</style>
