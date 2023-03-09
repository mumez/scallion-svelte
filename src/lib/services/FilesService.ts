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

	public async filesAndDirectories(): Promise<WebDavEntry[]> {
		return await this.webDavAccessor.propfind(this.targetUrl());
	}

	public async files(): Promise<WebDavEntry[]> {
		return (await this.filesAndDirectories()).filter((each) => !each.isDirectory);
	}

	public async uploadFiles(files: File[], jwt = '') {
		return files.map((each) => {
			return this.uploadFile(each, jwt);
		});
	}

	public uploadFile(file: File, jwt = ''): Promise<boolean> {
		const acc = this.webDavAccessor;
		acc.setJwt(jwt);
		return acc.put(`${this.targetUrl()}/${file.name}`, file);
	}

	// accessing
	get webDavAccessor() {
		return new WebDavAccessor(this.fetch, this.webDavBaseUrl);
	}
	get webDavBaseUrl() {
		return appConfig.webDav.baseUrl;
	}
	get downloadBaseUrl() {
		return `${this.webDavBaseUrl}${this.targetUrl()}`;
	}

	public targetUrl() {
		return `${this.wikiName}/${this.pageName}`;
	}
}

export default FilesService;
