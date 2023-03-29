import PageService from '$lib/services/PageService';
import { newPageContent } from '$lib/models/PageContent';

export async function load({ params, fetch }) {
	const wikiBookName = params.wiki;
	const pageName = params.page ?? 'index';
	const pageService = new PageService(wikiBookName, pageName);
	pageService.fetcher(fetch);
	let page = await pageService.getContent();
	if (!page.id) {
		page = newPageContent(wikiBookName, pageName, '');
	}
	return { page };
}
