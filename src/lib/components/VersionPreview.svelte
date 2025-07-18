<script lang="ts">
	import diff from 'simple-text-diff';
	import { _ } from '$lib/plugins/localization';
	import { beforeNavigate, goto } from '$app/navigation';
	import { page } from '$app/stores';
	import ModalCloseButton from '$lib/components/ModalCloseButton.svelte';
	import { closeModal } from '$lib/utils/ModalOpener';
	import type { PageContent } from '$lib/models/PageContent';
	import wikiPage from '$lib/stores/wikiPage';

	interface Props {
		parent: any;
		pageContent: PageContent;
		versionNumber: number;
		latestPageContent: PageContent;
		children?: import('svelte').Snippet;
	}

	let {
		parent,
		pageContent,
		versionNumber,
		latestPageContent,
		children
	}: Props = $props();

	const diffResult = diff.diffPatch(latestPageContent.content, pageContent.content);

	function startEditing() {
		const newUrlPath = $page.url.pathname.replace('/versions/', '/wikis/');
		const gotoUrl = `${$page.url.origin}${newUrlPath}`;
		goto(gotoUrl);
		closeModal();
	}

	beforeNavigate(({ to }) => {
		const isNavigatingPageEdit = to?.route.id?.toString().startsWith('/wikis/');
		if (isNavigatingPageEdit) {
			wikiPage.startEditingWithOldVersion(pageContent);
		}
	});
</script>

<div class="relative card p-4 w-modal-wide shadow-xl">
	<ModalCloseButton />
	<div class="pt-2 pb-4">
		<div class="grid gap-2 grid-cols-2">
			<div>
				<div>{$_('current')}</div>
				<section class="diff border-solid border-2 py-2 bg-gray-100">
					{@html diffResult.before}
				</section>
				<p class="text-right">{latestPageContent.updatedBy}</p>
			</div>
			<div>
				<div>{$_('version')} {versionNumber} ({new Date(pageContent.updatedAt)})</div>
				<section class="diff border-solid border-2 py-2 bg-gray-100">
					{@html diffResult.after}
				</section>
				<p class="text-right">{pageContent.updatedBy}</p>
			</div>
		</div>
	</div>
	<footer class="modal-footer {parent.regionFooter}">
		<button class="btn variant-filled-warning" onclick={closeModal}>{$_('cancel')}</button>
		<button class="btn variant-filled-primary" onclick={startEditing}
			>{$_('start-editing-using-this-version')}</button
		>
	</footer>
	{@render children?.()}
</div>
