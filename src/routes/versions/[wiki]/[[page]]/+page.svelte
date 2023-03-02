<script lang="ts">
	import { page } from '$app/stores';
	import parentLink from '$lib/stores/parentLink';
	import headerTitle from '$lib/stores/headerTitle';
	import type { PageData } from './$types';
	export let data: PageData;

	let lastVersionNumber = data.lastVersionNumber;
	let versions = data.versions;
	let wikiName = $page.params['wiki'] ?? '';
	let pageName = $page.params['page'] ?? 'index';

	$parentLink = wikiName;
	$headerTitle = pageName;
</script>

<div class="container mx-auto p-4 space-y-4">
	{wikiName}{pageName}
	<div>{lastVersionNumber}</div>
	{#each versions as version}
		<li>{version.updatedAt}: {version.content}</li>
	{/each}
</div>
