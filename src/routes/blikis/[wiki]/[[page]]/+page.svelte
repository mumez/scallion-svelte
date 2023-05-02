<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	export let data: PageData;

	import WikiPagePanel from '$lib/components/WikiPagePanel.svelte';
	import type { PageContent } from '$lib/models/PageContent';

	const pageName = $page.params['page'] ?? '';

	const pages = data.pages ?? [];

	console.log('loaded pages :>> ', pages);

	const loadedPageContent = data.page ?? ({} as PageContent);
</script>

{#if pageName}
	<WikiPagePanel {loadedPageContent} />
{/if}
