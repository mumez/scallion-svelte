<script lang="ts">
	import '@skeletonlabs/skeleton/themes/theme-crimson.css';
	import '@skeletonlabs/skeleton/styles/all.css';
	import '../app.postcss';
	import { AppShell, AppBar, Modal } from '@skeletonlabs/skeleton';
	import { modalStore } from '@skeletonlabs/skeleton';
	import LoginForm from '../components/LoginForm.svelte';
	
	import type { ModalSettings, ModalComponent } from '@skeletonlabs/skeleton';

	function triggerAlert(): void {
		const modalComponent: ModalComponent = {
			ref: LoginForm,
			props: { },
			slot: ''
		};
		const d: ModalSettings = {
			type: 'component',
			component: modalComponent,
			meta: { foo: 'bar', fizz: 'buzz'}
		};
		modalStore.trigger(d);
	}
</script>

<Modal />
<AppShell>
	<svelte:fragment slot="header">
		<AppBar>
			<svelte:fragment slot="lead">
				<h1>Scallion</h1>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<button class="btn btn-sm" on:click={triggerAlert}>Login</button>
				<a class="btn btn-sm" href="https://github.com/" target="_blank" rel="noreferrer">GitHub</a>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<svelte:fragment slot="sidebarRight">
		<AppShell slotSidebarRight="bg-surface-500/5 w-56 p-4">
			<nav class="list-nav">
				<ul>
					<li><a href="/">Home</a></li>
					<li><a href="/login">Login</a></li>
				</ul>
			</nav>
		</AppShell>
	</svelte:fragment>
	<slot />
</AppShell>
