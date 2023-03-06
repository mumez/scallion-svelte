import VersionsService from '$lib/services/VersionsService';

export async function load({ params, fetch }) {
	console.log('-params--', params);
	const versionsService = new VersionsService(params.wiki, params.page ?? 'index');
	versionsService.fetcher(fetch);
	const lastVersionNumber = await versionsService.getLastVersionNumber();
	const versions = await versionsService.getVersions(lastVersionNumber, 5);
	console.log('lastVersionNumber :>> ', lastVersionNumber, versions);
	return { lastVersionNumber, versions };
}
