import PageService from '$lib/services/PageService';

export async function load({ params, fetch }) {
	const pageService = new PageService(params.wiki, params.page ?? 'index');
	pageService.fetcher(fetch);
	const page = pageService.getContent();
	return { page };
}
