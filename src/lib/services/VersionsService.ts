import BaseApiService from './BaseApiService';
import type { PageContent } from '$lib/models/PageContent';

class VersionsService extends BaseApiService {
	protected wikiName = '';
	protected pageName = '';

	constructor(wikiName: string, pageName: string) {
		super();
		this.wikiName = wikiName;
		this.pageName = pageName;
	}

	public async getLastVersionNumber(): Promise<number> {
		const url = `${this.targetUrl('version')}&field=lastVersionNumber`;
		const resp = await this.apiAccessor.get(url).catch(() => {
			return 0;
		});
		return resp as number;
	}

	public async getVersions(from = 1, size = 1): Promise<PageContent[]> {
		const url = `${this.targetUrl('versions')}&from=${from}&size=${size}`;
		const resp = await this.apiAccessor.get(url).catch(() => {
			return [];
		});
		return resp as PageContent[];
	}

	// accessing
	targetUrl(serviceName: string) {
		return `${serviceName}?wiki=${this.wikiName}&page=${encodeURIComponent(this.pageName)}`;
	}
}

export default VersionsService;
