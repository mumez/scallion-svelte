<script lang="ts">
	import { groupBy, mapValues } from 'lodash-es';
	import { _ } from '$lib/plugins/localization';
	import { page } from '$app/stores';
	import parentLink from '$lib/stores/parentLink';
	import headerTitle from '$lib/stores/headerTitle';
	import wikisBaseDirectory from '$lib/stores/wikisBaseDirectory';
	import { getLatestUpdates } from '$lib/utils/CoreUtils.js';
	import MarkdownViewer from '$lib/components/MarkdownViewer.svelte';
	import FilesService from '$lib/services/FilesService';
	import UpdatesService from '$lib/services/UpdatesService';
	import type { PageContent } from '$lib/models/PageContent';

	export let pages: PageContent[];

	const wikiName = $page.params['wiki'] ?? '';
	$parentLink = wikiName;
	$headerTitle = 'Bliki';
	let allLoaded = false;

	const updatesService = new UpdatesService(wikiName);

	function attachmentsBaseUrlFor(pageName: string) {
		const filesService = new FilesService(wikiName, pageName);
		return filesService.downloadBaseUrl;
	}

	function dateRoundedValueFor(updatedAt: number) {
		const date = new Date(updatedAt);
		date.setHours(0, 0, 0, 0);
		return date.valueOf();
	}

	function localeDateStringFor(updatedAt: number) {
		return new Date(updatedAt).toLocaleDateString();
	}
	function localeDateTimeStringFor(updatedAt: number) {
		return new Date(updatedAt).toLocaleString();
	}

	async function loadMore() {
		const morePages = await updatesService.getUpdates(oldestUpdatedAt, 10);
		if (morePages.length == 0) {
			allLoaded = true;
		}
		pages = pages.concat(morePages);
	}

	function groupedPagesFrom(pages: PageContent[]) {
		let groups = groupBy(pages, (page) => dateRoundedValueFor(page.updatedAt));
		groups = mapValues(groups, (group) =>
			getLatestUpdates<PageContent>(group, 'name', 'updatedAt')
		);
		return Object.entries(groups).sort((a, b) => parseInt(b[0]) - parseInt(a[0]));
	}

	function urlForPage(page: PageContent) {
		return `/${$wikisBaseDirectory}/${wikiName}/${encodeURIComponent(page.name)}`;
	}

	$: oldestUpdatedAt = pages[pages.length - 1]?.updatedAt ?? 0;
	$: groupedPages = groupedPagesFrom(pages);
</script>

<div class="container mx-auto p-4 space-y-4 swiki-{wikiName.toLowerCase()}">
	{#each groupedPages as grouped}
		<h2 class="text-4xl">{localeDateStringFor(parseInt(grouped[0]))}</h2>
		{#each grouped[1] as page}
			<div class="flex flex-col sm:flex-row justify-between">
				<div class="text-3xl sm:text-left mb-4 sm:mb-0">
					<a href={urlForPage(page)}>{page.title ?? page.name}</a>
				</div>
				<div class="sm:text-right">{page.updatedBy}</div>
			</div>
			<MarkdownViewer
				markdown={page.content}
				{wikiName}
				wikisBaseDirectory={$wikisBaseDirectory}
				attachmentsBaseUrl={attachmentsBaseUrlFor(page.name)}
			/>
			<div class="text-right">{localeDateTimeStringFor(page.updatedAt)}</div>
		{/each}
	{/each}
	<div class="h-4" />
	<div class="flex justify-end">
		<button disabled={allLoaded} type="button" class="btn variant-ringed" on:click={loadMore}>
			<span>{$_('more') + '...'}</span>
			<i class="fa-solid fa-angles-down" />
		</button>
	</div>
</div>
