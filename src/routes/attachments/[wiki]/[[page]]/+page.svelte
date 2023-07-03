<script lang="ts">
	import { page } from '$app/stores';
	import { _ } from '$lib/plugins/localization';
	import { Table, tableSourceMapper, tableSourceValues } from '@skeletonlabs/skeleton';
	import FilesUploadPanel from '$lib/components/FilesUploadPanel.svelte';
	import FileDownloader from '$lib/components/FileDownloader.svelte';
	import parentLink from '$lib/stores/parentLink';
	import headerTitle from '$lib/stores/headerTitle';
	import wikiPage from '$lib/stores/wikiPage';
	import type WebDavEntry from '$lib/utils/WebDavEntry';
	import { jwt } from '$lib/utils/ClientStorage';
	import { openModal } from '$lib/utils/ModalOpener';
	import { isLockedByOtherUser } from '$lib/models/PageContent';
	import { uid } from '$lib/services/UserService';
	import PageService from '$lib/services/PageService';
	import FilesService from '$lib/services/FilesService';

	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	export let data: PageData;

	const wikiName = $page.params['wiki'] ?? '';
	const pageName = $page.params['page'] ?? 'index';
	$parentLink = wikiName;
	$headerTitle = pageName;
	const pageService = new PageService(wikiName, pageName);
	const filesService = new FilesService(wikiName, pageName);
	let files = data.files;
	const filesTableHeaders: string[] = ['name', 'size', 'date'].map((h) => $_(h));

	// lifecycle callbacks
	onMount(() => {
		retrievePageDescription();
	});

	function onRowSelected(ev: CustomEvent) {
		const fileName = ev.detail[0];
		const baseUrl = filesService.downloadBaseUrl;
		openModal(FileDownloader, { baseUrl, fileName });
	}

	function processRowsForTable(files: WebDavEntry[]) {
		let mappedVersions = tableSourceMapper(files, ['name', 'contentLength', 'lastModified']);
		mappedVersions = mappedVersions.map((v) => {
			v.lastModified = new Date(v.lastModified).toString();
			return {
				...v
			};
		});
		return tableSourceValues(mappedVersions);
	}

	async function uploadFile(file: File) {
		return await filesService.uploadFile(file, jwt());
	}

	function onUploadEnd(_ev: CustomEvent) {
		reloadFiles();
	}

	async function reloadFiles() {
		files = await filesService.files();
	}

	// retrieving
	async function retrievePageDescription() {
		wikiPage.setPageContent(await pageService.getContent());
	}

	$: isPageLockedByOtherUser = isLockedByOtherUser($wikiPage?.pageContent, uid());
	$: filesTableBody = processRowsForTable(files);
</script>

<div class="container mx-auto p-4 space-y-4 swiki-attachments">
	{#if !isPageLockedByOtherUser}
		<FilesUploadPanel uploader={uploadFile} on:upload-end={onUploadEnd} />
	{/if}
	<Table
		source={{
			head: filesTableHeaders,
			body: filesTableBody
		}}
		interactive={true}
		on:selected={onRowSelected}
	/>
</div>
