<script lang="ts">
	import { page } from '$app/stores';
	export let wikiBookName = '';
	export let wikisBaseDirectory = '';
</script>

{#if wikiBookName}
	<a class="px-2" href="//{$page.url.host}/{wikisBaseDirectory}/{wikiBookName}">{wikiBookName}</a>
{/if}
