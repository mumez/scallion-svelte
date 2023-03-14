import appConfig from '../configs';
import BaseService from './BaseService';
import WebApiAccessor from '$lib/utils/WebApiAccessor';

class BaseApiService extends BaseService {
	protected fetch: typeof fetch;

	constructor(fetcher: typeof fetch = fetch) {
		super();
		this.fetch = fetcher;
	}

	fetcher(fetcher: typeof fetch = fetch) {
		this.fetch = fetcher;
	}

	// accessing
	get apiAccessor() {
		return new WebApiAccessor(this.fetch, this.apiBaseUrl);
	}
	get apiBaseUrl() {
		return appConfig.wikiApi.baseUrl;
	}
	apiAccessorWithJwt(jwt: string) {
		const acc = this.apiAccessor;
		acc.setJwt(jwt);
		return acc;
	}
}

export default BaseApiService;
