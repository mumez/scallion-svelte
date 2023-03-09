<script lang="ts">
	import { onMount } from 'svelte';

	export let fileName = '';
	export let parent: unknown;

	onMount(() => {
		console.log('parent :>> ', parent);
	});
</script>

<div class="">
	<div>
		click to file download {fileName}
	</div>
	<slot />
	<footer class="modal-footer">
		<button class="btn">Download</button>
	</footer>
</div>
