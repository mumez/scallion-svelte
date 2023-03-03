import { writable } from 'svelte/store';
import type { PageContent } from '$lib/models/PageContent';

const wikiPage = writable<{
	isEditing: boolean;
	pageContent?: PageContent;
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
		return val;
	});
}
function toggleEditing() {
	wikiPage.update((val) => {
		val.isEditing = !val.isEditing;
		return val;
	});
}

export default {
	subscribe: wikiPage.subscribe,
	setPageContent,
	startEditing,
	stopEditing,
	toggleEditing
};
