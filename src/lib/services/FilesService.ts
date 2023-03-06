import appConfig from '../configs';
import BaseApiService from './BaseApiService';
import WebDavAccessor from '$lib/utils/WebDavAccessor';
import type WebDavEntry from '$lib/utils/WebDavEntry';

class FilesService extends BaseApiService {
	protected wikiName = '';
	protected pageName = '';

	constructor(wikiName: string, pageName: string) {
		super();
		this.wikiName = wikiName;
		this.pageName = pageName;
	}

	public async files(): Promise<WebDavEntry[]> {
		return await this.webDavAccessor.propfind(this.targetUrl());
	}

	public async uploadFiles(files: File[]) {
		files.forEach((each) => {
			this.webDavAccessor.put(`${this.targetUrl()}/${each.name}`, each);
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
		return `${this.wikiName}/${this.pageName}`;
	}
}

export default FilesService;
