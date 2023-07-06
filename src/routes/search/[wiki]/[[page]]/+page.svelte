<script lang="ts">
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';
	import { _ } from '$lib/plugins/localization';
	import parentLink from '$lib/stores/parentLink';
	import headerTitle from '$lib/stores/headerTitle';
	import type { PageContent } from '$lib/models/PageContent';
	import SearchService from '$lib/services/SearchService';
	import wikisBaseDirectory from '$lib/stores/wikisBaseDirectory';

	const wikiName = $page.params['wiki'] ?? '';
	const pageName = $page.params['page'] ?? 'index';
	$parentLink = wikiName;
	$headerTitle = pageName;

	const searchService = new SearchService();

	let isSearching = false;
	let searchInput = '';
	let searchResults: PageContent[] = [];

	async function search() {
		console.log(searchInput);
		isSearching = true;
		searchResults = await searchService.searchPages(searchInput, wikiName);
		console.log('search result:', searchResults);
		isSearching = false;
	}

	function clearSearchInput() {
		searchInput = '';
		searchResults = [];
		console.log('clear', $wikisBaseDirectory);
	}

	function urlForPage(page: PageContent) {
		return `/${$wikisBaseDirectory}/${wikiName}/${encodeURIComponent(page.name)}`;
	}
</script>

<div class="container mx-auto p-4 space-y-4 swiki-attachments">
	<div class="pt-2 pb-4">
		<form>
			<label for="search" class="label text-lg"
				>{$_('search-in-{wikiName}', { values: { wikiName: wikiName } })}</label
			>
			<div class="flex flex-row space-x-2">
				<div class="relative flex-grow">
					<input
						class="input"
						type="search"
						id="search"
						placeholder="{$_('enter-a-keyword')}"
						bind:value={searchInput}
					/>
				</div>
				<button type="submit" class="btn variant-filled-primary" on:click={search}
					>{$_('search')}</button
				>
			</div>
		</form>

		{#if isSearching}
			<div class="flex flex-row pt-4 space-x-2 flex justify-center">
				<ProgressRadial class="flex justify-center" />
			</div>
		{:else if searchResults.length > 0}
			<div class="flex-grow pt-4">
				<div class="flex flex-row space-x-2">
					<div class="w-1/6">
						<div class="font-bold">{$_('Title')}</div>
					</div>
					<div class="flex-grow">
						<div class="font-bold">{$_('Content')}</div>
					</div>
				</div>
				{#each searchResults as page}
					<div class="flex flex-row space-x-2">
						<div class="w-1/6">
							<a href={urlForPage(page)}>{page.title ?? page.name}</a>
						</div>
						<div class="flex-grow">
							{page.content}
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
