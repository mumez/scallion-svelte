<script lang="ts">
	import '@skeletonlabs/skeleton/themes/theme-crimson.css';
	import '@skeletonlabs/skeleton/styles/all.css';
	import '../app.postcss';
	import { AppShell, AppBar, Modal } from '@skeletonlabs/skeleton';
	import { modalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings, ModalComponent } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	import LoginForm from '$lib/components/LoginForm.svelte';
	import AuthService from '$lib/services/AuthService';

	let isAuthenticated = true;

	onMount(() => {
		AuthService.tryAutoLogin((result) => {
			isAuthenticated = result;
			console.log('auto logged in', isAuthenticated, $page.params);
		});
   		console.log('-isAuthenticated-?', isAuthenticated);
  	});

	function isRoot(){
		return $page.route.id == '/';
	}
	
	function tryLogin(){
		AuthService.authByPopup();
	}

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
		{#if isRoot()}
		<AppBar>
			<svelte:fragment slot="lead">
				<h1>Swikis on this Site</h1>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				{#if !isAuthenticated}
					<button class="btn btn-sm" on:click={tryLogin}>Login</button>
				{/if}
				<a class="btn btn-sm" href="https://github.com/" target="_blank" rel="noreferrer">GitHub</a>
			</svelte:fragment>
		</AppBar>
		{/if}
	</svelte:fragment>
	<slot />
	<svelte:fragment slot="footer">Footer</svelte:fragment>
</AppShell>
