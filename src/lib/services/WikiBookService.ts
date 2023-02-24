import ky from 'ky';

import BaseService from './BaseService';
import type { WikiBook } from '$lib/models/WikiBook';

class WikiBookService extends BaseService {
    public async listBooks(): Promise<WikiBook[]> {
        this.apiAccessor
        return await this.getFromMockStorage(this.descriptionsServiceName());
    }

}

export default WikiBookService;
