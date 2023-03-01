<script lang="ts">
	import { page } from '$app/stores';
	import parentLink from '$lib/stores/parentLink';
	import headerTitle from '$lib/stores/headerTitle';
	import wikiPage from '$lib/stores/wikiPage';
	import MarkdownViewer from '$lib/components/MarkdownViewer.svelte';
	import PageService from '$lib/services/PageService';
	import { updatingPageContent } from '$lib/models/PageContent';

	import { uid } from '$lib/services/UserService';
	import { jwt } from '$lib/utils/ClientStorage';

	import type { PageData } from './$types';
	export let data: PageData;

	let pageContent = data.page ?? {};
	let wikiName = $page.params['wiki'] ?? '';
	let pageName = $page.params['page'] ?? 'index';

	const pageService = new PageService(wikiName, pageName);

	$parentLink = wikiName;
	$headerTitle = pageName;
	wikiPage.setPageContent(pageContent);

	let editingContent = pageContent.content;

	async function saveContent() {
		const originalPageContent = $wikiPage.pageContent;
		if (originalPageContent && editingContent !== $wikiPage.pageContent?.content) {
			const updatingContent = updatingPageContent(originalPageContent, editingContent, uid());
			const updatedContent = await pageService.putContent(updatingContent, jwt());
			if (updatedContent) {
				console.log('---updatedContent---', updatedContent);
				wikiPage.setPageContent(updatedContent);
				editingContent = updatedContent.content;
				console.log('---editingContent---', editingContent);
			}
		}
		wikiPage.stopEditing();
	}

	$: updatedAt = $wikiPage.pageContent ? $wikiPage.pageContent.updatedAt: 0;
</script>

<div class="container mx-auto p-4 space-y-4">
	{#if $wikiPage.isEditing}
		<div class="grid gap-4 grid-cols-2">
			<textarea class="textarea" rows="10" bind:value={editingContent} />
			<MarkdownViewer markdown={editingContent} />
		</div>
	{:else}
		<section class="border-solid border-2 p-4">{editingContent}</section>
		<p>Last update: {updatedAt} ; {new Date(updatedAt)}</p>
	{/if}
	<hr />
	<section class="flex space-x-2">
		{#if $wikiPage.isEditing}
			<button class="btn variant-filled-primary" on:click={saveContent}>Save</button>
		{:else}
			<button class="btn variant-filled-primary" on:click={wikiPage.startEditing}>Edit</button>
		{/if}
	</section>
</div>
