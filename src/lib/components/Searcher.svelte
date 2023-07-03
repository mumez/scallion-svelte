<script lang="ts">
	import ModalCloseButton from '$lib/components/ModalCloseButton.svelte';
	import { _ } from '$lib/plugins/localization';
	import { closeModal } from '$lib/utils/ModalOpener';
	
	export let parent: unknown;
	let searchInput = '';
	
	async function search() {
		console.log('search :>> ', searchInput);
		closeModal();
	}
</script>

<div class="relative card p-4 w-modal shadow-xl">
	<ModalCloseButton />
	<div class="pt-2 pb-4">
		<label class="label">
			<span>Wiki search</span>
			<input class="input" type="text" placeholder="Enter a keyword" bind:value={searchInput}/>
		</label>
	</div>
	<footer class="modal-footer {parent.regionFooter}">
		<button class="btn variant-filled-warning" on:click={closeModal}>{$_('cancel')}</button>
		<button class="btn variant-filled-primary" on:click={search}
			>{$_('search')}</button
		>
	</footer>
	<slot />
</div>
