<script lang="ts">
	import { page } from '$app/stores';
	import { _ } from '$lib/plugins/localization';
	import parentLink from '$lib/stores/parentLink';
	import headerTitle from '$lib/stores/headerTitle';
	import wikisBaseDirectory from '$lib/stores/wikisBaseDirectory';
	import wikiPage from '$lib/stores/wikiPage';
	import MarkdownViewer from '$lib/components/MarkdownViewer.svelte';
	import AttachmentsPanel from '$lib/components/AttachmentsPanel.svelte';
	import PageService from '$lib/services/PageService';
	import FilesService from '$lib/services/FilesService';
	import type WebDavEntry from '$lib/utils/WebDavEntry';
	import WikiBookService from '$lib/services/WikiBookService';
	import { updatingPageContent, type PageContent } from '$lib/models/PageContent';

	import { email, uid } from '$lib/services/UserService';
	import { jwt } from '$lib/utils/ClientStorage';
	import { extractInternalPageLinks } from '$lib/utils/MarkdownHandler';

	import { onMount } from 'svelte';

	interface Props {
		loadedPageContent?: PageContent;
	}

	let { loadedPageContent = {} as PageContent }: Props = $props();
	const wikiName = $page.params['wiki'] ?? '';
	const pageName = $page.params['page'] ?? 'index';

	const pageService = new PageService(wikiName, pageName);
	const filesService = new FilesService(wikiName, pageName);
	const wikiBookService = new WikiBookService(wikiName);
	const attachmentsBaseUrl = filesService.downloadBaseUrl;

	let attachmentFiles: WebDavEntry[] = $state([]);

	let isNewPage = $state(!loadedPageContent.id);
	let hasContentTitle = !!loadedPageContent.title;
	let existingPageNames: string[] = $state([]);

	wikiPage.setPageContent(loadedPageContent);
	$parentLink = wikiName;
	$headerTitle = $wikiPage.pageContent?.title ?? pageName;

	let shouldLockOnSave = $state(loadedPageContent.isLocked ?? false);

	const initialEditingPageContent: PageContent = $wikiPage.revertingPageContent
		? $wikiPage.revertingPageContent
		: loadedPageContent;
	let contentTitle = $state(initialEditingPageContent.title);
	let textContent = $state(initialEditingPageContent.content);

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
		const updatedContent = await postContent();
		if (updatedContent.id) {
			applyUpdatedContent(updatedContent);
			isNewPage = false;
		}
		wikiPage.stopEditing();
	}
	async function updateContent() {
		const originalPageContent = $wikiPage.pageContent;
		if (originalPageContent && contentHasChanges()) {
			const updatedContent = await putContent(originalPageContent);
			if (updatedContent.id) {
				applyUpdatedContent(updatedContent);
			}
		}
		wikiPage.stopEditing();
	}

	function cancelContent() {
		textContent = $wikiPage.pageContent?.content ?? '';
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

	// private
	async function postContent() {
		const updatingContent = prepareUpdatingContent(initialEditingPageContent);
		return await pageService.postContent(updatingContent, jwt());
	}
	async function putContent(basePageContent: PageContent) {
		const updatingContent = prepareUpdatingContent(basePageContent);
		return await pageService.putContent(updatingContent, jwt());
	}
	function prepareUpdatingContent(basePageContent: PageContent) {
		const updatingContent = updatingPageContent(
			basePageContent,
			textContent,
			email(),
			shouldLockOnSave
		);
		if (hasContentTitle) {
			updatingContent.title = contentTitle;
		}
		return updatingContent;
	}
	function contentHasChanges() {
		return (
			textContent !== $wikiPage.pageContent?.content ||
			contentTitle !== $wikiPage.pageContent?.title
		);
	}
	function applyUpdatedContent(updatedContent: PageContent) {
		wikiPage.setPageContent(updatedContent);
		textContent = updatedContent.content;
		contentTitle = updatedContent.title;
		updateExistingPageNames();
		filesService.ensureDirectory(jwt());
	}

	// computed properties
	let updatedAt = $derived($wikiPage?.pageContent?.updatedAt ?? 0);
	let canLockOnSave = $derived($wikiPage?.pageContent?.ownedBy === uid());

	// editor height calculation
	function getEditorHeight(content: string) {
		return Math.max(250, content.split('\n').length * 24 + 100);
	}
</script>

<div class="container mx-auto p-4 space-y-4 swiki-page-{wikiName.toLowerCase()}">
	{#if hasContentTitle}
		{#if $wikiPage.isEditing}
			<input class="input" bind:value={contentTitle} />
		{/if}
	{/if}
	{#if isNewPage}
		<div>Empty page. Let's start editing.</div>
	{/if}

	{#if $wikiPage.isEditing}
		<div class="grid gap-4 grid-cols-2">
			<textarea 
				class="textarea" 
				bind:value={textContent}
				style="height: {getEditorHeight(textContent)}px; resize: vertical;"
			></textarea>
			<div style="height: {getEditorHeight(textContent)}px;">
				<MarkdownViewer
					markdown={textContent}
					{wikiName}
					{existingPageNames}
					wikisBaseDirectory={$wikisBaseDirectory}
					{attachmentsBaseUrl}
					isEditable={true}
				/>
			</div>
		</div>
	{:else}
		<MarkdownViewer
			markdown={textContent}
			{wikiName}
			{existingPageNames}
			wikisBaseDirectory={$wikisBaseDirectory}
			{attachmentsBaseUrl}
		/>
	{/if}
	{#if $wikiPage.isEditing}
		<AttachmentsPanel baseUrl={attachmentsBaseUrl} files={attachmentFiles} />
	{/if}
	<hr />
	<section class="flex space-x-2">
		{#if $wikiPage.isEditing}
			<button class="btn preset-filled-warning-500" onclick={cancelContent}>{$_('cancel')}</button>
			<button class="btn preset-filled-primary-500" onclick={saveContent}>{$_('save')}</button>
			{#if canLockOnSave}
				<label class="flex items-center space-x-2">
					<input class="checkbox" type="checkbox" bind:checked={shouldLockOnSave} />
					<p>{$_('lock')}</p>
				</label>
			{/if}
		{/if}
	</section>
	{#if updatedAt}
		<div>{new Date(updatedAt)}</div>
	{/if}
</div>
