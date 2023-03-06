import WebApiAccessor from './WebApiAccessor';
import WebDavEntry from './WebDavEntry';

const ns = 'DAV:';
const domParser = new DOMParser();

function entriesFromXml(xmlString: string): WebDavEntry[] {
	const dom = domParser.parseFromString(xmlString, 'application/xml');
	const elements = dom.documentElement.getElementsByTagNameNS(ns, 'response');
	const entries = [];
	for (const elem of elements) {
		const entry = new WebDavEntry();
		entry.name = tagContentNamed('displayname', elem);
		entry.href = tagContentNamed('href', elem);
		if (checkIsDirectory(elem)) {
			entry.isDirectory = true;
		} else {
			entry.contentLength = +tagContentNamed('getcontentlength', elem);
			entry.contentType = tagContentNamed('getcontenttype', elem);
			entry.etag = tagContentNamed('getetag', elem);
		}
		entry.lastModified = tagContentNamed('getlastmodified', elem);
		entry.status = tagContentNamed('status', elem);
		entries.push(entry);
	}
	return entries;
}

function tagContentNamed(localName: string, domElem: Element): string {
	return domElem.getElementsByTagNameNS(ns, localName).item(0)?.innerHTML ?? '';
}

function checkIsDirectory(domElem: Element): boolean {
	const elem = domElem.getElementsByTagNameNS(ns, 'resourcetype').item(0);
	if (!elem) {
		return false;
	}
	return (elem.getElementsByTagNameNS(ns, 'collection')?.length ?? 0) > 0;
}

export class WebDavAccessor extends WebApiAccessor {

	public override async put(url: string, body: File): Promise<boolean> {
		const resp = await this.updatingRequest('PUT', url, body);
		return resp.ok && resp.status === 201;
	}

	public async propfind(
		url: string,
		depth = 1,
	): Promise<WebDavEntry[]> {
		const resp = await this.fetch(url, {
			method: 'PROPFIND',
			mode: 'cors',
			headers: {
				...this.headers,
				Depth: String(depth),
			},
		});
		return entriesFromXml(await resp.text());
	}

	public async mkcol(url: string): Promise<boolean> {
		const resp = await this.fetch(url, {
			method: 'MKCOL',
			mode: 'cors',
			headers: this.headers
		});
		return resp.ok && resp.status === 201;
	}

	public async move(fromUrl: string, toUrl: string): Promise<boolean> {
		const resp = await this.fetch(fromUrl, {
			method: 'MOVE',
			mode: 'cors',
			headers: {
				...this.headers,
				Destination: toUrl
			}
		});
		return resp.ok && resp.status === 201;
	}
}

export default WebDavAccessor;
