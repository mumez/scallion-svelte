import ky from 'ky';

import BaseService from './BaseService';
import type { WikiBook } from '$lib/models/WikiBook';

class WikiBookService extends BaseService {
    public async listBooks(): Promise<WikiBook[]> {
        const resp = await this.apiAccessor.get('wikis').catch(e => { return []; });
        console.log('resp :>> ', resp);
        const books = Object.values(resp as object) as WikiBook[];
        return books.sort((a, b) => (a.name < b.name) ? 1 : -1);
    }
}

export default new WikiBookService();
