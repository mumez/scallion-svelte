<script lang="ts">	
	import type { PageData } from './$types';
	export let data: PageData;

	import WikiPagePanel from '$lib/components/WikiPagePanel.svelte';
	import type { PageContent } from '$lib/models/PageContent';

	const loadedPageContent = data.page ?? {} as PageContent;
</script>

<div class="container mx-auto p-4 space-y-4">
	<WikiPagePanel {loadedPageContent} />
</div>
