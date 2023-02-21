<script lang="ts">
	let wikiBooks = [
		{
			name: 'a',
			title: 'a-title',
			pageCount: 2
		},
		{
			name: 'b',
			title: 'b-title',
			pageCount: 3
		}
	];
</script>

<div class="container mx-auto p-8 space-y-8">
	<ul>
		{#each wikiBooks as wiki, idx}
			<li>
				<a href="wikis/{wiki.name}/">{wiki.title}<span>{wiki.name}</span></a><span>({wiki.pageCount})</span>
			</li>
		{/each}
	</ul>
</div>
