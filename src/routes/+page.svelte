<script lang="ts">
	import type { PageData } from './$types';
	import type { WikiBook } from '$lib/models/WikiBook';
	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	function initialPageForWiki(wiki: WikiBook) {
		return wiki.initialPageName ?? 'index';
	}

	let wikiBooks = $derived(data.books ?? []);
</script>

<div class="container mx-auto p-8 space-y-8">
	<ul class="list-disc">
		{#each wikiBooks as wiki}
			<li class="text-xl">
				<a class="anchor" href="wikis/{wiki.name}/{initialPageForWiki(wiki)}" title={wiki.title}>{wiki.title}</a>
				<a class="anchor" href="blikis/{wiki.name}" title={wiki.title}>bliki</a><span class="px-1"
					>({wiki.count})</span
				>
			</li>
		{/each}
	</ul>
</div>
