<script lang="ts">
		import type { PopupSettings } from '@skeletonlabs/skeleton-svelte';
	import { Avatar } from '@skeletonlabs/skeleton-svelte';
	import { _ } from '$lib/plugins/localization';
	import { isImage, concatPath } from '$lib/utils/FileUtils';

	interface Props {
		fileName?: string;
		baseUrl?: string;
	}

	let { fileName = '', baseUrl = '' }: Props = $props();

	const fullUrl = concatPath(baseUrl, fileName);
	const popupTarget = `popup-${fullUrl}`;
	const isTouchDevice = 'ontouchstart' in window;

	const imageTooltip: PopupSettings = {
		event: isTouchDevice ? 'click' : 'hover',
		placement: 'right',
		closeQuery: 'button, .avatar',
		target: popupTarget
	};

	let copied = $state(false);
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
		<div class="arrow preset-tonal-primary bg-opacity-20"></div>
	{/if}
</div>
<div class="space-x-0">
	<button
		class="badge preset-outlined-primary-500"
		use:clipboard={clipboardTextFrom(fileName)}
		use:popup={imageTooltip}
		onclick={onClick}
		disabled={copied}>{copied ? $_('copied') + ' ✓ ' : fileName}</button
	>
</div>
