<script lang="ts">
	import { modalState, closeModal } from '$lib/utils/ModalOpener';
	import { onMount } from 'svelte';

	let dialogElement: HTMLDialogElement;

	$: if ($modalState.isOpen && dialogElement) {
		dialogElement.showModal();
		document.body.style.overflow = 'hidden';
	} else if (!$modalState.isOpen && dialogElement) {
		dialogElement.close();
		document.body.style.overflow = '';
	}

	onMount(() => {
		return () => {
			document.body.style.overflow = '';
		};
	});

	function handleBackdropClick(event: MouseEvent) {
		if (event.target === dialogElement) {
			closeModal();
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			closeModal();
		}
	}
</script>

<dialog
	bind:this={dialogElement}
	class="backdrop:bg-black/50 backdrop:backdrop-blur-sm bg-transparent p-0 max-w-none max-h-none"
	onclick={handleBackdropClick}
	onkeydown={handleKeydown}
>
	{#if $modalState.isOpen}
		<div class="flex items-center justify-center min-h-screen p-4">
			<div class="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-h-[90vh] overflow-auto max-w-4xl w-full">
				{#if $modalState.type === 'component' && $modalState.component}
					<svelte:component this={$modalState.component} {...$modalState.props} />
				{:else if $modalState.type === 'alert'}
					<div class="p-6">
						{#if $modalState.title}
							<h2 class="text-xl font-bold mb-4">{$modalState.title}</h2>
						{/if}
						{#if $modalState.body}
							<p class="mb-4">{$modalState.body}</p>
						{/if}
						{#if $modalState.image}
							<img src={$modalState.image} alt="" class="mb-4 max-w-full h-auto" />
						{/if}
						<div class="flex justify-end">
							<button 
								class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors" 
								onclick={closeModal}
							>
								OK
							</button>
						</div>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</dialog>