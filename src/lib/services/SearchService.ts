import BaseApiService from './BaseApiService';
import type { PageContent } from '$lib/models/PageContent';

class SearchService extends BaseApiService {

	public async searchPages(keyword: string, wikiName: string): Promise<PageContent[]> {
		const resp = await this.apiAccessor.get(this.pagesSearchUrl(keyword, wikiName)).catch(() => {
			return [];
		});
		const pages = resp as PageContent[];
		return pages;
	}

	// accessing
	override get serviceName() {
		return 'search';
	}

	pagesSearchUrl(keyword: string, wikiName: string) {
		return `${this.serviceName}?q=${keyword}&wiki=${wikiName}`;
	}
}

export default SearchService;
