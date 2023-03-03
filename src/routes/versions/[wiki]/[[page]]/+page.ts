import VersionsService from '$lib/services/VersionsService';

export async function load({ params }) {
	console.log('-params--', params);
	const versionsService = new VersionsService(params.wiki, params.page ?? 'index');
	const lastVersionNumber = await versionsService.getLastVersionNumber();
	const versions = await versionsService.getVersions(lastVersionNumber, 5);
	console.log('lastVersionNumber :>> ', lastVersionNumber, versions);
	return { lastVersionNumber, versions };
}
