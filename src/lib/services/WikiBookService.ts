import BaseApiService from './BaseApiService';
import type { WikiBook } from '$lib/models/WikiBook';

class WikiBookService extends BaseApiService {
	public async listBooks(): Promise<WikiBook[]> {
		const resp = await this.apiAccessor.get('wikis').catch((e) => {
			return [];
		});
		const books = Object.values(resp as object) as WikiBook[];
		return books.sort((a, b) => (a.name < b.name ? -1 : 1));
	}
}

export default new WikiBookService();
