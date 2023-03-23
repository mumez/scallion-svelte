<script lang="ts">
	// import { popup } from '@skeletonlabs/skeleton';
	// import type { PopupSettings } from '@skeletonlabs/skeleton';
	import { Avatar } from '@skeletonlabs/skeleton';
	import {isImage} from '$lib/utils/FileUtils';
	import { clipboard } from '@skeletonlabs/skeleton';

	export let fileName = '';
	export let baseUrl = '';

	const fullUrl = `${baseUrl}/${fileName}`;
	
	// let popupSettings: PopupSettings = {
	// 	event: 'hover',
	// 	target: 'examplePopup'
	// };


	let copied = false;
	function onClick(): void {
		copied = true;
		setTimeout(() => {
			copied = false;
		}, 1000);
	}
</script>

<div class="space-x-0">
	{#if isImage(fileName)}
		<Avatar src="{fullUrl}" rounded="rounded-xl" />
	{/if}
	<button
		class="badge variant-ringed-primary"
		use:clipboard={fileName}
		on:click={onClick}
		disabled={copied}>{copied ? 'Copied ✓ ' : fileName}</button
	>
</div>
