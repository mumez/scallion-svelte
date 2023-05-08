<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import WikiPagePanel from '$lib/components/WikiPagePanel.svelte';
	import WikiRecentUpdatesPanel from '$lib/components/WikiRecentUpdatesPanel.svelte';
	import type { PageContent } from '$lib/models/PageContent';

	export let data: PageData;
	const pageName = $page.params['page'] ?? '';
	const pages = data.pages ?? [];
	const loadedPageContent = data.page ?? ({} as PageContent);
</script>

{#if pageName}
	<WikiPagePanel {loadedPageContent} />
{:else}
	<WikiRecentUpdatesPanel {pages} />
{/if}
