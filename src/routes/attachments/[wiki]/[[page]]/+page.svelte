<script lang="ts">
	import { page } from '$app/stores';
	import { Table, tableSourceMapper, tableSourceValues } from '@skeletonlabs/skeleton';
	import FilesUploader from '$lib/components/FilesUploader.svelte';
	import parentLink from '$lib/stores/parentLink';
	import headerTitle from '$lib/stores/headerTitle';
	import type WebDavEntry from '$lib/utils/WebDavEntry';

	import type { PageData } from './$types';
	export let data: PageData;

	const wikiName = $page.params['wiki'] ?? '';
	const pageName = $page.params['page'] ?? 'index';
	$parentLink = wikiName;
	$headerTitle = pageName;

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

	function uploadRequested(ev: CustomEvent) {
		const files: File[] = ev.detail;
		console.log('--upload requested--', files);
		
	}

	$: filesTableBody = processRowsForTable(files);
</script>

<div class="container mx-auto p-4 space-y-4">
	<FilesUploader on:request-upload={uploadRequested}/>

	<Table
		source={{
			head: filesTableHeaders,
			body: filesTableBody
		}}
		interactive={true}
		on:selected={onRowSelected}
	/>
</div>
