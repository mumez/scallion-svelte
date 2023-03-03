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
		const resp = await this.apiAccessor.get(url).catch((e) => {
			return 0;
		});
		return resp as number;
	}

	public async getVersions(from = 1, size = 1): Promise<PageContent[]> {
		const url = `${this.targetUrl('versions')}&from=${from}&size=${size}`;
		const resp = await this.apiAccessor.get(url).catch((e) => {
			return [];
		});
		return resp as PageContent[];
	}

	// accessing
	getPageName() {
		return this.pageName;
	}
	getWikiName() {
		return this.wikiName;
	}
	targetUrl(baseDir: string) {
		return `${baseDir}?wiki=${this.wikiName}&page=${this.pageName}`;
	}
}

export default VersionsService;
