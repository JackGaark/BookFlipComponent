<script>
	/** @type {{dark?: boolean, onclick: () => void}} */
	let { dark = false, onclick } = $props();
</script>

<button class="site-logo" class:dark aria-label="Super Bonjour home" {onclick}>
	<img src="/images/sb-long-logo.svg" width="205.608" height="20" alt="Super Bonjour" />
</button>

<style>
	.site-logo {
		position: fixed;
		top: 30px;
		left: 50%;
		transform: translateX(-50%);
		z-index: 20;
		padding: 0;
		border: 0;
		background: transparent;
		cursor: pointer;
	}
	img {
		display: block;
		max-width: none;
	}
	.dark img {
		filter: brightness(0);
	}
	button:focus-visible {
		outline: 2px solid #bd62ff;
		outline-offset: 5px;
	}
</style>
