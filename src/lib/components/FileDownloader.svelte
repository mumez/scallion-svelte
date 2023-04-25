<script lang="ts">
	import { Avatar } from '@skeletonlabs/skeleton';
	import { isImage, concatPath, extensionFrom } from '$lib/utils/FileUtils';
	import ModalCloseButton from '$lib/components/ModalCloseButton.svelte';

	export let fileName = '';
	export let baseUrl = '';

	const fullUrl = concatPath(baseUrl, fileName);

	async function download() {
		const resp = await fetch(fullUrl);
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

<div class="relative card p-4 w-modal shadow-xl">
	<ModalCloseButton />
	<div class="flex items-center">
		{#if isImage(fileName)}
			<Avatar src={fullUrl} rounded="rounded-xl" />
		{:else}
			<div class="card w-12 h-12 rounded-xl bg-white text-center truncate">
				{extensionFrom(fileName)}
			</div>
		{/if}
		<div class="p-2 truncate">
			<a href={fullUrl} on:click|preventDefault={download}>{fileName}</a>
		</div>
	</div>
	<slot />
</div>
