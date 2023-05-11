import { getLatestUpdates } from '$lib/utils/CoreUtils.js';
import PageService from '$lib/services/PageService';
import { newPageContent, type PageContent } from '$lib/models/PageContent';
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
	const from = Date.now() + (60 * 1000);
	const maxUpdates = 10;
	const chunkSize = 15;

	let pages = await updatesService.getUpdates(from, chunkSize);
	let latestUpdates = getLatestUpdates<PageContent>(pages, 'name', 'updatedAt');

	while (pages.length > 0 && latestUpdates.length < maxUpdates) {
		const lastItem = pages[pages.length - 1];
		const lastUpdatedAt = lastItem?.updatedAt;
		pages = await updatesService.getUpdates(lastUpdatedAt, chunkSize);
		const moreLatestUpdates = getLatestUpdates<PageContent>(pages, 'name', 'updatedAt');
		latestUpdates = latestUpdates.concat(moreLatestUpdates);
	}

	return { pages: latestUpdates };
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
		if (!page.title) {
			page.title = page.name;
		}
	}
	return { page };
}
