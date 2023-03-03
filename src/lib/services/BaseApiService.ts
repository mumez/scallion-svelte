import appConfig from '../configs';
import WebApiAccessor from '../utils/WebApiAccessor';
import BaseService from './BaseService';

class BaseApiService extends BaseService {
	get apiAccessor() {
		return new WebApiAccessor(this.apiBaseUrl);
	}
	get apiBaseUrl() {
		return appConfig.wikiApi.baseUrl;
	}
}

export default BaseApiService;
