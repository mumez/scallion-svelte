<script lang="ts">
	import { page } from '$app/stores';
	import { _ } from '$lib/plugins/localization';
	import parentLink from '$lib/stores/parentLink';
	import headerTitle from '$lib/stores/headerTitle';
	import type { PageContent } from '$lib/models/PageContent';
	import SearchService from '$lib/services/SearchService';

	import { onMount } from 'svelte';

	const wikiName = $page.params['wiki'] ?? '';
	const pageName = $page.params['page'] ?? 'index';
	$parentLink = wikiName;
	$headerTitle = pageName;

	const searchService = new SearchService();

	let searchInput = '';
	let searchResults:PageContent[] = [];

	// lifecycle callbacks
	onMount(() => {
		//	retrievePageDescription();
	});

	async function search() {
		console.log(searchInput);
		searchResults = await searchService.searchPages(searchInput, wikiName);
		console.log('search result:', searchResults);
	}

	function clearSearchInput() {
		searchInput = '';
		searchResults = [];
	}

</script>

<div class="container mx-auto p-4 space-y-4 swiki-attachments">
	<div class="pt-2 pb-4">
		<label for="search" class="label text-lg"
			>{$_('Search in {wikiName}', { values: { wikiName: wikiName } })}</label
		>
		<div class="flex flex-row space-x-2">
			<div class="relative">
				<input
				name="search"
				class="input"
				type="text"
				placeholder="Enter a keyword"
				bind:value={searchInput}
				/>
				<button class="absolute inset-y-0 right-0 pl-2" on:click={clearSearchInput}>
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-5 w-5">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
					</svg>
				</button>
			</div>
			<button name="search" class="btn variant-filled-primary" on:click={search}
				>{$_('search')}</button
			>
		</div>
	</div>
</div>
