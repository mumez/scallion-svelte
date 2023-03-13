<script lang="ts">
	import diff from 'simple-text-diff';
	import ModalCloseButton from '$lib/components/ModalCloseButton.svelte';
	import { closeModal } from '$lib/utils/ModalOpener';
	import type { PageContent } from '$lib/models/PageContent';

	export let parent: unknown;
	export let pageContent: PageContent;
	export let versionNumber: number;
	export let latestPageContent: PageContent;

	const diffResult = diff.diffPatch(latestPageContent.content, pageContent.content);

	function startEditing() {
		console.log('parent :>> ', parent, versionNumber);
		console.log('latestPageContent :>> ', latestPageContent);
		console.log('diffResult :>> ', diffResult);
	}
</script>

<div class="relative card p-4 w-modal-wide shadow-xl">
	<ModalCloseButton />
	<div class="pt-2 pb-4">
		<div class="grid gap-2 grid-cols-2">
			<div>
				<div>Current</div>
				<section class="diff border-solid border-2 py-2 bg-gray-100">
					{@html diffResult.before}
				</section>
				<p class="text-right">{latestPageContent.updatedBy}</p>
			</div>
			<div>
				<div>Version {versionNumber} ({new Date(pageContent.updatedAt)})</div>
				<section class="diff border-solid border-2 py-2 bg-gray-100">{@html diffResult.after}</section>
				<p class="text-right">{pageContent.updatedBy}</p>
			</div>
		</div>
	</div>
	<footer class="modal-footer {parent.regionFooter}">
		<button class="btn variant-filled-warning" on:click={closeModal}>Cancel</button>
		<button class="btn variant-filled-primary" on:click={startEditing}>Start editing using this version</button>
	</footer>
	<slot />
</div>
