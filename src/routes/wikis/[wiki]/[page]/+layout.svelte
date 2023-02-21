<script lang="ts">

	import { AppShell, AppBar, Modal } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';

	onMount(() => {
   		console.log('-mounted-?');
  	});

</script>

<Modal />
<AppShell>
	<svelte:fragment slot="header">
		<AppBar>
			<svelte:fragment slot="lead">
				<h1>Scallion Page</h1>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<a class="btn btn-sm" href="https://github.com/" target="_blank" rel="noreferrer">GitHub</a>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<slot />
	<svelte:fragment slot="footer">Footer</svelte:fragment>
</AppShell>
