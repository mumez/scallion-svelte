import MockStorage from '../utils/MockStorage';
import appConfig from '../configs';

import CoreUtils from '../utils/CoreUtils';
import WebApiAccessor from '../utils/WebApiAccessor';

class BaseService {
    public async putToMockStorage(key: string, value: any) {
        await MockStorage.put(key, JSON.stringify(value));
    }
    public async getFromMockStorage(key: string) {
        const item = await MockStorage.get(key);
        return item ? JSON.parse(item) : '';
    }

    public storeJwt(jwt: string) {
        CoreUtils.putToSessionStorage('_jwt', jwt);
    }

    public loadJwt(): string {
        return CoreUtils.getFromSessionStorage('_jwt');
    }

    get apiAccessor() {
        const jwt = this.loadJwt();
        return new WebApiAccessor({ jwt }, this.apiBaseUrl);
    }
    get apiBaseUrl() {
        return appConfig.wikiApi.baseUrl;
    }

    public serviceName(): string {
        return '';
    }
}

export default BaseService;
