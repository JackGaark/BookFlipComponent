<script>
	import SiteMenu from './SiteMenu.svelte';
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
	const clientColumns = [
		[
			'Alain Carle Architect',
			'ALDO',
			'Altitude Sports',
			'BLVD Shoes',
			'Bosa Properties',
			'Call It Spring',
			'DAVIDs TEA',
			'Duer',
			'Eddie Bauer',
			'enRoute',
			'Fable Home',
			'Frank Gehry, The Grand LA',
			'Ground Sounds',
			'Herschel Supply',
			'HIRRS Bodywear'
		],
		[
			'Independent Spirits Co.',
			'Kamik',
			'Kit & Ace',
			'Kombi',
			'La Firme',
			'Little Burgundy Shoes',
			'Nike',
			'Nine Point Cannabis PR',
			'Osei Duro',
			'RISE Kombucha',
			'Rise Theatre Directory',
			'Saje Wellness',
			'SAXX',
			'Submission Beauty',
			'Ward &'
		]
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
		<button
			class="section-control"
			class:active={section === 'bonjour'}
			aria-pressed={section === 'bonjour'}
			onclick={() => selectSection('bonjour')}>BONJOUR, HI</button
		>

		<button
			class="section-control"
			class:active={section === 'contact'}
			aria-pressed={section === 'contact'}
			onclick={() => selectSection('contact')}>CONTACT</button
		>
		<a class="section-control" href="https://www.superbonjour.com/" target="_blank" rel="noreferrer"
			>PREVIOUS SITE</a
		>
		<div
			class="content studio-content"
			inert={section === 'contact'}
			aria-hidden={section === 'contact'}
		>
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
					<div class="client-columns">
						{#each clientColumns as clients}
							<ul>
								{#each clients as client}<li>{client}</li>{/each}
							</ul>
						{/each}
					</div>
				</section>
			</div>
		</div>
		{#if section === 'contact'}
			<div class="content contact">
				<h1>Contact</h1>
				<div class="contact-copy">
					<p>
						We work with brands and businesses seeking strategy informed by cultural relevance and
						design that safeguards value and longevity. We advocate for progressive, sustainable
						lifestyles and we believe in accountability. We also believe in multiple time
						dimensions, but that’s beside the point. Contact us if any of that sounds right to you.
						You can get in touch
						<span class="flower" aria-hidden="true">✿</span>
						<a href="mailto:salut@superbonjour.com">via email</a>. Or
						<span class="pencil" aria-hidden="true">✎</span> slide into
						<a href="https://www.instagram.com/super_bonjour/" target="_blank" rel="noreferrer"
							>our DMs</a
						>
						if that’s your <span class="smile" aria-hidden="true">ツ</span> thing. Super Bonjour is founded
						by Reanna Evoy (PST) & Vanda Daftari (EST).
					</p>
				</div>
				<p class="contact-links">
					<a href="mailto:salut@superbonjour.com">GENERAL INQUIRIES</a> ·
					<a href="https://www.instagram.com/super_bonjour/" target="_blank" rel="noreferrer">IG</a>
					·
					<a href="https://www.linkedin.com/company/super-bonjour/" target="_blank" rel="noreferrer"
						>LINKEDIN</a
					>
				</p>
				<p class="land-acknowledgment">
					We acknowledge that in Vancouver we operate on unceded Coast Salish territory of the
					sḵwx̱wú7mesh (Squamish), sel̓íl̓witulh (Tsleil-Waututh), and xʷməθkʷəy̓əm (Musqueam) nations
					and that in Tiohtiá:ke (known as Montreal) we operate on the unceded traditional territory
					of the Kanien’kehá:ka Nation.
				</p>
			</div>
		{/if}

		<div class="main-nav" style="--menu-background: rgb(226 238 117 / 30%)">
			<SiteMenu
				label="Studio navigation"
				active="studio"
				onwork={() => onnavigate('work')}
				onindex={() => onnavigate('index')}
				onstudio={onclose}
				studioLabel="Close Studio"
			/>
		</div>
	</div>
</dialog>

<style>
	.studio-sheet {
		--sheet-enter-duration: 1000ms;
		--sheet-enter-easing: cubic-bezier(0.7, 0, 0.3, 1);
		position: fixed;
		transform: translateY(calc(100% + 40px));
		transition: transform 750ms cubic-bezier(0.23, 1, 0.32, 1);
		inset: 40px 0 0;
		width: auto;
		max-width: none;
		height: auto;
		max-height: none;
		margin: 0;
		padding: 0;
		border: 0;
		overflow: visible;
		background: #fff;
		box-shadow: 0 -5px 20px 0 rgb(189 98 255 / 40%);
		color: #000;
		font-family: roc-grotesk, sans-serif;
	}
	.studio-sheet:global([data-visible='true']) {
		transform: translateY(0);
		transition-duration: var(--sheet-enter-duration);
		transition-timing-function: var(--sheet-enter-easing);
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
		height: 100%;
		display: grid;
		grid-template: minmax(0, 1fr) / 1fr max-content max-content max-content 1fr;
		--section-gap: 75px;
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
	.section-control {
		grid-row: 1;
		align-self: start;
		z-index: 1;
		margin-top: 18px;
		padding: 8px 0;
		font-family: moret, serif;
		font-size: 10px;
		font-weight: 400;
		line-height: normal;
		white-space: nowrap;
		-webkit-text-stroke: 3px #fff;
		paint-order: stroke fill;
	}
	.section-control:nth-child(1) {
		grid-column: 2;
	}
	.section-control:nth-child(2) {
		grid-column: 3;
		margin-inline: var(--section-gap);
	}
	.section-control:nth-child(3) {
		grid-column: 4;
	}
	.content {
		grid-area: 1 / 1 / 2 / -1;
		overflow: auto;
		overscroll-behavior: contain;
		padding: 74px min(6.944444vw, 100px) 78px min(6.527778vw, 94px);
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
		font-size: clamp(24px, 2.916667vw, 42px);
		font-weight: 500;
		line-height: 1.25;
		margin: 0;
	}
	.studio-lists {
		margin-top: 80px;
		display: grid;
		grid-template-columns: 1fr 1fr;
	}
	.client-columns {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
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
	.contact {
		position: relative;
		z-index: 3;
		margin-top: 104px;
		padding: 117px min(6.527778vw, 94px) 63px;
		background: #fff;
		box-shadow: 0 -5px 20px 0 rgb(0 0 255 / 40%);
	}
	.sheet-layout:has(.contact) .main-nav {
		visibility: hidden;
	}
	.studio-sheet[data-reduced-motion='false'] .contact {
		animation: contact-enter var(--sheet-enter-duration) var(--sheet-enter-easing);
	}
	@keyframes contact-enter {
		from {
			transform: translateY(100%);
		}
	}
	.contact h1 {
		margin: 0;
	}
	.contact-copy {
		margin-top: 11px;
		font-size: clamp(24px, 2.916667vw, 42px);
		font-weight: 500;
		line-height: 1.25;
	}
	.contact-copy p {
		margin: 0;
	}
	.contact a {
		font: inherit;
	}
	.contact-copy a,
	.pencil {
		color: #00f;
	}
	.flower {
		color: #f00;
	}
	.smile {
		color: #fd8204;
	}
	.contact-links {
		margin: 40px 0 46px;
		line-height: 1.44;
		font-size: 12px;
		font-weight: 500;
	}
	.contact-links a {
		text-decoration: underline;
	}
	.land-acknowledgment {
		margin: 0;
		font-size: 10px;
		font-weight: 400;
		line-height: 1.44;
	}
	@media (max-width: 600px) {
		.sheet-layout {
			--section-gap: 16px;
		}
		.content {
			padding: 58px 24px 96px;
		}
		.contact {
			padding: 40px 24px 64px;
		}
		.studio-lists {
			grid-template-columns: 1fr;
			gap: 55px;
		}
		.intro {
			font-size: 25px;
			line-height: 1.35;
		}
	}
</style>
