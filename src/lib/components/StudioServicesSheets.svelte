<script>
	/** @type {{visible: boolean, reducedMotion?: boolean}} */
	let { visible, reducedMotion = false } = $props();

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
</script>

<div
	class="sheets"
	class:visible
	class:reduced-motion={reducedMotion}
	inert={!visible}
	aria-hidden={!visible}
>
	<section class="panel services" aria-labelledby="studio-services-title">
		<div class="services-surface" aria-hidden="true"></div>
		<!-- svelte-ignore a11y_no_noninteractive_tabindex (Scrollable lists need keyboard focus.) -->
		<div class="panel-content" tabindex={visible ? 0 : -1} role="region" aria-label="Services">
			<h2 id="studio-services-title">Services</h2>
			<ul>
				{#each services as service}<li>{service}</li>{/each}
			</ul>
		</div>
	</section>
	<section class="panel clients" aria-labelledby="studio-clients-title">
		<!-- svelte-ignore a11y_no_noninteractive_tabindex (Scrollable lists need keyboard focus.) -->
		<div class="panel-content" tabindex={visible ? 0 : -1} role="region" aria-label="Client List">
			<h2 id="studio-clients-title">Client List</h2>
			<ul>
				{#each clients as client}<li>{client}</li>{/each}
			</ul>
		</div>
	</section>
</div>

<style>
	.sheets {
		position: absolute;
		inset: 0;
		pointer-events: none;
		z-index: 1;
	}
	.panel {
		position: absolute;
		bottom: 0;
		transform: translateY(calc(100% + 150px));
		transition: transform 750ms cubic-bezier(0.7, 0, 0.3, 1);
		pointer-events: none;
		color: #000;
	}
	.visible .panel {
		transform: translateY(0);
		transition-duration: 1000ms;
		pointer-events: auto;
	}
	.services {
		left: 1.9654%;
		top: 12.381%;
		width: 50.9434%;
	}
	.services-surface {
		position: absolute;
		inset: -25px -20px -15px;
		background: url('/images/studio/services-sheet.svg') center / 100% 100% no-repeat;
		pointer-events: none;
	}
	.clients {
		left: 50%;
		right: 0;
		top: 9.881%;
		bottom: 5px;
		background: #fff;
		box-shadow: 0 -5px 20px rgb(253 130 4 / 40%);
	}
	.visible .clients {
		transition-delay: 1000ms;
	}
	.panel-content {
		position: relative;
		height: 100%;
		box-sizing: border-box;
		overflow: auto;
		overscroll-behavior: contain;
		padding: 63px 13px 80px;
		scrollbar-width: thin;
	}
	.clients .panel-content {
		padding: 84px 10px 80px;
	}
	h2 {
		font:
			400 14px/1.3 moret,
			serif;
		letter-spacing: 0.7px;
		margin: 0 0 23px;
	}
	ul {
		list-style: none;
		margin: 0;
		padding: 0;
		font:
			500 16px/1.44 roc-grotesk,
			sans-serif;
	}
	.panel-content:focus-visible {
		outline: 2px solid #bd62ff;
		outline-offset: -4px;
	}
	.reduced-motion .panel {
		transition: none;
	}
	@media (max-width: 600px) {
		.services {
			left: 8px;
			top: 112px;
			width: calc(50% + 4px);
		}
		.clients {
			top: 96px;
		}
		.panel-content {
			padding: 24px 10px 88px;
		}
		.clients .panel-content {
			padding: 40px 10px 88px;
		}
		ul {
			font-size: 13px;
			line-height: 1.45;
		}
		li {
			margin-bottom: 6px;
			overflow-wrap: anywhere;
		}
		h2 {
			font-size: 13px;
			margin-bottom: 20px;
		}
	}
</style>
