import MockStorage from '../utils/MockStorage';
import appConfig from '../configs';

import UserService from './UserService';
import WebApiAccessor from '../utils/WebApiAccessor';

class BaseService {
    public async putToMockStorage(key: string, value: any) {
        await MockStorage.put(key, JSON.stringify(value));
    }
    public async getFromMockStorage(key: string) {
        const item = await MockStorage.get(key);
        return item ? JSON.parse(item) : '';
    }

    get apiAccessor() {
        const jwt = UserService.loadToken();
        return new WebApiAccessor({ jwt });
    }
    get apiBaseUrl() {
        return appConfig.wikiApi.rootUri;
    }

    public serviceName(): string {
        return '';
    }
}

export default BaseService;
