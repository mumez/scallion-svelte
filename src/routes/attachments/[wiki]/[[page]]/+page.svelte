<script lang="ts">
	import { page } from '$app/stores';
	import { _ } from '$lib/plugins/localization';
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
	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const wikiName = $page.params['wiki'] ?? '';
	const pageName = $page.params['page'] ?? 'index';
	$parentLink = wikiName;
	$headerTitle = pageName;
	const pageService = new PageService(wikiName, pageName);
	const filesService = new FilesService(wikiName, pageName);
	let files = $state(data.files);
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
		return files.map((file) => [
			file.name,
			formatFileSize(file.contentLength),
			new Date(file.lastModified).toLocaleDateString()
		]);
	}

	function formatFileSize(bytes: number): string {
		if (bytes === 0) return '0 B';
		const k = 1024;
		const sizes = ['B', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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

	let isPageLockedByOtherUser = $derived(isLockedByOtherUser($wikiPage?.pageContent, uid()));
	let filesTableBody = $derived(processRowsForTable(files));
</script>

<div class="container mx-auto p-4 space-y-4 swiki-attachments">
	{#if !isPageLockedByOtherUser}
		<FilesUploadPanel uploader={uploadFile} on:upload-end={onUploadEnd} />
	{/if}
	<div class="table-container">
		<table class="table table-hover">
			<thead>
				<tr>
					{#each filesTableHeaders as header}
						<th>{header}</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each filesTableBody as row, i}
					<tr class="cursor-pointer hover:bg-surface-100-800" onclick={() => onRowSelected(new CustomEvent('selected', { detail: [row[0]] }))}>
						{#each row as cell}
							<td>{cell}</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
