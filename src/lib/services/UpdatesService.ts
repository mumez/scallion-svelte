import BaseApiService from './BaseApiService';
import type { PageContent } from '$lib/models/PageContent';

class UpdatesService extends BaseApiService {
	protected wikiName = '';

	constructor(wikiName: string) {
		super();
		this.wikiName = wikiName;
	}

	public async getUpdates(from = 1, size = 1): Promise<PageContent[]> {
		const url = `${this.targetUrl()}&from=${from}&size=${size}`;
		const resp = await this.apiAccessor.get(url).catch(() => {
			return [];
		});
		return resp as PageContent[];
	}

	override get serviceName() {
		return 'updates';
	}

	// accessing
	targetUrl() {
		return `${this.serviceName}?wiki=${this.wikiName}`;
	}
}

export default UpdatesService;
