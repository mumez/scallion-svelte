import appConfig from '../configs';
import WebApiAccessor from '../utils/WebApiAccessor';
import BaseService from './BaseService';

class BaseApiService extends BaseService {
	protected fetch: typeof fetch;

	constructor(fetcher: typeof fetch = fetch) {
		super();
		this.fetch = fetcher;
	}

	fetcher(fetcher: typeof fetch = fetch) {
		this.fetch = fetcher;
	}

	get apiAccessor() {
		return new WebApiAccessor(this.fetch, this.apiBaseUrl);
	}
	get apiBaseUrl() {
		return appConfig.wikiApi.baseUrl;
	}
}

export default BaseApiService;
