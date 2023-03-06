import BaseApiService from './BaseApiService';
import type { PageContent } from '$lib/models/PageContent';

class PageService extends BaseApiService {
	protected wikiName = '';
	protected pageName = '';

	constructor(wikiName: string, pageName: string) {
		super();
		this.wikiName = wikiName;
		this.pageName = pageName;
	}

	public async putContent(pageContent: PageContent, jwt = ''): Promise<PageContent> {
		const url = this.targetUrl();
		const acc = this.apiAccessor;
		acc.setJwt(jwt);
		const resp = await acc.put(url, JSON.stringify(pageContent)).catch((e) => {
			return {};
		});
		return resp as PageContent;
	}

	public async getContent(): Promise<PageContent> {
		const url = this.targetUrl();
		const resp = await this.apiAccessor.get(url).catch((e) => {
			return {};
		});
		return resp as PageContent;
	}

	public override serviceName(): string {
		return 'page';
	}

	// accessing
	targetUrl() {
		return `${this.serviceName()}?wiki=${this.wikiName}&name=${this.pageName}`;
	}
}

export default PageService;
