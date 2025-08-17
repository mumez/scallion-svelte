<script lang="ts">
	import { run } from 'svelte/legacy';

	import { createEventDispatcher } from 'svelte';
	import { FileUpload } from '@skeletonlabs/skeleton-svelte';
	import { _ } from '$lib/plugins/localization';

	interface Props {
		uploader?: (file: File) => Promise<boolean>;
	}

	let { uploader = (file) => Promise.resolve(true) }: Props = $props();

	let uploadingFileList: FileList | null = $state(null);
	let uploadingFileArray: File[] = $state([]);
	let isUploading = $state(false);

	const dispatch = createEventDispatcher();

	function onFilesChange(details: { acceptedFiles: File[]; rejectedFiles: any[] }) {
		uploadingFileArray = details.acceptedFiles;
		uploadingFileList = null; // Clear the old FileList since we now work with File[]
	}
	function clear() {
		uploadingFileList = null;
		uploadingFileArray = [];
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
	<FileUpload
		name="uploadingFiles"
		maxFiles={10}
		onFileChange={onFilesChange}
		classes="w-full"
	>
		{#snippet children()}
			<div class="w-full h-48 flex flex-col items-center justify-center space-y-2 p-4 border border-dashed border-surface-400-600-token rounded-lg">
				{#if isUploading}
					<i class="animate-spin text-3xl fa-solid fa-spinner"></i>
				{:else}
					<div class="space-y-2">
						<i class="fa-solid fa-cloud-upload-alt text-3xl text-surface-400"></i>
						<p>{$_('drop-or-click-to-start-uploading-files')}</p>
					</div>
				{/if}
				
				{#if uploadingFileArray.length > 0}
					<div class="mt-4">
						<ul class="text-left space-y-1">
							{#each uploadingFileArray as uploadingFile}
								<li class="text-sm">{uploadingFile.name}</li>
							{/each}
						</ul>
					</div>
				{/if}
			</div>
		{/snippet}
	</FileUpload>
	<div class="absolute z-30 bottom-0 right-0">
		<button
			disabled={!shouldEnableActionButtons}
			class="border-current px-2 border-2 preset-filled-warning-500"
			onclick={clear}>{$_('clear')}</button
		>
		<button
			disabled={!shouldEnableActionButtons}
			class="border-current px-2 border-2 preset-filled-primary-500"
			onclick={upload}>{$_('upload')}</button
		>
	</div>
</div>
