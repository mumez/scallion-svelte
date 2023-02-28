<script lang="ts">
	import { page } from '$app/stores';
	import parentLink from '$lib/stores/parentLink';
	import pageTitle from '$lib/stores/pageTitle';

	import type { PageData } from './$types';
	export let data: PageData;

	let pageContent = data.page ?? {};
	let wikiName = $page.params['wiki'] ?? '';
	let pageName = $page.params['page'] ?? 'index';

	$parentLink = wikiName;
	$pageTitle = pageName;

</script>

<div class="container mx-auto p-4 space-y-4">
	<section class="border-solid border-2 p-4">{pageContent.content}</section>
	

	<p>Last update: {new Date(pageContent.updatedAt)}</p>
	<hr />
	<section class="flex space-x-2">
		<a
			class="btn variant-filled-primary"
			href="https://kit.svelte.dev/"
			target="_blank"
			rel="noreferrer">Edit</a
		>
	</section>
</div>
