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
	import ActionsMenuBar from '$lib/components/ActionsMenuBar.svelte';
	import authService from '$lib/services/AuthService';
	import pageTitle from '$lib/stores/pageTitle';

	let isAuthenticated = true;

	$pageTitle = 'Swikis on this Site';

	onMount(() => {
		authService.tryAutoLogin((result) => {
			isAuthenticated = result;
			console.log('auto logged in', isAuthenticated, $page.params);
		});
		console.log('-isAuthenticated-?', isAuthenticated);
	});

	function tryLogin() {
		authService.authByPopup();
	}

	function triggerAlert(): void {
		const modalComponent: ModalComponent = {
			ref: LoginForm,
			props: {},
			slot: ''
		};
		const d: ModalSettings = {
			type: 'component',
			component: modalComponent,
			meta: { foo: 'bar', fizz: 'buzz' }
		};
		modalStore.trigger(d);
	}

	$: isRoot = $page.route.id == '/';
	$: title = isRoot ? 'Swikis on this Site' : $pageTitle;
</script>

<Modal />
<AppShell>
	<svelte:fragment slot="header">
		
			<AppBar>
				<svelte:fragment slot="lead">
					<h1>{title}</h1>
				</svelte:fragment>
				<svelte:fragment slot="trail">
					{#if !isAuthenticated}
						<button class="btn btn-sm" on:click={tryLogin}>Login</button>
					{/if}
					{#if !isRoot}
						<ActionsMenuBar></ActionsMenuBar>
					{/if}
				</svelte:fragment>
			</AppBar>
	</svelte:fragment>
	<slot />
	<svelte:fragment slot="footer">Footer</svelte:fragment>
</AppShell>
