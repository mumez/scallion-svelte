import BaseService from './BaseService';
import WikiDescription from '@/models/WikiDescription';

const defaults: WikiDescription[] = [
    { name: 'ume', title: 'ume swiki', pageCount: 12, url: '/wiki-page/ume/1' },
    { name: 'squeak', title: 'squeak swiki', pageCount: 12, url: '/wiki-page/squeak/2' },
];

class WikiService extends BaseService {
    public async listDescriptions(): Promise<WikiDescription[]> {
        return await this.getFromMockStorage(this.descriptionsServiceName());
    }

    public descriptionsServiceName(): string {
        return 'wiki:allDescriptions';
    }

    public serviceName(): string {
        return 'wiki';
    }

    // populating
    public async populateDefaults() {
        await this.putToMockStorage(this.descriptionsServiceName(), defaults);
    }

    public async populateDefaultsIfEmpty() {
        const populated = await this.listDescriptions();
        if (!populated) {
            await this.populateDefaults();
        }
    }
}

export default WikiService;
