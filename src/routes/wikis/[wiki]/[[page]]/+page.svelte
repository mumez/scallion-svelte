<script lang="ts">
	import { page } from '$app/stores';
	import parentLink from '$lib/stores/parentLink';
	import headerTitle from '$lib/stores/headerTitle';
	import wikiPage from '$lib/stores/wikiPage';
	import MarkdownViewer from '$lib/components/MarkdownViewer.svelte';
	import PageService from '$lib/services/PageService';
	import WikiBookService from '$lib/services/WikiBookService';
	import { updatingPageContent } from '$lib/models/PageContent';

	import { email } from '$lib/services/UserService';
	import { jwt } from '$lib/utils/ClientStorage';
	import { extractInternalLinks } from '$lib/utils/MarkdownParser';

	import type { PageData } from './$types';
	export let data: PageData;

	const loadedPageContent = data.page ?? {};
	const wikiName = $page.params['wiki'] ?? '';
	const pageName = $page.params['page'] ?? 'index';

	const pageService = new PageService(wikiName, pageName);
	const wikiBookService = new WikiBookService(wikiName);

	$parentLink = wikiName;
	$headerTitle = pageName;

	let isNewPage = !loadedPageContent.id;
	wikiPage.setPageContent(loadedPageContent);

	const initialEditingPageContent = $wikiPage.revertingPageContent
		? $wikiPage.revertingPageContent
		: loadedPageContent;
	let editingContent = initialEditingPageContent.content;

	async function saveContent() {
		if (isNewPage) {
			createContent();
		} else {
			updateContent();
		}
	}
	async function createContent() {
		const originalPageContent = initialEditingPageContent;
		const updatingContent = updatingPageContent(originalPageContent, editingContent, email());
		const updatedContent = await pageService.postContent(updatingContent, jwt());
		if (updatedContent.id) {
			wikiPage.setPageContent(updatedContent);
			editingContent = updatedContent.content;
		}
		wikiPage.stopEditing();
	}
	async function updateContent() {
		const originalPageContent = $wikiPage.pageContent;
		if (originalPageContent && editingContent !== $wikiPage.pageContent?.content) {
			const updatingContent = updatingPageContent(originalPageContent, editingContent, email());
			const updatedContent = await pageService.putContent(updatingContent, jwt());
			if (updatedContent.id) {
				wikiPage.setPageContent(updatedContent);
				editingContent = updatedContent.content;
			}
		}
		wikiPage.stopEditing();
	}

	function cancelContent() {
		editingContent = $wikiPage.pageContent?.content ?? '';
		wikiPage.stopEditing();
	}

	async function newPageNamesIn(markdown:string) {
		const internalLinks = extractInternalLinks(markdown);
		const hasPages = await wikiBookService.hasPages(internalLinks);
		return internalLinks.filter((_, idx) => hasPages[idx]);
	}

	$: updatedAt = $wikiPage.pageContent ? $wikiPage.pageContent.updatedAt : 0;
	$: existingPageNames = extractInternalLinks(editingContent);
</script>

<div class="container mx-auto p-4 space-y-4">
	{#if $wikiPage.isEditing}
		<div class="grid gap-4 grid-cols-2">
			<textarea class="textarea" rows="10" bind:value={editingContent} />
			<MarkdownViewer markdown={editingContent} existingPageNames={existingPageNames} />
		</div>
	{:else}
		<MarkdownViewer markdown={editingContent} existingPageNames={existingPageNames} />
	{/if}
	<hr />
	<section class="flex space-x-2">
		{#if $wikiPage.isEditing}
			<button class="btn variant-filled-warning" on:click={cancelContent}>Cancel</button>
			<button class="btn variant-filled-primary" on:click={saveContent}>Save</button>
		{/if}
	</section>
	{#if updatedAt}
		<div>{new Date(updatedAt)}</div>
	{/if}
</div>
