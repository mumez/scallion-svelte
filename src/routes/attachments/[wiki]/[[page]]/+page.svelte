<script lang="ts">
	import { page } from '$app/stores';
	import parentLink from '$lib/stores/parentLink';
	import headerTitle from '$lib/stores/headerTitle';
	import { Table, tableSourceMapper, tableSourceValues } from '@skeletonlabs/skeleton';
	import type WebDavEntry from '$lib/utils/WebDavEntry';

	import type { PageData } from './$types';
	export let data: PageData;

	const wikiName = $page.params['wiki'] ?? '';
	const pageName = $page.params['page'] ?? 'index';
	$parentLink = wikiName;
	$headerTitle = pageName;

	const files = data.files;
	
	const filesTableHeaders: string[] = ['Name', 'Size', 'Date'];

	function onRowSelected(e: CustomEvent) {
		console.log('-selected -row-', e.detail);
	}

	function processFilesForTable(files: WebDavEntry[]){
		let mappedVersions = tableSourceMapper(files, ['name','contentLength','lastModified']);
		return tableSourceValues(mappedVersions);
	}

	$: filesTableBody = processFilesForTable(files);
</script>

<div class="container mx-auto p-4 space-y-4">
	<Table
		source={{
			head: filesTableHeaders,
			body: filesTableBody
		}}
		interactive={true}
		on:selected={onRowSelected} 
	/>
</div>
