import { concatPath } from './FileUtils';

export class WebApiAccessor {
	protected baseUrl = '';
	protected fetch: typeof fetch;
	protected headers = new Headers();

	constructor(fetcher: typeof fetch, baseUrl = '') {
		this.fetch = fetcher;
		this.baseUrl = baseUrl;
	}

	public setJwt(jwt: string) {
		this.headers.set('Authorization', `Bearer ${jwt}`);
	}

	public async get(url: string): Promise<unknown> {
		return (await this.request('GET', url)).json();
	}

	public async post(url: string, body: BodyInit): Promise<boolean> {
		return (await this.updatingRequest('POST', url, body)).json();
	}

	public async put(url: string, body: BodyInit): Promise<unknown> {
		return (await this.updatingRequest('PUT', url, body)).json();
	}

	public async delete(url: string): Promise<boolean> {
		const resp = await this.request('DELETE', url);
		return resp.ok && resp.status === 201;
	}

	protected async request(method: string, url: string) {
		const resp = await this.fetch(this.buildUrl(url), {
			method: method,
			mode: 'cors',
			headers: this.headers
		});
		return resp;
	}
	protected async updatingRequest(method: string, url: string, body: BodyInit) {
		const resp = await this.fetch(this.buildUrl(url), {
			method: method,
			body: body,
			mode: 'cors',
			headers: this.headers
		});
		return resp;
	}

	protected buildUrl(urlPart: string): string {
		return concatPath(this.baseUrl, urlPart);
	}
}

export default WebApiAccessor;
