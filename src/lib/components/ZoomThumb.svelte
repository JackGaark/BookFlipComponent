<script>
	import { onDestroy, untrack } from 'svelte';
	import { Spring } from 'svelte/motion';
	import { CIRCLE, THUMB_SPRING, thumbAppearance } from './zoom-thumb.js';

	/** @type {{ value: number, animate: boolean, reducedMotion: boolean, onsettled: () => void }} */
	let { value, animate, reducedMotion, onsettled } = $props();
	const thumb = new Spring(
		untrack(() => value),
		THUMB_SPRING
	);
	const movement = new Spring(0, THUMB_SPRING);
	const appearance = $derived(thumbAppearance(thumb.current, reducedMotion ? 0 : movement.current));

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

	let previousValue = untrack(() => value);
	$effect(() => {
		const nextValue = value;
		if (nextValue === previousValue) return;
		previousValue = nextValue;
		// Direct manipulation drives the shape independently of positional easing.
		movement.stiffness = 0.45;
		movement.damping = 0.8;
		void movement.set(1);
		const idle = setTimeout(() => {
			movement.stiffness = 0.3;
			movement.damping = 0.75;
			void movement.set(0);
		}, 80);
		return () => clearTimeout(idle);
	});

	onDestroy(() => {
		void thumb.set(thumb.target, { instant: true });
		void movement.set(0, { instant: true });
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
			style:transform={`translate(-50%, -50%) scale(${appearance.circleScale}, ${appearance.squash})`}
			style:opacity={appearance.circleOpacity}
		>
			<img src="/images/zoom/circle.svg" width={CIRCLE} height={CIRCLE} alt="" />
		</span>
		<span
			class="zoom-thumb__capsule"
			style:transform={`translate(-50%, -50%) scaleY(${appearance.squash})`}
			style:opacity={appearance.stretch}
		>
			<span class="bridge" style:transform={`translateX(-50%) scaleX(${appearance.bridgeScale})`}
			></span>
			<span class="cap left" style:transform={`translateX(${-appearance.capOffset}px)`}
				><img src="/images/zoom/expanded.svg" width="29" height="15" alt="" /></span
			>
			<span class="cap right" style:transform={`translateX(${appearance.capOffset}px)`}
				><img src="/images/zoom/expanded.svg" width="29" height="15" alt="" /></span
			>
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
	.zoom-thumb__capsule {
		width: 29px;
		height: 15px;
	}
	.cap {
		width: 14.5px;
		height: 15px;
		overflow: hidden;
	}
	.cap.right {
		left: 14.5px;
	}
	.right img {
		transform: translateX(-14.5px);
	}
	.bridge {
		left: 50%;
		width: 1px;
		height: 15px;
		background: #bd62ff;
	}
	img {
		display: block;
		max-width: none;
	}
</style>
