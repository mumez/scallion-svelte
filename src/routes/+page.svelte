<script lang="ts">
	import type { PageData } from './$types';
	import type { WikiBook } from '$lib/models/WikiBook';
	export let data: PageData;

	function initialPageForWiki(wiki: WikiBook) {
		return wiki.initialPageName ?? 'index';
	}

	$: wikiBooks = data.books ?? [];
</script>

<div class="container mx-auto p-8 space-y-8">
	<ul class="list-disc">
		{#each wikiBooks as wiki}
			<li class="text-xl">
				<a href="wikis/{wiki.name}/{initialPageForWiki(wiki)}" title={wiki.title}>{wiki.title}</a>
				<a href="blikis/{wiki.name}" title={wiki.title}>bliki</a><span class="px-1"
					>({wiki.count})</span
				>
			</li>
		{/each}
	</ul>
</div>
