<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import WikiPagePanel from '$lib/components/WikiPagePanel.svelte';
	import WikiRecentUpdatesPanel from '$lib/components/WikiRecentUpdatesPanel.svelte';
	import type { PageContent } from '$lib/models/PageContent';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let pageName = $derived($page.params['page'] ?? '');
	let loadedPageContent = $derived(data.page ?? ({} as PageContent));
	let pages = $derived(data.pages ?? []);
</script>

{#if pageName}
	<WikiPagePanel {loadedPageContent} />
{:else}
	<WikiRecentUpdatesPanel {pages} />
{/if}
