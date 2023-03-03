<script lang="ts">
	import { page } from '$app/stores';
	import parentLink from '$lib/stores/parentLink';
	import headerTitle from '$lib/stores/headerTitle';
	import type { PageData } from './$types';
	import { Table, Paginator } from '@skeletonlabs/skeleton';
	export let data: PageData;

	let lastVersionNumber = data.lastVersionNumber;
	let versions = data.versions;
	let wikiName = $page.params['wiki'] ?? '';
	let pageName = $page.params['page'] ?? 'index';

	$parentLink = wikiName;
	$headerTitle = pageName;

	let versionFrom = lastVersionNumber;
	let rowsPerPage = 2;

	const versionsHeaders: string[] = ['Positions', 'Name', 'Weight', 'Symbol'];
	const sourceBody: any = [
		[1, 'Hydrogen', 1.0079, 'H'],
		[2, 'Helium', 4.0026, 'He'],
		[3, 'Lithium', 6.941, 'Li'],
		[4, 'Beryllium', 9.0122, 'Be'],
		[5, 'Boron', 10.811, 'B'],
		[6, 'Carbon', 12.0107, 'C'],
		[7, 'Nitrogen', 14.0067, 'N'],
		[8, 'Oxygen', 15.9994, 'O'],
		[9, 'Fluorine', 18.9984, 'F'],
		[10, 'Neon', 20.1797, 'Ne']
	];

	let pagination = {
		offset: 0,
		limit: rowsPerPage,
		size: versionFrom,
		amounts: [2, 5]
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
	function getVersions(){
		console.log('getVersions:', versionFrom, rowsPerPage)
	}

	$: sourceBodySliced = sourceBody.slice(
		pagination.offset * pagination.limit,
		pagination.offset * pagination.limit + pagination.limit
	);
</script>

<div class="container mx-auto p-4 space-y-4">
	{wikiName}{pageName}
	<div>offset:{pagination.offset}, limit:{pagination.limit}</div>
	{#each versions as version}
		<li>{version.updatedAt}: {version.content}</li>
	{/each}

	<Table
		source={{
			head: versionsHeaders,
			body: sourceBodySliced
		}}
	/>
	<Paginator bind:settings={pagination} on:page={onPageChange} on:amount={onAmountChange} />
</div>
