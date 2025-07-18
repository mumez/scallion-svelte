<script lang="ts">
	import { run } from 'svelte/legacy';

	import { createEventDispatcher } from 'svelte';
	import { FileDropzone } from '@skeletonlabs/skeleton';
	import { _ } from '$lib/plugins/localization';

	interface Props {
		uploader?: (file: File) => Promise<boolean>;
	}

	let { uploader = (file) => Promise.resolve(true) }: Props = $props();

	let uploadingFileList: FileList | null = $state(null);
	let uploadingFileArray: File[] = $state([]);
	let isUploading = $state(false);

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

	run(() => {
		uploadingFileArray = uploadingFileList ? [...uploadingFileList] : [];
	});
	let shouldEnableActionButtons = $derived(!isUploading && uploadingFileArray.length > 0);
</script>

<div class="relative">
	<FileDropzone multiple name="uploadingFiles" padding="py-3" on:change={onFilesChange}>
		{#snippet lead()}
			
				{#if isUploading}
					<i class="animate-spin text-3xl fa-solid fa-spinner"></i>
				{:else}
					<span>{$_('drop-or-click-to-start-uploading-files')}</span>
				{/if}
			
			{/snippet}
		{#snippet message()}
			
				<ul class="text-left">
					{#each uploadingFileArray as uploadingFile}
						<li>{uploadingFile.name}</li>
					{/each}
				</ul>
			
			{/snippet}
	</FileDropzone>
	<div class="absolute z-30 bottom-0 right-0">
		<button
			disabled={!shouldEnableActionButtons}
			class="border-current px-2 border-2 variant-filled-warning"
			onclick={clear}>{$_('clear')}</button
		>
		<button
			disabled={!shouldEnableActionButtons}
			class="border-current px-2 border-2 variant-filled-primary"
			onclick={upload}>{$_('upload')}</button
		>
	</div>
</div>
