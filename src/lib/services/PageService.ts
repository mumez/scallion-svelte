import BaseService from './BaseService';
import PageContent from '@/models/PageContent';

import UserService from '@/services/UserService';
const userService = new UserService();

const defaults: PageContent[] = [
    { updatedAt: 1652938507239, updatedBy: '', versionNumber: 2, content: 'latest' },
    { updatedAt: 1652938484058, updatedBy: '', versionNumber: 1, content: 'back 1' },
];

class PageService extends BaseService {
    protected _pageNumber: string = '';
    protected _wikiName: string = '';

    public async allVersions(): Promise<PageContent[]> {
        return await this.getFromMockStorage(this.pageFullKey());
    }

    public async latestVersion(): Promise<PageContent> {
        const versions = await this.allVersions();
        return versions[0];
    }

    public async saveContent(textContent: string): Promise<PageContent> {
        const versions = await this.allVersions();
        const newVersion: PageContent = {
            updatedAt: new Date().getTime(),
            updatedBy: userService.email,
            versionNumber: versions.length + 1,
            content: textContent,
        };
        versions.unshift(newVersion);
        await this.putToMockStorage(this.pageFullKey(), versions);
        return newVersion;
    }

    public pageFullKey(): string {
        return `${this.serviceName()}:versions:${this._wikiName}:${this._pageNumber}`;
    }

    public serviceName(): string {
        return 'page';
    }

    // accessing
    get pageNumber() {
        return this._pageNumber;
    }
    set pageNumber(pageNumber) {
        this._pageNumber = pageNumber;
    }
    get wikiName() {
        return this._pageNumber;
    }
    set wikiName(wikiName) {
        this._wikiName = wikiName;
    }

    // populating
    public async populateDefaults() {
        await this.putToMockStorage(this.pageFullKey(), defaults);
    }

    public async populateDefaultsIfEmpty() {
        const populated = await this.allVersions();
        if (!populated) {
            await this.populateDefaults();
        }
    }
}

export default PageService;
