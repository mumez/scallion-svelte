<script lang="ts">
	import { popup } from '@skeletonlabs/skeleton';
	import type { PopupSettings } from '@skeletonlabs/skeleton';
	import { Avatar } from '@skeletonlabs/skeleton';
	import { isImage, concatPath } from '$lib/utils/FileUtils';
	import { clipboard } from '@skeletonlabs/skeleton';

	export let fileName = '';
	export let baseUrl = '';

	const fullUrl = concatPath(baseUrl, fileName);
	const popupTarget = `popup-${fullUrl}`;
	const isTouchDevice = 'ontouchstart' in window;

	const imageTooltip: PopupSettings = {
		event: isTouchDevice ? 'click' : 'hover',
		placement: 'right',
		closeQuery: 'button, .avatar',
		target: popupTarget
	};

	let copied = false;
	function onClick(): void {
		copied = true;
		setTimeout(() => {
			copied = false;
		}, 1000);
	}
</script>

<div class="tooltip" data-popup={popupTarget}>
	{#if isImage(fileName)}
		<Avatar src={fullUrl} rounded="rounded-xl" />
		<div class="arrow variant-glass-primary bg-opacity-20" />
	{/if}
</div>
<div class="space-x-0">
	<button
		class="badge variant-ringed-primary"
		use:clipboard={fileName}
		use:popup={imageTooltip}
		on:click={onClick}
		disabled={copied}>{copied ? 'Copied ✓ ' : fileName}</button
	>
</div>
