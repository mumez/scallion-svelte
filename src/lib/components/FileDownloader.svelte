<script lang="ts">
	import { Avatar } from '@skeletonlabs/skeleton';
	import ModalCloseButton from '$lib/components/ModalCloseButton.svelte';

	export let fileName = '';
	export let baseUrl = '';
	export let parent: unknown;

	function isImage() {
		return /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(fileName);
	}

	function fileExtension() {
		return fileName.slice((Math.max(0, fileName.lastIndexOf('.')) || Infinity) + 1);
	}

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
	}
</script>

<div class="relative">
	<ModalCloseButton />
	<div class="flex items-center">
		{#if isImage()}
			<Avatar src="{baseUrl}/{fileName}" rounded="rounded-xl" />
		{:else}
			<div class="card w-12 h-12 rounded-xl bg-white text-center truncate">{fileExtension()}</div>
		{/if}
		<div class="p-2 truncate">
			<a href="{baseUrl}/{fileName}" on:click|preventDefault={download}>{fileName}</a>
		</div>
	</div>
	<slot />
</div>
