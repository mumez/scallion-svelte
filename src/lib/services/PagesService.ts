import BaseApiService from './BaseApiService';

class PagesService extends BaseApiService {
	protected wikiName = '';

	constructor(wikiName: string) {
		super();
		this.wikiName = wikiName;
	}

	public async checkExistenceByNames(pageNames: string[]): Promise<boolean[]> {
		const url = this.targetUrl();
		const namesParam = pageNames.join();
		const resp = await this.apiAccessor.get(`${url}&exist-names=${namesParam}`).catch((e) => {
			return [];
		});
		return resp as boolean[];
	}

	override get serviceName() {
		return 'pages';
	}

	// accessing
	targetUrl() {
		return `${this.serviceName}?wiki=${this.wikiName}`;
	}
}

export default PagesService;
