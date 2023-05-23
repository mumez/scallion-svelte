<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { FileDropzone } from '@skeletonlabs/skeleton';

	export let uploader: (file: File) => Promise<boolean> = (file) => Promise.resolve(true);

	let uploadingFileList: FileList | null;
	let uploadingFileArray: File[] = [];
	let isUploading = false;

	const dispatch = createEventDispatcher();

	function onFilesChange(e: Event) {
		uploadingFileList = e.target ? (e.target as HTMLInputElement).files : null;
	}
	function clear() {
		uploadingFileList = null;
	}
	async function upload() {
		isUploading = true;
		const files = Array.from(uploadingFileArray);
		dispatch('upload-start', files);
		const promises = files.map((each) => {
			return uploader(each).then((result) => {
				dispatch('upload-progress', {
					file: each,
					result
				});
				if (result) {
					uploadingFileArray = uploadingFileArray.filter((e) => e != each);
				}
			});
		});
		await Promise.all(promises);
		dispatch('upload-end', uploadingFileArray);
		isUploading = false;
	}

	$: uploadingFileArray = uploadingFileList ? [...uploadingFileList] : [];
	$: shouldEnableActionButtons = !isUploading && uploadingFileArray.length > 0;
</script>

<div class="relative">
	<FileDropzone multiple name="uploadingFiles" padding="py-3" on:change={onFilesChange}>
		<svelte:fragment slot="lead">
			{#if isUploading}
				<i class="animate-spin text-3xl fa-solid fa-spinner" />
			{:else}
				<span>$_('drop-or-click-to-start-uploading-files')</span>
			{/if}
		</svelte:fragment>
		<svelte:fragment slot="message">
			<ul class="text-left">
				{#each uploadingFileArray as uploadingFile}
					<li>{uploadingFile.name}</li>
				{/each}
			</ul>
		</svelte:fragment>
	</FileDropzone>
	<div class="absolute z-30 bottom-0 right-0">
		<button
			disabled={!shouldEnableActionButtons}
			class="border-current px-2 border-2 variant-filled-warning"
			on:click={clear}>$_('clear')</button
		>
		<button
			disabled={!shouldEnableActionButtons}
			class="border-current px-2 border-2 variant-filled-primary"
			on:click={upload}>$_('upload')</button
		>
	</div>
</div>
