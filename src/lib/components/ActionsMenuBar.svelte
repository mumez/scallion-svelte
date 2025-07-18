<script lang="ts">
	import { run } from 'svelte/legacy';

	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import type { Page } from '@sveltejs/kit';
	import { uid } from '$lib/services/UserService';
	import isAuthenticated from '$lib/stores/isAuthenticated';
	import wikisBaseDirectory from '$lib/stores/wikisBaseDirectory';
	import wikiPage from '$lib/stores/wikiPage';
	import { isLockedByOtherUser } from '$lib/models/PageContent';

	const _wikisBaseDir = 'wikis';
	const _blikisBaseDir = 'blikis';

	// Properly type the page store
	let wikiName = $derived($page?.params?.['wiki'] ?? '');

	function startEditing() {
		wikiPage.startEditing();
		if (routeFirstPart == _blikisBaseDir && $wikiPage.pageContent == null) {
			const newPageName = new Date().toLocaleString();
			goto(`/${_blikisBaseDir}/${wikiName}/${encodeURIComponent(newPageName)}`);
		}
	}

	let pageName = $derived($page.params['page'] ?? 'index');
	let pageNameEncoded = $derived(encodeURIComponent(pageName));
	let routeFirstPart = $derived(($page.route.id ?? '').split('/')[1]);
	let isPageLockedByOtherUser = $derived(isLockedByOtherUser($wikiPage?.pageContent, uid()));
	let isAttachmentsButtonDisabled =
		$derived(routeFirstPart == 'attachments' || !$isAuthenticated || isPageLockedByOtherUser);
	let isVersionsButtonDisabled = $derived(routeFirstPart == 'versions');
	let isWikisRoute = $derived(routeFirstPart == _wikisBaseDir);
	let isBlikisRoute = $derived(routeFirstPart == _blikisBaseDir);
	let isWikiPageEditableRoute = $derived(isWikisRoute || isBlikisRoute);
	let hasNoPageParams = $derived($page.params['page'] == undefined);
	let isBlikisTopPage = $derived(hasNoPageParams && isBlikisRoute);
	run(() => {
		if (routeFirstPart) {
			$wikisBaseDirectory = isWikiPageEditableRoute ? routeFirstPart : _wikisBaseDir;
		}
	});
</script>

<div class="space-x-0">
	{#if isWikiPageEditableRoute}
		<button
			class="btn-icon"
			disabled={$wikiPage.isEditing || !$isAuthenticated || isPageLockedByOtherUser}
			onclick={startEditing}
			aria-label="Edit"><i class="fa-solid fa-pen"></i></button
		>
	{:else}
		<a
			href="/{$wikisBaseDirectory || routeFirstPart}/{wikiName}/{pageNameEncoded}"
			class="btn-icon"
			aria-label="Edit"><i class="fa-solid fa-pen"></i></a
		>
	{/if}
	{#if !isBlikisTopPage}
		<a
			class:disabled={isAttachmentsButtonDisabled}
			href="/attachments/{wikiName}/{pageNameEncoded}"
			class="btn-icon"
			aria-label="Attachments"><i class="fa-solid fa-arrow-up-from-bracket"></i></a
		>
		<a
			class:disabled={isVersionsButtonDisabled}
			href="/versions/{wikiName}/{pageNameEncoded}"
			class="btn-icon"
			aria-label="Versions"><i class="fa-solid fa-clock-rotate-left"></i></a
		>
	{/if}
	<a class="btn-icon" href="/search/{wikiName}/{pageNameEncoded}" aria-label="Search"
		><i class="fa-solid fa-search"></i></a
	>
	<!-- <button class="btn-icon" on:click={openSearchModal}><i class="fa-solid fa-search" /></button> -->
	<!-- <button class="btn-icon"><i class="fa-solid fa-ellipsis-vertical" /></button>-->
</div>

<style>
	.disabled {
		cursor: not-allowed !important;
		opacity: 0.5 !important;
	}
</style>
