<script lang="ts">
	import { page } from '$app/stores';
	import parentLink from '$lib/stores/parentLink';
	import headerTitle from '$lib/stores/headerTitle';
	import {
		FileDropzone,
		Table,
		tableSourceMapper,
		tableSourceValues
	} from '@skeletonlabs/skeleton';
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

	$: filesTableBody = processRowsForTable(files);
</script>

<div class="container mx-auto p-4 space-y-4">
	<FileDropzone><svelte:fragment slot="message">(message)</svelte:fragment></FileDropzone>
	<Table
		source={{
			head: filesTableHeaders,
			body: filesTableBody
		}}
		interactive={true}
		on:selected={onRowSelected}
	/>
</div>
