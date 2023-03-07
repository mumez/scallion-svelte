<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { FileDropzone } from '@skeletonlabs/skeleton';

	let uploadingFileList: FileList | null;
	let uploadingFileArray: File[] = [];

	const dispatch = createEventDispatcher();

	function onFilesChange(e: Event) {
		uploadingFileList = e.target ? (e.target as HTMLInputElement).files : null;
	}
	function clear() {
		uploadingFileList = null;
	}
	function requestUpload() {
		dispatch('request-upload', uploadingFileArray);
		clear();
	}

	$: uploadingFileArray = uploadingFileList ? [...uploadingFileList] : [];
	$: shouldEnableActionButtons = uploadingFileArray.length > 0;
</script>

<div class="relative">
	<FileDropzone multiple name="uploadingFiles" padding="py-1" on:change={onFilesChange}>
		<svelte:fragment slot="lead">
			<span>Click to start uploading files</span>
		</svelte:fragment>
		<svelte:fragment slot="message">
			<ul class="text-left">
				{#each uploadingFileArray as uploadingFile}
					<li>{uploadingFile.name}</li>
				{/each}
			</ul>
		</svelte:fragment>
	</FileDropzone>
	<div class="absolute bottom-0 right-0">
		<button
			disabled={!shouldEnableActionButtons}
			class="border-current border-2 variant-filled-warning"
			on:click={clear}>Clear</button
		>
		<button
			disabled={!shouldEnableActionButtons}
			class="border-current border-2 variant-filled-primary"
			on:click={requestUpload}>Upload</button
		>
	</div>
</div>
