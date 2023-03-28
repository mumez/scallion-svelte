<script lang="ts">
	import { page } from '$app/stores';
	import parentLink from '$lib/stores/parentLink';
	import headerTitle from '$lib/stores/headerTitle';
	import wikiPage from '$lib/stores/wikiPage';
	import MarkdownViewer from '$lib/components/MarkdownViewer.svelte';
	import AttachmentsPanel from '$lib/components/AttachmentsPanel.svelte';
	import PageService from '$lib/services/PageService';
	import FilesService from '$lib/services/FilesService';
	import type WebDavEntry from '$lib/utils/WebDavEntry';
	import WikiBookService from '$lib/services/WikiBookService';
	import { updatingPageContent } from '$lib/models/PageContent';

	import { email } from '$lib/services/UserService';
	import { jwt } from '$lib/utils/ClientStorage';
	import { extractInternalPageLinks } from '$lib/utils/MarkdownParser';

	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	export let data: PageData;

	const loadedPageContent = data.page ?? {};
	const wikiName = $page.params['wiki'] ?? '';
	const pageName = $page.params['page'] ?? 'index';

	const pageService = new PageService(wikiName, pageName);
	const filesService = new FilesService(wikiName, pageName);
	const wikiBookService = new WikiBookService(wikiName);
	const baseImageUrl = filesService.downloadBaseUrl;

	let attachmentFiles: WebDavEntry[] = [];

	$parentLink = wikiName;
	$headerTitle = pageName;

	let isNewPage = !loadedPageContent.id;
	let existingPageNames: string[] = [];
	wikiPage.setPageContent(loadedPageContent);

	onMount(() => {
		updateExistingPageNames();
		retrieveAttachmentFiles();
	});

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
			updateExistingPageNames();
			filesService.createDirectory(updatedContent.name, jwt());
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
				updateExistingPageNames();
			}
		}
		wikiPage.stopEditing();
	}

	function cancelContent() {
		editingContent = $wikiPage.pageContent?.content ?? '';
		wikiPage.stopEditing();
	}

	async function updateExistingPageNames() {
		existingPageNames = await existingPageNamesIn(
			$wikiPage.pageContent?.content ? $wikiPage.pageContent?.content : ''
		);
	}

	async function existingPageNamesIn(markdown: string) {
		const internalPageLinks = extractInternalPageLinks(markdown);
		const hasPages = await wikiBookService.hasPages(internalPageLinks);
		return internalPageLinks.filter((_, idx) => hasPages[idx]);
	}

	async function retrieveAttachmentFiles() {
		attachmentFiles = await filesService.files();
	}

	$: updatedAt = $wikiPage.pageContent ? $wikiPage.pageContent.updatedAt : 0;
</script>

<div class="container mx-auto p-4 space-y-4">
	{#if isNewPage}
		<div>Empty page. Let's start editing.</div>
	{:else}
		<div>{existingPageNames}</div>
	{/if}
	{#if $wikiPage.isEditing}
		<div class="grid gap-4 grid-cols-2">
			<textarea class="textarea" rows="10" bind:value={editingContent} />
			<MarkdownViewer markdown={editingContent} {existingPageNames} {baseImageUrl} />
		</div>
	{:else}
		<MarkdownViewer markdown={editingContent} {existingPageNames} {baseImageUrl} />
	{/if}
	{#if $wikiPage.isEditing}
		<AttachmentsPanel baseUrl={baseImageUrl} files={attachmentFiles} />
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
