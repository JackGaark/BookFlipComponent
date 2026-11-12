<svelte:options runes={false} />

<script>
	import { createEventDispatcher } from 'svelte';
	import { _ } from 'svelte-i18n';

	export let projects = [];
	const dispatch = createEventDispatcher();
	const filters = ['Campaign', 'Branding', 'Editorial', 'Video', 'Client', 'All'];
	// Categories follow the services described in the existing project content.
	const categories = {
		0: ['Editorial', 'Branding'],
		1: ['Campaign', 'Branding'],
		2: ['Campaign'],
		3: ['Campaign', 'Branding'],
		4: ['Branding'],
		5: ['Branding'],
		6: ['Campaign'],
		7: ['Campaign', 'Branding'],
		8: ['Campaign'],
		9: ['Campaign'],
		10: ['Campaign'],
		11: ['Campaign'],
		12: ['Campaign'],
		13: ['Editorial'],
		14: ['Campaign', 'Branding'],
		15: ['Campaign'],
		16: ['Campaign']
	};
	// Wording from the Figma index (frame 5687:2615) where it differs from the project titles.
	const indexTitles = {
		0: { title: 'Magazine, Herschel' },
		1: { title: 'Campaign X, Osei Duro' },
		6: { year: '2019 20 21' },
		14: { title: 'Fall OOH Campaign, DAVIDs TEA' },
		15: { title: 'SAXX Father’s Day' }
	};
	let filter = 'All';
	let measuredSource = '';
	let previewRatio = 1;
	let hovered = null;
	let hoveredRowTop = 0;
	let hoveredRowIndex = 0;
	$: visibleProjects = projects.filter(
		(project) =>
			filter === 'All' ||
			filter === 'Client' ||
			(filter === 'Video'
				? project.slidesData.some((slide) => slide.type === 'video')
				: categories[project.id]?.includes(filter))
	);
	$: if (filter === 'Client')
		visibleProjects = [...visibleProjects].sort((a, b) => $_(a.title).localeCompare($_(b.title)));
	$: activeProject = projects.find((project) => project.id === hovered);
	$: preview =
		activeProject?.id === 1
			? '/images/intro/image-5.jpg'
			: activeProject?.id === 7
				? '/images/intro/image-3.jpg'
				: activeProject?.slidesData.find((slide) => slide.type === 'image')?.src;
	$: previewAbove = hoveredRowIndex >= Math.ceil(visibleProjects.length / 2);
	function showPreview(event, project, index) {
		hovered = project.id;
		hoveredRowTop = event.currentTarget.offsetTop;
		hoveredRowIndex = index;
	}
	function chooseFilter(value) {
		filter = value;
		hovered = null;
	}
</script>

<section class="project-index" aria-label="Project index">
	<div class="filters" aria-label="Filter projects">
		{#each filters as item}
			<button
				class:active={filter === item}
				aria-pressed={filter === item}
				on:click={() => chooseFilter(item)}>{item}</button
			>
		{/each}
	</div>
	<div class="rows" on:mouseleave={() => (hovered = null)}>
		{#each visibleProjects as project, index (project.id)}
			<button
				class="project-row"
				class:highlighted={hovered === project.id}
				on:mouseenter={(event) => showPreview(event, project, index)}
				on:focus={(event) => showPreview(event, project, index)}
				on:blur={() => (hovered = null)}
				on:click={() => dispatch('select', project.id)}
			>
				{indexTitles[project.id]?.title ?? $_(project.title).replace(/\s*—\s*$/, '')},
				<span class="year"
					>{indexTitles[project.id]?.year ?? $_(project.title2).replace('/', ' ')}</span
				>
			</button>
		{/each}
		{#if preview}
			<img
				class="preview"
				class:above={previewAbove}
				class:ready={measuredSource === preview}
				style={`top:${hoveredRowTop}px;--preview-ratio:${Math.sqrt(previewRatio)};`}
				on:load={(event) => {
					previewRatio = event.currentTarget.naturalWidth / event.currentTarget.naturalHeight;
					measuredSource = preview;
				}}
				src={preview.startsWith('/') ? preview : `/${preview}`}
				alt=""
			/>
		{/if}
	</div>
</section>

<style>
	.project-index {
		padding: 91px 84px 100px;
	}
	.filters {
		position: absolute;
		top: 64px;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		gap: 20px;
		white-space: nowrap;
	}
	.filters button {
		font-family: moret, serif;
		font-size: 10px;
		line-height: 12px;
		text-transform: uppercase;
		padding: 0;
		margin: 0;
		border: 0;
		background: transparent;
		color: #000;
		cursor: pointer;
	}
	.filters button.active {
		color: #bd62ff;
	}
	.rows {
		position: relative;
	}
	.project-row {
		display: block;
		width: 100%;
		min-height: 52px;
		padding: 0 10px 8px;
		margin: 0;
		border: 0;
		border-top: 1px solid #000;
		border-radius: 0;
		background: transparent;
		color: #000;
		text-align: left;
		font-family: roc-grotesk, sans-serif;
		font-size: 36px;
		font-weight: 500;
		line-height: 43px;
		cursor: pointer;
	}
	/* Figma sets the year as a 36px Moret superscript: it draws at 0.645em, raised 12px, with
	   the 1px underline 10.2px above the row's baseline (1.8px under the raised figures). */
	.year {
		position: relative;
		top: -0.517em;
		font-family: moret, serif;
		font-size: 0.645em;
		font-style: normal;
		font-weight: 400;
		line-height: 0;
		text-decoration-line: underline;
		text-decoration-style: solid;
		text-decoration-skip-ink: auto;
		text-decoration-thickness: 1px;
		text-underline-offset: 0.0775em;
	}
	.project-row.highlighted {
		color: #bd62ff;
		border-top-color: #bd62ff;
	}
	.project-row:focus-visible,
	.filters button:focus-visible {
		outline: 2px solid #bd62ff;
		outline-offset: 2px;
	}
	.preview {
		position: absolute;
		left: calc(49.23% - 84px);
		width: clamp(260px, calc(340px * var(--preview-ratio)), 560px);
		max-width: calc(100% - (49.23% - 84px));
		opacity: 0;
		height: auto;

		pointer-events: none;
		z-index: 1;
	}
	.preview.ready {
		opacity: 1;
		transition: opacity 150ms ease-out;
	}
	.preview.above {
		transform: translateY(-100%);
	}
	@media (max-width: 1000px) {
		.project-row {
			font-size: clamp(18px, 2.5vw, 36px);
		}
		.preview {
			left: 44%;
			width: clamp(20vw, calc(27vw * var(--preview-ratio)), 44vw);
			max-width: 56%;
		}
	}
	@media (max-width: 600px) {
		.project-index {
			padding-right: 20px;
		}
		.project-row {
			padding: 8px 0;
			line-height: 1.2;
			min-height: 52px;
		}
		.filters {
			gap: 10px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.preview.ready {
			transition: none;
		}
	}
	@media (hover: none) {
		.preview {
			display: none;
		}
	}
</style>
