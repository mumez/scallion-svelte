<script lang="ts">
	//import '@skeletonlabs/skeleton/themes/theme-crimson.css';
	import '../theme.postcss';
	import '@skeletonlabs/skeleton/themes/theme-rocket.css';
	import '@skeletonlabs/skeleton/styles/all.css';
	import '../app.postcss';
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { AppShell, AppBar, Modal } from '@skeletonlabs/skeleton';
	import ActionsMenuBar from '$lib/components/ActionsMenuBar.svelte';
	import WikiBookIndexLink from '$lib/components/WikiBookIndexLink.svelte';
	import authService from '$lib/services/AuthService';
	import isAuthenticated from '$lib/stores/isAuthenticated';
	import parentLink from '$lib/stores/parentLink';
	import headerTitle from '$lib/stores/headerTitle';

	let showLoginButton = false;
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	onMount(() => {
		authService.tryAutoLogin((result) => {
			$isAuthenticated = result;
			showLoginButton = !$isAuthenticated;
		});
	});

	function tryLogin() {
		authService.authByPopup();
	}

	$: isRoot = $page.route.id == '/';
	$: title = isRoot ? 'Swikis on this Site' : $headerTitle;
	$: linkToParent = isRoot ? '' : $parentLink;
</script>

<svelte:head>
	{#if isRoot}
		<title>Swikis</title>
	{:else}
		<title>{linkToParent} : {title}</title>
	{/if}
</svelte:head>
<Modal />
<AppShell>
	<svelte:fragment slot="header">
		<AppBar>
			<svelte:fragment slot="lead">
				<WikiBookIndexLink wikiBookName={linkToParent} />
				<h1>{title}</h1></svelte:fragment
			>
			<svelte:fragment slot="trail">
				{#if showLoginButton}
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
	<svelte:fragment slot="footer"><span class="px-2">Scallion Wiki</span></svelte:fragment>
</AppShell>
