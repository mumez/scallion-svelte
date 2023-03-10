<script lang="ts">
	import ModalCloseButton from '$lib/components/ModalCloseButton.svelte';
	import { closeModal } from '$lib/utils/ModalOpener';
	import type { PageContent } from '$lib/models/PageContent';

	export let parent: unknown;
	export let pageContent: PageContent;
	export let latestPageContent: PageContent;

	function startEditing(){
		console.log('parent :>> ', parent);
		console.log('latestPageContent :>> ', latestPageContent);
	}

</script>

<div class="relative">
	<ModalCloseButton />
	<div class="pt-4">
		<section class="border-solid border-2 p-4">{pageContent.content}</section>
		<p>By: {pageContent.updatedBy}</p>
		<p>Date: {new Date(pageContent.updatedAt)}</p>
	</div>
	<footer class="modal-footer {parent.regionFooter}">
        <button class="btn variant-filled-warning" on:click={closeModal}>Cancel</button>
        <button class="btn variant-filled-primary" on:click={startEditing}>Start Editing</button>
    </footer>
	<slot />
</div>
