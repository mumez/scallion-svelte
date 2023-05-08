<script lang="ts">
	import { page } from '$app/stores';
	import { getLatestUpdates } from '$lib/utils/CoreUtils.js';
	import MarkdownViewer from '$lib/components/MarkdownViewer.svelte';
	import FilesService from '$lib/services/FilesService';
	import UpdatesService from '$lib/services/UpdatesService';
	import type { PageContent } from '$lib/models/PageContent';

	export let pages: PageContent[];

	const wikiName = $page.params['wiki'] ?? '';
	const wikiBasePart = ($page.route.id ?? '').split('/')[1];

	const updatesService = new UpdatesService(wikiName);

	function attachmentsBaseUrlFor(pageName: string) {
		const filesService = new FilesService(wikiName, pageName);
		return filesService.downloadBaseUrl;
	}

	function localeDateStringFor(updatedAt: number) {
		return new Date(updatedAt).toLocaleDateString();
	}
	function localeDateTimeStringFor(updatedAt: number) {
		return new Date(updatedAt).toLocaleString();
	}

	async function loadMore() {
		const moreUpdates = await updatesService.getUpdates(oldestUpdatedAt, 5);
		const morePages = getLatestUpdates<PageContent>(moreUpdates, 'name', 'updatedAt');
		pages = pages.concat(morePages);
		console.log('pages :>> ', pages);
	}

	$: oldestUpdatedAt = pages[pages.length - 1]?.updatedAt ?? 0;
</script>

<div class="container mx-auto p-4 space-y-4 swiki-{wikiName.toLowerCase()}">
	{#each pages as page}
		<h2 class="text-4xl">{localeDateStringFor(page.updatedAt)}</h2>
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
		<div class="text-right">{localeDateTimeStringFor(page.updatedAt)}</div>
	{/each}
	<div class="h-4" />
	<div class="flex justify-end">
		<button type="button" class="btn variant-ringed" on:click={loadMore}>
			<span>More...</span>
			<i class="fa-solid fa-angles-down" />
		</button>
	</div>
</div>
