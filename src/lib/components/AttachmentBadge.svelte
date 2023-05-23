<script lang="ts">
	import { popup, clipboard } from '@skeletonlabs/skeleton';
	import type { PopupSettings } from '@skeletonlabs/skeleton';
	import { Avatar } from '@skeletonlabs/skeleton';
	import { _ } from 'svelte-i18n';
	import { isImage, concatPath } from '$lib/utils/FileUtils';

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
	function clipboardTextFrom(fileName: string): string {
		return `![${fileName}](${fileName})`;
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
		use:clipboard={clipboardTextFrom(fileName)}
		use:popup={imageTooltip}
		on:click={onClick}
		disabled={copied}>{copied ? ($_('copied') + ' ✓ ') : fileName}</button
	>
</div>
