<script lang="ts">
	import { closeModal } from '$lib/utils/ModalOpener';
</script>

<button class="absolute -top-3 -right-3 rounded-full px-2 bg-red-100" on:click={closeModal}>
	<i class="fa-solid fa-close" />
</button>
