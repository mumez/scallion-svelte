<script lang="ts">
	import wikiPage from '$lib/stores/wikiPage';
</script>

<div class="space-x-0">
	<button class="btn-icon" disabled="{$wikiPage.isEditing}" on:click={wikiPage.startEditing}><i class="fa-solid fa-pen" /></button>
	<button class="btn-icon"><i class="fa-solid fa-arrow-up-from-bracket" /></button>
	<button class="btn-icon"><i class="fa-solid fa-clock-rotate-left" /></button>
	<button class="btn-icon"><i class="fa-solid fa-ellipsis-vertical"></i></button>
</div>
