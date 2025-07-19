<script lang="ts">
	import { _ } from '$lib/plugins/localization';
	import { page } from '$app/stores';
	import { Pagination } from '@skeletonlabs/skeleton-svelte';
	import VersionPreview from '$lib/components/VersionPreview.svelte';
	import parentLink from '$lib/stores/parentLink';
	import headerTitle from '$lib/stores/headerTitle';
	import VersionsService from '$lib/services/VersionsService';
	import PageService from '$lib/services/PageService';
	import type { PageContent } from '$lib/models/PageContent';
	import { openModal } from '$lib/utils/ModalOpener';

	import type { PageData } from './$types';
	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const wikiName = $page.params['wiki'] ?? '';
	const pageName = $page.params['page'] ?? 'index';
	$parentLink = wikiName;
	$headerTitle = pageName;

	const versionsService = new VersionsService(wikiName, pageName);
	const pageService = new PageService(wikiName, pageName);
	const lastVersionNumber = data.lastVersionNumber;
	let versions = $state(data.versions);
	let versionFrom = $state(lastVersionNumber);
	let rowsPerPage = $state(5);

	const versionsTableHeaders: string[] = ['version', 'content', 'updater', 'date'].map((h) =>
		$_(h)
	);

	let currentPage = $state(0);
	let pageSize = $derived(rowsPerPage);

	function onPageChange(details: { page: number }) {
		const pageNum = details.page;
		versionFrom = lastVersionNumber - pageNum * rowsPerPage;
		getVersions();
	}
	function onAmountChange(details: { pageSize: number }) {
		versionFrom = lastVersionNumber;
		rowsPerPage = details.pageSize;
		getVersions();
	}
	async function onRowSelected(e: CustomEvent) {
		const versionNumber = e.detail[0];
		const index = (lastVersionNumber - versionNumber) % rowsPerPage;
		const selectedVersion = versions[index];
		const latestPageContent = await pageService.getContent();
		openModal(VersionPreview, {
			pageContent: selectedVersion,
			latestPageContent,
			versionNumber
		});
	}
	async function getVersions() {
		versions = await versionsService.getVersions(versionFrom, rowsPerPage);
	}
	function processRowsForTable(versions: PageContent[]) {
		return versions.map((version, i) => [
			versionFrom - i,
			version.content.substring(0, 100) + (version.content.length > 100 ? '...' : ''),
			version.updatedBy,
			new Date(version.updatedAt).toLocaleDateString()
		]);
	}

	let versionsTableBody = $derived(processRowsForTable(versions));
</script>

<div class="container mx-auto p-4 space-y-4 swiki-versions">
	<div class="table-container">
		<table class="table table-hover">
			<thead>
				<tr>
					{#each versionsTableHeaders as header}
						<th>{header}</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each versionsTableBody as row, i}
					<tr class="cursor-pointer hover:bg-surface-100-800" onclick={() => onRowSelected(new CustomEvent('selected', { detail: [row[0]] }))}>
						{#each row as cell}
							<td>{cell}</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
	
	<Pagination
		data={versions}
		count={versionFrom}
		page={currentPage}
		pageSize={pageSize}
		siblingCount={1}
		onPageChange={onPageChange}
		onPageSizeChange={onAmountChange}
	/>
</div>
