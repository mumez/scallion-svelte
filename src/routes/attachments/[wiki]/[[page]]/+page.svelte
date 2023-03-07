<script lang="ts">
	import { page } from '$app/stores';
	import { Table, tableSourceMapper, tableSourceValues } from '@skeletonlabs/skeleton';
	import FilesUploadPanel from '$lib/components/FilesUploadPanel.svelte';
	import parentLink from '$lib/stores/parentLink';
	import headerTitle from '$lib/stores/headerTitle';
	import type WebDavEntry from '$lib/utils/WebDavEntry';

	import FilesService from '$lib/services/FilesService';

	import type { PageData } from './$types';
	export let data: PageData;

	const wikiName = $page.params['wiki'] ?? '';
	const pageName = $page.params['page'] ?? 'index';
	$parentLink = wikiName;
	$headerTitle = pageName;

	const filesService = new FilesService(wikiName, pageName);
	const files = data.files;
	const filesTableHeaders: string[] = ['Name', 'Size', 'Date'];

	function onRowSelected(ev: CustomEvent) {
		console.log('-selected -row-', ev.detail);
	}

	function processRowsForTable(files: WebDavEntry[]) {
		let mappedVersions = tableSourceMapper(files, ['name', 'contentLength', 'lastModified']);
		mappedVersions = mappedVersions.map((v, i) => {
			v.lastModified = new Date(v.lastModified).toString();
			return {
				...v
			};
		});
		return tableSourceValues(mappedVersions);
	}

	async function uploadFile(file: File) {
		console.log('---upload :>> ', file);
		return await filesService.uploadFile(file);
	}

	function onUploadProgress(ev: CustomEvent) {
		console.log('--upload progress--', ev.detail);
	}

	$: filesTableBody = processRowsForTable(files);
</script>

<div class="container mx-auto p-4 space-y-4">
	<FilesUploadPanel uploader={uploadFile} on:upload-progress={onUploadProgress} />

	<Table
		source={{
			head: filesTableHeaders,
			body: filesTableBody
		}}
		interactive={true}
		on:selected={onRowSelected}
	/>
</div>
