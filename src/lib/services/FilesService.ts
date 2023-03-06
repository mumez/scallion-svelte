import appConfig from '../configs';
import BaseApiService from './BaseApiService';
import WebDavAccessor from '$lib/utils/WebDavAccessor';

class FilesService extends BaseApiService {
	protected wikiName = '';
	protected pageName = '';

	constructor(wikiName: string, pageName: string) {
		super();
		this.wikiName = wikiName;
		this.pageName = pageName;
	}

	public async files() {
		return await this.webDavAccessor.propfind(rootUri);
	}

	public async uploadFiles(files: File[]) {
		files.forEach((each) => {
			this.webDavAccessor.put(`${rootUri}/${each.name}`, each);
		});
	}

	// accessing
	get webDavAccessor() {
		return new WebDavAccessor(this.fetch, this.webDavBaseUrl);
	}
	get webDavBaseUrl() {
		return appConfig.webDav.baseUrl;
	}

	targetUrl() {
		return `${this.serviceName()}?wiki=${this.wikiName}&name=${this.pageName}`;
	}
}

export default FilesService;
