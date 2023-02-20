import MockStorage from '../utils/MockStorage';

class BaseService {
    public async putToMockStorage(key: string, value: any) {
        await MockStorage.put(key, JSON.stringify(value));
    }
    public async getFromMockStorage(key: string) {
        const item = await MockStorage.get(key);
        return item ? JSON.parse(item) : '';
    }

    public serviceName(): string {
        return '';
    }
}

export default BaseService;
