<script lang="ts">
	import { page } from '$app/stores';

	import MarkdownViewer from '$lib/components/MarkdownViewer.svelte';
	import FilesService from '$lib/services/FilesService';
	import type { PageContent } from '$lib/models/PageContent';

	export let pages: PageContent[];

	const wikiName = $page.params['wiki'] ?? '';
	const wikiBasePart = ($page.route.id ?? '').split('/')[1];

	function attachmentsBaseUrlFor(pageName: string) {
		const filesService = new FilesService(wikiName, pageName);
		return filesService.downloadBaseUrl;
	}
</script>

<div class="container mx-auto p-4 space-y-4 swiki-{wikiName.toLowerCase()}">
	{#each pages as page}
		<h2 class="text-4xl">{new Date(page.updatedAt).toLocaleDateString()}</h2>
		<div class="flex flex-col sm:flex-row justify-between">
			<div class="text-3xl sm:text-left mb-4 sm:mb-0">{page.name}</div>
			<div class="sm:text-right">{page.updatedBy}</div>
		</div>
		<MarkdownViewer
			markdown={page.content}
			{wikiName}
			{wikiBasePart}
			attachmentsBaseUrl={attachmentsBaseUrlFor(page.name)}
		/>
	{/each}
</div>
