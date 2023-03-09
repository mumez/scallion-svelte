<script lang="ts">
	import ModalCloseButton from '$lib/components/ModalCloseButton.svelte';

	export let fileName = '';
	export let baseUrl = '';
	export let parent: unknown;

	async function download() {
		const resp = await fetch(`${baseUrl}/${fileName}`);
		const blob = await resp.blob();
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.style.display = 'none';
		a.href = url;
		a.download = `${fileName}`;
		document.body.appendChild(a);
		a.click();
		window.URL.revokeObjectURL(url);

		console.log('parent :>> ', parent);
	}
</script>

<div class="relative">
	<ModalCloseButton />
	<div>
		<a href="{baseUrl}/{fileName}" on:click|preventDefault={download}>{fileName}</a>
	</div>
	<slot />
</div>
