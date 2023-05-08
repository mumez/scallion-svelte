<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { uid } from '$lib/services/UserService';
	import isAuthenticated from '$lib/stores/isAuthenticated';
	import wikiPage from '$lib/stores/wikiPage';
	import { isLockedByOtherUser } from '$lib/models/PageContent';

	let wikiName = $page.params['wiki'] ?? '';
	let pageName = $page.params['page'] ?? 'index';

	function startEditing() {
		wikiPage.startEditing();
		if(routeFirstPart == 'blikis' && $wikiPage.pageContent == null){
			const newPageName = new Date().toLocaleDateString();
			goto(`/blikis/${wikiName}/${encodeURIComponent(newPageName)}`);
		}
	}

	$: routeFirstPart = ($page.route.id ?? '').split('/')[1];
	$: isPageLockedByOtherUser = isLockedByOtherUser($wikiPage?.pageContent, uid());
	$: isAttachmentsButtonDisabled =
		routeFirstPart == 'attachments' || !$isAuthenticated || isPageLockedByOtherUser;
	$: isVersionsButtonDisabled = routeFirstPart == 'versions';
	$: isWikiPageEditableRoute = routeFirstPart == 'wikis' || routeFirstPart == 'blikis';
</script>

<div class="space-x-0">
	{#if isWikiPageEditableRoute}
		<button
			class="btn-icon"
			disabled={$wikiPage.isEditing || !$isAuthenticated || isPageLockedByOtherUser}
			on:click={startEditing}><i class="fa-solid fa-pen" /></button
		>
	{:else}
		<a href="/{routeFirstPart}/{wikiName}/{pageName}" class="btn-icon"
			><i class="fa-solid fa-pen" /></a
		>
	{/if}
	<a
		class:disabled={isAttachmentsButtonDisabled}
		href="/attachments/{wikiName}/{pageName}"
		class="btn-icon"><i class="fa-solid fa-arrow-up-from-bracket" /></a
	>
	<a
		class:disabled={isVersionsButtonDisabled}
		href="/versions/{wikiName}/{pageName}"
		class="btn-icon"><i class="fa-solid fa-clock-rotate-left" /></a
	>
	<!-- <button class="btn-icon"><i class="fa-solid fa-ellipsis-vertical" /></button> -->
</div>

<style>
	.disabled {
		cursor: not-allowed !important;
		opacity: 0.5 !important;
	}
</style>
