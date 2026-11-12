<script>
	/** @type {{active?: string, label?: string, onwork: () => void, onindex: () => void, onstudio: () => void, studioLabel?: string}} */
	let {
		active = '',
		label = 'Main navigation',
		onwork,
		onindex,
		onstudio,
		studioLabel = 'STUDIO'
	} = $props();
</script>

<nav aria-label={label}>
	<button class:active={active === 'work'} aria-pressed={active === 'work'} onclick={onwork}
		>WORK</button
	>
	<button class:active={active === 'index'} aria-pressed={active === 'index'} onclick={onindex}
		>INDEX</button
	>
	<button
		class:active={active === 'studio'}
		aria-pressed={active === 'studio'}
		aria-label={studioLabel}
		onclick={onstudio}>STUDIO</button
	>
</nav>

<style>
	nav {
		position: fixed;
		bottom: calc(30px + env(safe-area-inset-bottom, 0px));
		left: 50%;
		transform: translateX(-50%);
		z-index: 20;
		box-sizing: border-box;
		width: 245px;
		height: 18px;
		padding: 0 17px 0 20px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: var(--menu-background, rgb(255 255 255 / 80%));
		border-radius: 1px;
	}
	button {
		position: relative;
		padding: 0;
		margin: 0;
		border: 0;
		background: transparent;
		color: #000;
		font-family: roc-grotesk, sans-serif;
		font-size: 12px;
		font-weight: 500;
		line-height: 18px;
		cursor: pointer;
	}
	button::before {
		content: '';
		position: absolute;
		inset: -13px -8px;
	}
	button.active {
		color: #bd62ff;
	}
	button:focus-visible {
		outline: 2px solid #bd62ff;
		outline-offset: 5px;
	}
	@media (hover: hover) and (pointer: fine) {
		button:hover {
			color: #bd62ff;
		}
	}
</style>
