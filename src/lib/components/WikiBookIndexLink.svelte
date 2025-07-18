<script lang="ts">
	import { page } from '$app/stores';
	interface Props {
		wikiBookName?: string;
		wikisBaseDirectory?: string;
	}

	let { wikiBookName = '', wikisBaseDirectory = '' }: Props = $props();
</script>

{#if wikiBookName}
	<a class="px-2" href="//{$page.url.host}/{wikisBaseDirectory}/{wikiBookName}">{wikiBookName}</a>
{/if}
