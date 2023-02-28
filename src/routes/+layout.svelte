<script lang="ts">
	//import '@skeletonlabs/skeleton/themes/theme-crimson.css';
	import '@skeletonlabs/skeleton/themes/theme-rocket.css';
	import '@skeletonlabs/skeleton/styles/all.css';
	import '../app.postcss';
	import { AppShell, AppBar, Modal } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	import ActionsMenuBar from '$lib/components/ActionsMenuBar.svelte';
	import authService from '$lib/services/AuthService';
	import parentLink from '$lib/stores/parentLink';
	import pageTitle from '$lib/stores/pageTitle';

	let isAuthenticated = false;

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

	$: isRoot = $page.route.id == '/';
	$: title = isRoot ? 'Swikis on this Site' : $pageTitle;
	$: linkToParent = isRoot ? '' : $parentLink;
</script>

<Modal />
<AppShell>
	<svelte:fragment slot="header">
		<AppBar>
			<svelte:fragment slot="lead">
				<span>{linkToParent}<span><h1>{title}</h1> </span></span></svelte:fragment
			>
			<svelte:fragment slot="trail">
				{#if !isAuthenticated}
					<button class="btn btn-sm variant-filled-primary" on:click={tryLogin}
						><i class="fa-solid fa-door-open" /><span>Login</span></button
					>
				{/if}
				{#if !isRoot}
					<ActionsMenuBar />
				{/if}
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<slot />
	<svelte:fragment slot="footer">Footer</svelte:fragment>
</AppShell>
