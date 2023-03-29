<script lang="ts">
	import { page } from '$app/stores';
	export let wikiBookName = '';
</script>

{#if wikiBookName}
	<a class="px-2" href="//{$page.url.host}/wikis/{wikiBookName}">{wikiBookName}</a>
{/if}
