<script lang="ts">
	import { page } from '$app/stores';
	import { _ } from '$lib/plugins/localization';
	import parentLink from '$lib/stores/parentLink';
	import headerTitle from '$lib/stores/headerTitle';
	import wikiPage from '$lib/stores/wikiPage';
	import { jwt } from '$lib/utils/ClientStorage';
	import { uid } from '$lib/services/UserService';

	import { onMount } from 'svelte';

	const wikiName = $page.params['wiki'] ?? '';
	const pageName = $page.params['page'] ?? 'index';
	$parentLink = wikiName;
	$headerTitle = pageName;

	let searchInput = '';

	// lifecycle callbacks
	onMount(() => {
		//	retrievePageDescription();
	});

	function search() {
		console.log(searchInput);
	}
</script>

<div class="container mx-auto p-4 space-y-4 swiki-attachments">
	<div class="pt-2 pb-4">
		<label for="search" class="label text-lg"
			>{$_('Search in {wikiName}', { values: { wikiName: wikiName } })}</label
		>
		<div class="flex flex-row space-x-2">
			<input
				name="search"
				class="input"
				type="text"
				placeholder="Enter a keyword"
				bind:value={searchInput}
			/>
			<button name="search" class="btn variant-filled-primary" on:click={search}
				>{$_('search')}</button
			>
		</div>
	</div>
</div>
