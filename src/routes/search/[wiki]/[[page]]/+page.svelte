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
		<label for="search" class="label text-lg"
			>{$_('Search in {wikiName}', { values: { wikiName: wikiName } })}</label
		>
		<form class="flex flex-row space-x-2">
			<div class="relative flex-grow">
				<input
					name="search"
					class="input"
					type="text"
					placeholder="Enter a keyword"
					bind:value={searchInput}
				/>
				<button class="absolute inset-y-0 right-0 pl-2" on:click={clearSearchInput}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						class="h-5 w-5"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>
			<button name="search" type="submit" class="btn variant-filled-primary" on:click={search}
				>{$_('search')}</button
			>
		</form>

		{#if isSearching}
			<div class="flex flex-row pt-4 space-x-2 flex justify-center">
				<ProgressRadial class="flex justify-center" />
			</div>
		{:else if searchResults.length > 0}
			<div class="flex-grow">
				<div class="flex flex-row space-x-2">
					<div class="flex-grow">
						<div class="font-bold">{$_('Title')}</div>
					</div>
					<div class="flex-grow">
						<div class="font-bold">{$_('Content')}</div>
					</div>
				</div>
				{#each searchResults as page}
					<div class="flex flex-row space-x-2">
						<div class="flex-grow">
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
