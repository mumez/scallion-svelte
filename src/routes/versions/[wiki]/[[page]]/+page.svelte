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

	let lastVersionNumber = data.lastVersionNumber;
	let versions = data.versions;
	let wikiName = $page.params['wiki'] ?? '';
	let pageName = $page.params['page'] ?? 'index';

	const versionsService = new VersionsService(wikiName, pageName);

	$parentLink = wikiName;
	$headerTitle = pageName;

	let versionFrom = lastVersionNumber;
	let rowsPerPage = 5;

	const versionsTableHeaders: string[] = ['Version', 'Content', 'Updater', 'Date'];

	let pagination = {
		offset: 0,
		limit: rowsPerPage,
		size: versionFrom,
		amounts: [5, 10]
	} as PaginationSettings;

	function onPageChange(e: CustomEvent): void {
		const pageNum = e.detail;
		versionFrom = lastVersionNumber - pageNum * rowsPerPage;
		getVersions();
	}
	function onAmountChange(e: CustomEvent): void {
		versionFrom = lastVersionNumber;
		rowsPerPage = e.detail;
		getVersions();
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
	/>
	<Paginator bind:settings={pagination} on:page={onPageChange} on:amount={onAmountChange} />
</div>
