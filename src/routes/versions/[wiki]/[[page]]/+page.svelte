<script lang="ts">
	import { page } from '$app/stores';
	import { Table, Paginator, tableSourceMapper, tableSourceValues } from '@skeletonlabs/skeleton';
	import type { PaginationSettings } from '@skeletonlabs/skeleton/components/Paginator/types';
	import parentLink from '$lib/stores/parentLink';
	import headerTitle from '$lib/stores/headerTitle';
	import VersionsService from '$lib/services/VersionsService';
	import type {PageContent} from '$lib/models/PageContent';
	
	import type { PageData } from './$types';
	export let data: PageData;

	const wikiName = $page.params['wiki'] ?? '';
	const pageName = $page.params['page'] ?? 'index';
	$parentLink = wikiName;
	$headerTitle = pageName;

	const versionsService = new VersionsService(wikiName, pageName);
	const lastVersionNumber = data.lastVersionNumber;
	let versions = data.versions;	
	let versionFrom = lastVersionNumber;
	let rowsPerPage = 5;

	const versionsTableHeaders: string[] = ['Version', 'Content', 'Updater', 'Date'];

	let pagination = {
		offset: 0,
		limit: rowsPerPage,
		size: versionFrom,
		amounts: [5, 10]
	} as PaginationSettings;

	function onPageChange(e: CustomEvent) {
		const pageNum = e.detail;
		versionFrom = lastVersionNumber - pageNum * rowsPerPage;
		getVersions();
	}
	function onAmountChange(e: CustomEvent) {
		versionFrom = lastVersionNumber;
		rowsPerPage = e.detail;
		getVersions();
	}
	function onRowSelected(e: CustomEvent) {
		console.log('-selected -row-', e.detail);
	}
	async function getVersions(){
		versions = await versionsService.getVersions(versionFrom, rowsPerPage);
		console.log('getVersions:', versions);
	}
	function processVersionsForTable(versions: PageContent[]){
		let mappedVersions = tableSourceMapper(versions, ['content','updatedBy','updatedAt']);
		mappedVersions = mappedVersions.map((v, i) => {
			v.updatedAt = new Date(v.updatedAt);
			return {
				version: versionFrom - i,
				...v
			}
		});
		return tableSourceValues(mappedVersions);
	}

	$: versionsTableBody = processVersionsForTable(versions);
</script>

<div class="container mx-auto p-4 space-y-4">
	<Table
		source={{
			head: versionsTableHeaders,
			body: versionsTableBody
		}}
		interactive={true}
		on:selected={onRowSelected} 
	/>
	<Paginator bind:settings={pagination} on:page={onPageChange} on:amount={onAmountChange} />
</div>
