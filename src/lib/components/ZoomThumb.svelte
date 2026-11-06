<script>
	import { onDestroy, untrack } from 'svelte';
	import { Spring } from 'svelte/motion';
	import { CIRCLE, CAPSULE, THUMB_SPRING, thumbAppearance } from './zoom-thumb.js';

	/** @type {{ value: number, animate: boolean, reducedMotion: boolean, onsettled: () => void }} */
	let { value, animate, reducedMotion, onsettled } = $props();
	const thumb = new Spring(
		untrack(() => value),
		THUMB_SPRING
	);
	const appearance = $derived(thumbAppearance(thumb.current));

	$effect(() => {
		const target = value;
		const instant = reducedMotion || !animate;
		const settled = onsettled;
		let active = true;
		untrack(() => thumb.set(target, { instant })).then(
			() => {
				if (active) settled();
			},
			() => {}
		);
		return () => {
			active = false;
		};
	});

	onDestroy(() => {
		void thumb.set(thumb.target, { instant: true });
	});
</script>

<div
	class="zoom-thumb"
	aria-hidden="true"
	data-position={appearance.position}
	data-stretch={appearance.stretch}
>
	<div class="zoom-thumb__position" style:transform={`translate3d(${appearance.position}%, 0, 0)`}>
		<span
			class="zoom-thumb__circle"
			style:transform={`translate(-50%, -50%) scaleX(${appearance.circleScale})`}
			style:opacity={appearance.circleOpacity}
		>
			<img src="/images/zoom/circle.svg" width={CIRCLE} height={CIRCLE} alt="" />
		</span>
		<span
			class="zoom-thumb__capsule"
			style:transform={`translate(-50%, -50%) scaleX(${appearance.capsuleScale})`}
			style:opacity={appearance.stretch}
		>
			<img src="/images/zoom/expanded.svg" width={CAPSULE} height={CIRCLE} alt="" />
		</span>
	</div>
</div>

<style>
	.zoom-thumb {
		position: absolute;
		top: 50%;
		left: calc(var(--hit) / 2);
		right: calc(var(--hit) / 2);
		pointer-events: none;
	}
	.zoom-thumb__position {
		will-change: transform;
	}
	span {
		position: absolute;
		top: 0;
		left: 0;
		transform-origin: center;
	}
	img {
		display: block;
		max-width: none;
	}
</style>
