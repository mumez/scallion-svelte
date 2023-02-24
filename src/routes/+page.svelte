<script lang="ts">
	import { onMount } from 'svelte';
	import wikiBookService from "$lib/services/WikiBookService";
	import type { WikiBook } from '$lib/models/WikiBook';
	
	let wikiBooks: WikiBook[] = [];

	onMount(async() =>{
		wikiBooks = await wikiBookService.listBooks();
	});

	
</script>

<div class="container mx-auto p-8 space-y-8">
	<ul>
		{#each wikiBooks as wiki, idx}
			<li>
				<a href="wikis/{wiki.name}/">{wiki.title}<span>{wiki.name}</span></a><span>({wiki.count})</span>
			</li>
		{/each}
	</ul>
</div>
