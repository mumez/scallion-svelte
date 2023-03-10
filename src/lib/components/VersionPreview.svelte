<script lang="ts">
	import diff from 'simple-text-diff';
	import ModalCloseButton from '$lib/components/ModalCloseButton.svelte';
	import { closeModal } from '$lib/utils/ModalOpener';
	import type { PageContent } from '$lib/models/PageContent';

	export let parent: unknown;
	export let pageContent: PageContent;
	export let latestPageContent: PageContent;

	const diffResult = diff.diffPatch(latestPageContent.content, pageContent.content);

	function startEditing() {
		console.log('parent :>> ', parent);
		console.log('latestPageContent :>> ', latestPageContent);
		console.log('diffResult :>> ', diffResult);
	}
</script>

<div class="relative card p-4 w-modal shadow-xl">
	<ModalCloseButton />
	<div class="pt-4">
		<section class="diff border-solid border-2 p-4">
			{@html diffResult.before}
		</section>
		<div>↓</div>
		<section class="diff border-solid border-2 p-4">{@html diffResult.after}</section>
		<p>By: {pageContent.updatedBy}</p>
		<p>Date: {new Date(pageContent.updatedAt)}</p>
	</div>
	<footer class="modal-footer {parent.regionFooter}">
		<button class="btn variant-filled-warning" on:click={closeModal}>Cancel</button>
		<button class="btn variant-filled-primary" on:click={startEditing}>Start Editing</button>
	</footer>
	<slot />
</div>
