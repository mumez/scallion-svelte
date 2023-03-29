<script lang="ts">
	import { page } from '$app/stores';
	import isAuthenticated from '$lib/stores/isAuthenticated';
	import wikiPage from '$lib/stores/wikiPage';
	let wikiName = $page.params['wiki'] ?? '';
	let pageName = $page.params['page'] ?? 'index';

	$: routeFirstPart = ($page.route.id ?? '').split('/')[1];
	$: isAttachmentsButtonDisabled = routeFirstPart == 'attachments' || !$isAuthenticated;
	$: isVersionsButtonDisabled = routeFirstPart == 'versions';
</script>

<div class="space-x-0">
	{#if routeFirstPart == 'wikis'}
		<button
			class="btn-icon"
			disabled={$wikiPage.isEditing || !$isAuthenticated}
			on:click={wikiPage.startEditing}><i class="fa-solid fa-pen" /></button
		>
	{:else}
		<a href="/wikis/{wikiName}/{pageName}" class="btn-icon"><i class="fa-solid fa-pen" /></a>
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
