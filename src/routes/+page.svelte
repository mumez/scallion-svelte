<script lang="ts">
	import type { PageData } from './$types';
	import type { WikiBook } from '$lib/models/WikiBook.ts';
	export let data: PageData;

	function initialPageFor(wiki: WikiBook) {
		return wiki.initialPageName ?? 'index';
	}

	$: wikiBooks = data.books ?? [];
</script>

<div class="container mx-auto p-8 space-y-8">
	<ul>
		{#each wikiBooks as wiki}
			<li>
				<a href="wikis/{wiki.name}/{initialPageFor(wiki)}">{wiki.title}<span>{wiki.name}</span></a
				><span>({wiki.count})</span>
			</li>
		{/each}
	</ul>
</div>
