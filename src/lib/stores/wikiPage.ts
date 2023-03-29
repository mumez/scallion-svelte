import { writable } from 'svelte/store';
import type { PageContent } from '$lib/models/PageContent';

const wikiPage = writable<{
	isEditing: boolean;
	pageContent?: PageContent;
	revertingPageContent?: PageContent;
}>({
	isEditing: false
});

function setPageContent(pageContent: PageContent) {
	wikiPage.update((val) => {
		val.pageContent = pageContent;
		return val;
	});
}
function startEditing() {
	wikiPage.update((val) => {
		val.isEditing = true;
		return val;
	});
}
function stopEditing() {
	wikiPage.update((val) => {
		val.isEditing = false;
		val.revertingPageContent = undefined;
		return val;
	});
}
function startEditingWithOldVersion(pageContent: PageContent) {
	wikiPage.update((val) => {
		val.isEditing = true;
		val.revertingPageContent = pageContent;
		return val;
	});
}

export default {
	subscribe: wikiPage.subscribe,
	setPageContent,
	startEditing,
	stopEditing,
	startEditingWithOldVersion
};
