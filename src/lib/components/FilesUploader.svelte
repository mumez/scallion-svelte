<script lang="ts">
	import { FileDropzone } from '@skeletonlabs/skeleton';

	let uploadingFileList: FileList;

	function onUploadingFilesChange(e: Event) {
		console.log('file data--', e);
	}

	$: uploadingFiles = [{ name: 'aa' }, { name: 'a' }, { name: 'a' }, { name: 'a' }, { name: 'a' }];
</script>

<div class="relative">
	<FileDropzone
		multiple
		name="uploadingFiles"
		bind:uploadingFileList
		on:change={onUploadingFilesChange}
	>
		<svelte:fragment slot="lead">
			<span>Upload files by Drag & Drop</span>
		</svelte:fragment>
		<svelte:fragment slot="message">
			{#each uploadingFiles as uploadingFile}
				<li>{uploadingFile.name}</li>
			{/each}
		</svelte:fragment>
	</FileDropzone>
	<div class="absolute bottom-0 right-0">
		<button class="border-current border-2 variant-filled-warning">Clear</button>
		<button class="border-current border-2 variant-filled-primary">Upload</button>
	</div>
</div>
