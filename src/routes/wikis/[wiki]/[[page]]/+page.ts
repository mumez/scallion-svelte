import PageService from "$lib/services/PageService";

export async function load({ params }) {
	console.log('-params--', params);
	const pageService = new PageService(params.wiki, params.page ?? 'index');
	const page = pageService.getContent();
	console.log('page :>> ', page);
	return { page };
}
