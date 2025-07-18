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
	import wikisBaseDirectory from '$lib/stores/wikisBaseDirectory';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	let showLoginButton = $state(false);
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	onMount(() => {
		authService.tryAutoLogin((result) => {
			isAuthenticated.set(result);
			showLoginButton = !result;
		});
	});

	function tryLogin() {
		authService.authByPopup();
	}

	let isRoot = $derived($page.route.id == '/');
	let title = $derived(isRoot ? 'Swikis on this Site' : $headerTitle);
	let linkToParent = $derived(isRoot ? '' : $parentLink);
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
	{#snippet header()}
	
			<AppBar>
				{#snippet lead()}
					
						<WikiBookIndexLink wikiBookName={linkToParent} wikisBaseDirectory={$wikisBaseDirectory} />
						<h1>{title}</h1>
					{/snippet}
				{#snippet trail()}
					
						{#if showLoginButton}
							<button class="btn btn-sm variant-filled-primary" onclick={tryLogin}
								><i class="fa-solid fa-door-open"></i><span>Login</span></button
							>
						{/if}
						{#if !isRoot}
							<ActionsMenuBar />
						{/if}
					
					{/snippet}
			</AppBar>
		
	{/snippet}
	{@render children?.()}
	{#snippet footer()}
		<span class="px-2">Scallion Wiki</span>
	{/snippet}
</AppShell>
