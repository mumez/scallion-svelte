import FilesService from '$lib/services/FilesService';

export async function load({ params, fetch }) {
	const filesService = new FilesService(params.wiki, params.page ?? 'index');
	filesService.fetcher(fetch);
	const files = await filesService.files();
	console.log('files :>> ', files);
	return { files };
}
