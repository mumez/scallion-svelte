import BaseApiService from './BaseApiService';
import type PageContent from '$lib/models/PageContent';


class PageService extends BaseApiService {
    protected wikiName = '';
    protected pageName = '';

    constructor(wikiName: string, pageName: string) {
        super();
        this.wikiName = wikiName;
        this.pageName = pageName;
    }

    public async saveContent(textContent: string): Promise<PageContent> {
        const versions = await this.allVersions();
        const newVersion: PageContent = {
            updatedAt: new Date().getTime(),
            updatedBy: userService.email,
            versionNumber: versions.length + 1,
            content: textContent,
        };
        return newVersion;
    }

    public async getContent(): Promise<PageContent> {
        const url = `${this.serviceName()}?wiki=${this.wikiName}&name=test1`;
        const resp = await this.apiAccessor.get(url).catch(e => { return {}; });
        console.log('-resp----', url, resp);
        return resp as PageContent;
    }

    public override serviceName(): string {
        return 'page';
    }

    // accessing
    getPageName() {
        return this.pageName;
    }
    getWikiName() {
        return this.pageNumber;
    }

}

export default PageService;
