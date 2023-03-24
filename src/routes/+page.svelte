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
	<ul class="list-disc">
		{#each wikiBooks as wiki}
			<li class="text-xl">
				<a href="wikis/{wiki.name}/{initialPageFor(wiki)}" title="{wiki.title}">{wiki.title}</a
				><span class="px-1">({wiki.count})</span>
			</li>
		{/each}
	</ul>
</div>
