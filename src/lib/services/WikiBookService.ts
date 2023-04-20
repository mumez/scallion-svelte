import type { WikiBook } from '$lib/models/WikiBook';
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
		const resp = await this.apiAccessor.get(`${url}&exist-pages=${names}`).catch(() => {
			return [];
		});
		return resp as boolean[];
	}

	public async getDescription(): Promise<WikiBook> {
		const url = this.targetUrl();
		const resp = await this.apiAccessor.get(url).catch(() => {
			return {};
		});
		return resp as WikiBook;
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
