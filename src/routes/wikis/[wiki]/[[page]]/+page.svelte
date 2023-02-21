<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	
	import pageTitle from '$lib/stores/pageTitle';

	onMount(() => {
		console.log('-mounted-?');
		$pageTitle = 'hoge';
	});

	$: wikiName = $page.params['wiki'];
	$: pageName = $page.params['page'] ?? 'index';
	
</script>

<div class="container mx-auto p-8 space-y-8">
	<h1>{wikiName}</h1>
	<p>{pageName}</p>
	<hr />
	<section class="card p-4">
		<p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
	</section>
	<hr />
	<section class="flex space-x-2">
		<a
			class="btn variant-filled-primary"
			href="https://kit.svelte.dev/"
			target="_blank"
			rel="noreferrer">SvelteKit</a
		>
		<a
			class="btn variant-filled-secondary"
			href="https://tailwindcss.com/"
			target="_blank"
			rel="noreferrer">Tailwind</a
		>
		<a
			class="btn variant-filled-tertiary"
			href="https://github.com/"
			target="_blank"
			rel="noreferrer">GitHub</a
		>
	</section>
</div>
