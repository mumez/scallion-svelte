<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';

	import MarkdownViewer from '$lib/components/MarkdownViewer.svelte';
	import FilesService from '$lib/services/FilesService';

	export let data: PageData;

	import WikiPagePanel from '$lib/components/WikiPagePanel.svelte';
	import type { PageContent } from '$lib/models/PageContent';

	const wikiName = $page.params['wiki'] ?? '';
	const pageName = $page.params['page'] ?? '';

	const wikiBasePart = ($page.route.id ?? '').split('/')[1];

	const pages = data.pages ?? [];
	console.log('loaded pages :>> ', pages);
	const loadedPageContent = data.page ?? ({} as PageContent);

	function attachmentsBaseUrlFor(pageName: string) {
		const filesService = new FilesService(wikiName, pageName);
		return filesService.downloadBaseUrl;
	}
</script>

{#if pageName}
	<WikiPagePanel {loadedPageContent} />
{:else}
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
{/if}
