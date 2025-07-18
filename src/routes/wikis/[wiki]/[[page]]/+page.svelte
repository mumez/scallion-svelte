<script lang="ts">
	import type { PageData } from './$types';

	import WikiPagePanel from '$lib/components/WikiPagePanel.svelte';
	import type { PageContent } from '$lib/models/PageContent';
	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const loadedPageContent = data.page ?? ({} as PageContent);
</script>

<WikiPagePanel {loadedPageContent} />
