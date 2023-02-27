<script lang="ts">
	//import { onMount } from 'svelte';
	import { page } from '$app/stores';
	
	//import pageTitle from '$lib/stores/pageTitle';

	import type { PageData } from './$types';
	export let data: PageData;
	
	// onMount(() => {
	// 	console.log('-mounted-?');
	// 	$pageTitle = 'hoge';
	// });

	$: wikiName = $page.params['wiki'];
	$: pageName = $page.params['page'] ?? 'index';
	$: pageContent = data.page ?? {};

</script>

<div class="container mx-auto p-8 space-y-8">
	<h1>{wikiName}</h1>
	<p>{pageName}</p>
	<hr />
	<section class="card p-4">
		<p>{pageContent.content}</p>
	</section>
	<hr />
	<section class="flex space-x-2">
		<a
			class="btn variant-filled-primary"
			href="https://kit.svelte.dev/"
			target="_blank"
			rel="noreferrer">SvelteKit</a
		>
	</section>
</div>
