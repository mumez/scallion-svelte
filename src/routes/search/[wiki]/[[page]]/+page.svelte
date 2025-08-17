<script lang="ts">
	import { run } from 'svelte/legacy';

	import { tick } from 'svelte';
	import Mark from 'mark.js';
	import { ProgressRing } from '@skeletonlabs/skeleton-svelte';
	import { page } from '$app/stores';
	import { _ } from '$lib/plugins/localization';
	import parentLink from '$lib/stores/parentLink';
	import headerTitle from '$lib/stores/headerTitle';
	import type { PageContent } from '$lib/models/PageContent';
	import SearchService from '$lib/services/SearchService';
	import wikisBaseDirectory from '$lib/stores/wikisBaseDirectory';

	const wikiName = $derived($page.params['wiki'] ?? '');
	const pageName = $derived($page.params['page'] ?? 'index');
	
	$effect(() => {
		parentLink.set(wikiName);
		headerTitle.set(pageName);
	});

	const searchService = new SearchService();

	let isSearching = $state(false);
	let searchInput = $state('');
	let searchResults: PageContent[] = $state([]);

	let highlighter: Mark;
	let resultsArea: string | HTMLElement | readonly HTMLElement[] | NodeList | undefined = $state();

	async function search() {
		if (!searchInput) return;
		isSearching = true;
		searchResults = await searchService.searchPages(searchInput, wikiName);
		isSearching = false;
		await tick();
		highlightResults();
	}

	function highlightResults() {
		if (resultsArea) {
			highlighter = new Mark(resultsArea);
			highlighter.mark(searchInput);
		}
	}

	function clearSearchResults() {
		searchResults = [];
	}

	function urlForPage(page: PageContent) {
		return `/${$wikisBaseDirectory}/${wikiName}/${encodeURIComponent(page.name)}`;
	}

	run(() => {
		if (searchInput == '') {
			clearSearchResults();
		}
	});
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
						class="input border border-surface-400-600-token"
						type="search"
						id="search"
						placeholder={$_('enter-a-keyword')}
						bind:value={searchInput}
					/>
				</div>
				<button type="submit" class="btn preset-filled-primary-500" onclick={search}
					>{$_('search')}</button
				>
			</div>
		</form>
		<div class="flex pt-4 space-x-2" class:justify-center={isSearching} bind:this={resultsArea}>
			{#if isSearching}
				<ProgressRing />
			{:else if searchResults.length > 0}
				<div class="container space-y-2">
					<div class="flex flex-row">
						<div class="basis-1/6">
							<div class="font-bold">{$_('title')}</div>
						</div>
						<div class="basis-5/6">
							<div class="font-bold">{$_('content')}</div>
						</div>
					</div>
					{#each searchResults as page}
						<div class="flex flex-row">
							<div class="basis-1/6">
								<a href={urlForPage(page)}>{page.title ?? page.name}</a>
							</div>
							<div class="basis-5/6">
								{page.content}
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>
