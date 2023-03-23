<script lang="ts">
	import { popup } from '@skeletonlabs/skeleton';
	import type { PopupSettings } from '@skeletonlabs/skeleton';
	import { Avatar } from '@skeletonlabs/skeleton';
	import { isImage } from '$lib/utils/FileUtils';
	import { clipboard } from '@skeletonlabs/skeleton';

	export let fileName = '';
	export let baseUrl = '';

	const fullUrl = `${baseUrl}/${fileName}`;

	let imageTooltip: PopupSettings = {
		event: 'hover-click',
		placement: 'top',
		target: 'image-tooltip'
	};

	let copied = false;
	function onClick(): void {
		copied = true;
		setTimeout(() => {
			copied = false;
		}, 1000);
	}
</script>

<div class="space-x-0">
	<div data-popup="image-tooltip">
		{#if isImage(fileName)}
			<Avatar data-popup="imageTooltip" src={fullUrl} rounded="rounded-xl" />
		{/if}
	</div>
	
	<button
		class="badge variant-ringed-primary"
		use:clipboard={fileName}
		use:popup={imageTooltip}
		on:click={onClick}
		disabled={copied}>{copied ? 'Copied ✓ ' : fileName}</button
	>
</div>
