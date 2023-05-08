<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import WikiPagePanel from '$lib/components/WikiPagePanel.svelte';
	import WikiRecentUpdatesPanel from '$lib/components/WikiRecentUpdatesPanel.svelte';
	import type { PageContent } from '$lib/models/PageContent';

	export let data: PageData;
	const pages = data.pages ?? [];
	const loadedPageContent = data.page ?? ({} as PageContent);

	$: pageName = $page.params['page'] ?? '';
</script>

{#if pageName}
	<WikiPagePanel {loadedPageContent} />
{:else}
	<WikiRecentUpdatesPanel {pages} />
{/if}
