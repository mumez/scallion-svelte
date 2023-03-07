<script lang="ts">
	import { page } from '$app/stores';
	export let wikiBookName = '';
</script>

{#if wikiBookName}
	<a href="//{$page.url.host}/wikis/{wikiBookName}">{wikiBookName}</a>
{/if}
