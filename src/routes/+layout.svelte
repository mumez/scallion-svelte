<script lang="ts">
	//import '@skeletonlabs/skeleton/themes/theme-crimson.css';
	import '../theme.css';
	// import '@skeletonlabs/skeleton/themes/theme-rocket.css';
	// import '@skeletonlabs/skeleton/styles/all.css';
	import '../app.css';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { AppBar } from '@skeletonlabs/skeleton-svelte';
	import ActionsMenuBar from '$lib/components/ActionsMenuBar.svelte';
	import WikiBookIndexLink from '$lib/components/WikiBookIndexLink.svelte';
	import GlobalModal from '$lib/components/GlobalModal.svelte';
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
<GlobalModal />

<div class="min-h-screen flex flex-col">
	<!-- Header -->
	<header class="shrink-0">
		<AppBar>
			{#snippet lead()}
				<WikiBookIndexLink wikiBookName={linkToParent} wikisBaseDirectory={$wikisBaseDirectory} />
				<h1>{title}</h1>
			{/snippet}
			{#snippet trail()}
				{#if showLoginButton}
					<button class="btn btn-sm preset-filled-primary-500" onclick={tryLogin}>
						<i class="fa-solid fa-door-open"></i><span>Login</span>
					</button>
				{/if}
				{#if !isRoot}
					<ActionsMenuBar />
				{/if}
			{/snippet}
		</AppBar>
	</header>

	<!-- Main Content -->
	<main class="flex-1 overflow-auto">
		{@render children?.()}
	</main>

	<!-- Footer -->
	<footer class="shrink-0 p-2 border-t border-surface-300-600">
		<span class="px-2">Scallion Wiki</span>
	</footer>
</div>
