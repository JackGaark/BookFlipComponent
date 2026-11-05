<script>
	import DemoLinks from './DemoLinks.svelte';

	/** @type {{children: import('svelte').Snippet}} */
	let { children } = $props();
</script>

{@render children()}

<DemoLinks />
