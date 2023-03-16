import BaseApiService from './BaseApiService';

class WikiBookService extends BaseApiService {
	protected name = '';

	constructor(name: string) {
		super();
		this.name = name;
	}

	public async hasPages(pageNames: string[]): Promise<boolean[]> {
		const url = this.targetUrl();
		const names = pageNames.join();
		const resp = await this.apiAccessor.get(`${url}&exist-pages=${names}`).catch((e) => {
			return [];
		});
		return resp as boolean[];
	}

	override get serviceName() {
		return 'wiki';
	}

	// accessing
	targetUrl() {
		return `${this.serviceName}?name=${this.name}`;
	}
}

export default WikiBookService;
