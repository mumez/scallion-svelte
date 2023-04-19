import BaseApiService from './BaseApiService';
import type { PageContent } from '$lib/models/PageContent';

class PageService extends BaseApiService {
	protected wikiName = '';
	protected name = '';

	constructor(wikiName: string, name: string) {
		super();
		this.wikiName = wikiName;
		this.name = name;
	}

	public async postContent(pageContent: PageContent, jwt = ''): Promise<PageContent> {
		const url = this.targetUrl();
		const acc = this.apiAccessorWithJwt(jwt);
		const resp = await acc.post(url, JSON.stringify(pageContent)).catch((ex) => {
			console.error(ex);
			return {};
		});
		return resp as PageContent;
	}
	public async putContent(pageContent: PageContent, jwt = ''): Promise<PageContent> {
		const url = this.targetUrl();
		const acc = this.apiAccessorWithJwt(jwt);
		const resp = await acc.put(url, JSON.stringify(pageContent)).catch((ex) => {
			console.error(ex);
			return {};
		});
		return resp as PageContent;
	}

	public async getContent(): Promise<PageContent> {
		const url = this.targetUrl();
		const resp = await this.apiAccessor.get(url).catch(() => {
			return {};
		});
		return resp as PageContent;
	}

	override get serviceName() {
		return 'page';
	}

	// accessing
	targetUrl() {
		return `${this.serviceName}?wiki=${this.wikiName}&name=${this.name}`;
	}
}

export default PageService;
