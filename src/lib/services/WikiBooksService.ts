import BaseApiService from './BaseApiService';
import type { WikiBook } from '$lib/models/WikiBook';

class WikiBooksService extends BaseApiService {
	public async listBooks(): Promise<WikiBook[]> {
		const resp = await this.apiAccessor.get(this.serviceName).catch((e) => {
			return [];
		});
		const books = Object.values(resp as object) as WikiBook[];
		return books.sort((a, b) => (a.name < b.name ? -1 : 1));
	}

	override get serviceName() {
		return 'wikis';
	}
}

export default WikiBooksService;
