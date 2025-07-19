<script lang="ts">
	import { Avatar } from '@skeletonlabs/skeleton-svelte';
	import { _ } from '$lib/plugins/localization';
	import { isImage, concatPath } from '$lib/utils/FileUtils';

	interface Props {
		fileName?: string;
		baseUrl?: string;
	}

	let { fileName = '', baseUrl = '' }: Props = $props();

	const fullUrl = concatPath(baseUrl, fileName);
	let showTooltip = $state(false);

	let copied = $state(false);
	
	function onClick(): void {
		// Copy to clipboard manually
		const textToCopy = clipboardTextFrom(fileName);
		navigator.clipboard.writeText(textToCopy).then(() => {
			copied = true;
			setTimeout(() => {
				copied = false;
			}, 1000);
		});
	}
	
	function clipboardTextFrom(fileName: string): string {
		return `![${fileName}](${fileName})`;
	}
</script>

<div class="relative inline-block">
	{#if isImage(fileName) && showTooltip}
		<div class="absolute bottom-full left-0 mb-2 p-2 bg-surface-100-800 border border-surface-300-600 rounded shadow-lg z-10">
			<Avatar name={fileName} src={fullUrl} rounded="rounded-xl" />
		</div>
	{/if}
	
	<button
		class="badge preset-outlined-primary-500"
		onclick={onClick}
		onmouseenter={() => showTooltip = true}
		onmouseleave={() => showTooltip = false}
		disabled={copied}
	>
		{copied ? $_('copied') + ' ✓ ' : fileName}
	</button>
</div>
