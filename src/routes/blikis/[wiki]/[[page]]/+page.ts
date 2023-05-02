import PageService from '$lib/services/PageService';
import { newPageContent } from '$lib/models/PageContent';
import UpdatesService from '$lib/services/UpdatesService';

export async function load({ params, fetch }) {
	const wikiBookName = params.wiki;
	const pageName = params.page;
	if (pageName) {
		return await loadPage(wikiBookName, pageName, fetch);
	}
	return await loadUpdates(wikiBookName, fetch);
}

async function loadUpdates(
	wikiBookName: string,
	fetch: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>
) {
	const updatesService = new UpdatesService(wikiBookName);
	updatesService.fetcher(fetch);
	const pages = await updatesService.getUpdates(Date.now(), 10);
	console.log('pages :>> ', pages);
	return { pages };
}

async function loadPage(
	wikiBookName: string,
	pageName: string,
	fetch: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>
) {
	const pageService = new PageService(wikiBookName, pageName);
	pageService.fetcher(fetch);
	let page = await pageService.getContent();
	if (!page.id) {
		page = newPageContent(wikiBookName, pageName, '');
	}
	return { page };
}
