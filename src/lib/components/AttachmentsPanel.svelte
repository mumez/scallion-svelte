<script lang="ts">
	import AttachmentBadge from '$lib/components/AttachmentBadge.svelte';
	import type WebDavEntry from '$lib/utils/WebDavEntry';

	interface Props {
		baseUrl?: string;
		files?: WebDavEntry[];
	}

	let { baseUrl = '', files = [] }: Props = $props();
</script>

<div class="space-x-0">
	{#each files as file (file.name)}
		<AttachmentBadge {baseUrl} fileName={file.name} />
	{/each}
</div>
