<script lang="ts">
	import AttachmentBadge from '$lib/components/AttachmentBadge.svelte';
	import type WebDavEntry from '$lib/utils/WebDavEntry';

	export let files: WebDavEntry[] = [];
</script>

<div class="space-x-0">
	{#each files as file}
		<AttachmentBadge fileName={file.name} />
	{/each}
</div>
