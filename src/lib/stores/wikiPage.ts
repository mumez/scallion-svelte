import { writable } from 'svelte/store';
import type { PageContent } from '$lib/models/PageContent';

function createWikiPage() {
	const { subscribe, update } = writable<{
		isEditing: boolean;
		pageContent?: PageContent;
		revertingPageContent?: PageContent;
	}>({
		isEditing: false
	});

	return {
		subscribe,
		setPageContent: (pageContent: PageContent) => {
			update((val) => {
				val.pageContent = pageContent;
				return val;
			});
		},
		startEditing: () => {
			update((val) => {
				val.isEditing = true;
				return val;
			});
		},
		stopEditing: () => {
			update((val) => {
				val.isEditing = false;
				val.revertingPageContent = undefined;
				return val;
			});
		},
		startEditingWithOldVersion: (pageContent: PageContent) => {
			update((val) => {
				val.isEditing = true;
				val.revertingPageContent = pageContent;
				return val;
			});
		},
	};
}

const wikiPage = createWikiPage();
export default wikiPage;