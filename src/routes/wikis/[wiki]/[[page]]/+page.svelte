<script lang="ts">
	import { page } from '$app/stores';
	import parentLink from '$lib/stores/parentLink';
	import headerTitle from '$lib/stores/headerTitle';
	import wikiPage from '$lib/stores/wikiPage';

	import MarkdownViewer from '$lib/components/MarkdownViewer.svelte';

	import type { PageData } from './$types';
	export let data: PageData;

	let pageContent = data.page ?? {};
	let wikiName = $page.params['wiki'] ?? '';
	let pageName = $page.params['page'] ?? 'index';

	$parentLink = wikiName;
	$headerTitle = pageName;

	wikiPage.setPageContent(pageContent);

	let editingContent = pageContent.content;
	//setInterval(() => {editingContent = new Date().toString()},1000)

	$: buttonLabel = $wikiPage.isEditing ? 'Save' : 'Edit';
	
</script>

<div class="container mx-auto p-4 space-y-4">
	{#if $wikiPage.isEditing}
		<div class="grid gap-4 grid-cols-2">
			<textarea bind:value={editingContent}/>
			<MarkdownViewer markdown="{editingContent}"></MarkdownViewer>
		</div>
	{:else}
		<section class="border-solid border-2 p-4">{pageContent.content}</section>
		<p>Last update: {new Date(pageContent.updatedAt)}</p>
	{/if}
	<hr />
	<section class="flex space-x-2">
		<button class="btn variant-filled-primary" on:click={wikiPage.toggleEditing}>{buttonLabel}</button>
	</section>
</div>
