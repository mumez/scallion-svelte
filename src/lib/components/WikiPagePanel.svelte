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

	import { email, uid } from '$lib/services/UserService';
	import { jwt } from '$lib/utils/ClientStorage';
	import { extractInternalPageLinks } from '$lib/utils/MarkdownHandler';

	import { onMount } from 'svelte';
	
	export let loadedPageContent: PageContent = {} as PageContent;
	const wikiName = $page.params['wiki'] ?? '';
	const pageName = $page.params['page'] ?? 'index';

	const pageService = new PageService(wikiName, pageName);
	const filesService = new FilesService(wikiName, pageName);
	const wikiBookService = new WikiBookService(wikiName);
	const baseAttachmentUrl = filesService.downloadBaseUrl;

	let attachmentFiles: WebDavEntry[] = [];

	$parentLink = wikiName;
	$headerTitle = pageName;

	let isNewPage = !loadedPageContent.id;
	let existingPageNames: string[] = [];
	wikiPage.setPageContent(loadedPageContent);

	let shouldLockOnSave = loadedPageContent.isLocked ?? false;

	const initialEditingPageContent = $wikiPage.revertingPageContent
		? $wikiPage.revertingPageContent
		: loadedPageContent;
	let editingContent = initialEditingPageContent.content;

	// lifecycle callbacks
	onMount(() => {
		updateExistingPageNames();
		retrieveAttachmentFiles();
	});

	// content editing
	async function saveContent() {
		if (isNewPage) {
			createContent();
		} else {
			updateContent();
		}
	}
	async function createContent() {
		const originalPageContent = initialEditingPageContent;
		const updatingContent = updatingPageContent(
			originalPageContent,
			editingContent,
			email(),
			shouldLockOnSave
		);
		const updatedContent = await pageService.postContent(updatingContent, jwt());
		if (updatedContent.id) {
			wikiPage.setPageContent(updatedContent);
			editingContent = updatedContent.content;
			updateExistingPageNames();
			filesService.ensureDirectory(jwt());
			isNewPage = false;
		}
		wikiPage.stopEditing();
	}
	async function updateContent() {
		const originalPageContent = $wikiPage.pageContent;
		if (originalPageContent && editingContent !== $wikiPage.pageContent?.content) {
			const updatingContent = updatingPageContent(
				originalPageContent,
				editingContent,
				email(),
				shouldLockOnSave
			);
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

	// retrieving
	async function retrieveAttachmentFiles() {
		attachmentFiles = await filesService.files();
	}

	// computed properties
	$: updatedAt = $wikiPage?.pageContent?.updatedAt ?? 0;
	$: canLockOnSave = $wikiPage?.pageContent?.ownedBy === uid();
</script>

<div class="swiki-{wikiName.toLowerCase()}">
	{#if isNewPage}
		<div>Empty page. Let's start editing.</div>
	{/if}
	{#if $wikiPage.isEditing}
		<div class="grid gap-4 grid-cols-2">
			<textarea class="textarea" rows="10" bind:value={editingContent} />
			<MarkdownViewer
				markdown={editingContent}
				{wikiName}
				{existingPageNames}
				{baseAttachmentUrl}
				isEditable={true}
			/>
		</div>
	{:else}
		<MarkdownViewer markdown={editingContent} {wikiName} {existingPageNames} {baseAttachmentUrl} />
	{/if}
	{#if $wikiPage.isEditing}
		<AttachmentsPanel baseUrl={baseAttachmentUrl} files={attachmentFiles} />
	{/if}
	<hr />
	<section class="flex space-x-2">
		{#if $wikiPage.isEditing}
			<button class="btn variant-filled-warning" on:click={cancelContent}>Cancel</button>
			<button class="btn variant-filled-primary" on:click={saveContent}>Save</button>
			{#if canLockOnSave}
				<label class="flex items-center space-x-2">
					<input class="checkbox" type="checkbox" bind:checked={shouldLockOnSave} />
					<p>Lock</p>
				</label>
			{/if}
		{/if}
	</section>
	{#if updatedAt}
		<div>{new Date(updatedAt)}</div>
	{/if}
</div>
