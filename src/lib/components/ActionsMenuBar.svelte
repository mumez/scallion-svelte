<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { uid } from '$lib/services/UserService';
	import isAuthenticated from '$lib/stores/isAuthenticated';
	import wikisBaseDirectory from '$lib/stores/wikisBaseDirectory';
	import wikiPage from '$lib/stores/wikiPage';
	import { isLockedByOtherUser } from '$lib/models/PageContent';

	const _wikisBaseDir = 'wikis';
	const _blikisBaseDir = 'blikis';

	let wikiName = $page.params['wiki'] ?? '';

	function startEditing() {
		wikiPage.startEditing();
		if (routeFirstPart == _blikisBaseDir && $wikiPage.pageContent == null) {
			const newPageName = new Date().toLocaleString();
			goto(`/${_blikisBaseDir}/${wikiName}/${encodeURIComponent(newPageName)}`);
		}
	}

	$: pageName = $page.params['page'] ?? 'index';
	$: pageNameEncoded = encodeURIComponent(pageName);
	$: routeFirstPart = ($page.route.id ?? '').split('/')[1];
	$: isPageLockedByOtherUser = isLockedByOtherUser($wikiPage?.pageContent, uid());
	$: isAttachmentsButtonDisabled =
		routeFirstPart == 'attachments' || !$isAuthenticated || isPageLockedByOtherUser;
	$: isVersionsButtonDisabled = routeFirstPart == 'versions';
	$: isWikiPageEditableRoute = isWikisRoute || isBlikisRoute;
	$: isWikisRoute = routeFirstPart == _wikisBaseDir;
	$: isBlikisRoute = routeFirstPart == _blikisBaseDir;
	$: hasNoPageParams = $page.params['page'] == undefined;
	$: isBlikisTopPage = hasNoPageParams && isBlikisRoute;
	$: if (routeFirstPart) {
		$wikisBaseDirectory = isWikiPageEditableRoute ? routeFirstPart : _wikisBaseDir;
	}
</script>

<div class="space-x-0">
	{#if isWikiPageEditableRoute}
		<button
			class="btn-icon"
			disabled={$wikiPage.isEditing || !$isAuthenticated || isPageLockedByOtherUser}
			on:click={startEditing}><i class="fa-solid fa-pen" /></button
		>
	{:else}
		<a href="/{$wikisBaseDirectory || routeFirstPart}/{wikiName}/{pageNameEncoded}" class="btn-icon"
			><i class="fa-solid fa-pen" /></a
		>
	{/if}
	{#if !isBlikisTopPage}
		<a
			class:disabled={isAttachmentsButtonDisabled}
			href="/attachments/{wikiName}/{pageNameEncoded}"
			class="btn-icon"><i class="fa-solid fa-arrow-up-from-bracket" /></a
		>
		<a
			class:disabled={isVersionsButtonDisabled}
			href="/versions/{wikiName}/{pageNameEncoded}"
			class="btn-icon"><i class="fa-solid fa-clock-rotate-left" /></a
		>
	{/if}
	<!-- <button class="btn-icon"><i class="fa-solid fa-ellipsis-vertical" /></button> -->
</div>

<style>
	.disabled {
		cursor: not-allowed !important;
		opacity: 0.5 !important;
	}
</style>
