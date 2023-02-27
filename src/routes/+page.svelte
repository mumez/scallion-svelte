<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
	$: wikiBooks = data.books ?? [];
</script>

<div class="container mx-auto p-8 space-y-8">
	<ul>
		{#each wikiBooks as wiki}
			<li>
				<a href="wikis/{wiki.name}/">{wiki.title}<span>{wiki.name}</span></a><span>({wiki.count})</span>
			</li>
		{/each}
	</ul>
</div>
