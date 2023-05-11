<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import WikiPagePanel from '$lib/components/WikiPagePanel.svelte';
	import WikiRecentUpdatesPanel from '$lib/components/WikiRecentUpdatesPanel.svelte';
	import type { PageContent } from '$lib/models/PageContent';

	export let data: PageData;

	$: pageName = $page.params['page'] ?? '';
	$: loadedPageContent = data.page ?? ({} as PageContent);
	$: pages = data.pages ?? [];
</script>

{#if pageName}
	<WikiPagePanel {loadedPageContent} />
{:else}
	<WikiRecentUpdatesPanel {pages} />
{/if}
