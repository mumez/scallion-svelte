<script lang="ts">
	import { onMount } from 'svelte';

	export let fileName = '';
	export let baseUrl = '';
	export let parent: unknown;

	onMount(() => {
		console.log('parent :>> ', parent);
	});
</script>

<div class="">
	<div>
		<a href="{baseUrl}/{fileName}">{fileName}</a>
	</div>
	<slot />
	<footer class="modal-footer">
		<button class="btn">Download</button>
	</footer>
</div>
