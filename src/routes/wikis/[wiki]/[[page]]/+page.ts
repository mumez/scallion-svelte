import PageService from '$lib/services/PageService';

export async function load({ params, fetch }) {
	console.log('-params--', params);
	const pageService = new PageService(params.wiki, params.page ?? 'index');
	pageService.fetcher(fetch);
	const page = pageService.getContent();
	console.log('page :>> ', page);
	return { page };
}
