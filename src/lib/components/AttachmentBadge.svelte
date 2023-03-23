<script lang="ts">
	import { clipboard } from '@skeletonlabs/skeleton';

	export let fileName = '';

</script>

<div class="space-x-0">
	<button use:clipboard={fileName}>{fileName}</button>
</div>
