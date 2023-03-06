import WebApiAccessor from './WebApiAccessor';
import type WebDavEntry from './WebDavEntry';
import { XMLParser } from 'fast-xml-parser';

const options = {
	ignoreDeclaration: true,
	ignorePiTags: true,
	removeNSPrefix: true,
};

function entriesFromXml(xmlString: string): WebDavEntry[] {
	const xmlParser = new XMLParser(options);
	const parsed = xmlParser.parse(xmlString);
	const response = parsed?.multistatus?.response ?? [];
	const entries: WebDavEntry[] = [];
	for (const element of response) {
		const props = element.propstat?.prop ?? {};
		console.log('elem :>> ', props);
		const entry = newEntry();
		entry.href = element['href'];
		entry.status = element.propstat?.status ?? '';
		entry.name = props['displayname'];
		entry.contentType = props['getcontenttype'];
		entry.contentLength = props['getcontentlength'];
		entry.etag = props['getetag'];
		entry.lastModified = props['getlastmodified'];
		entry.isDirectory = checkIsDirectory(props['resourcetype']);
		entries.push(entry);
	}
	return entries;
}

function newEntry(): WebDavEntry {
	return {
		name: '',
		href: '',
		contentType: '',
		contentLength: 0,
		lastModified: '',
		etag: '',
		status: '',
		isDirectory: false
	}
}

function checkIsDirectory(resourceTypeProps = {}): boolean {
	if (!resourceTypeProps) return false;
	return ('collection' in resourceTypeProps);
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
		const resp = await this.fetch(this.buildUrl(url), {
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
		const resp = await this.fetch(this.buildUrl(url), {
			method: 'MKCOL',
			mode: 'cors',
			headers: this.headers
		});
		return resp.ok && resp.status === 201;
	}

	public async move(fromUrl: string, toUrl: string): Promise<boolean> {
		const resp = await this.fetch(this.buildUrl(fromUrl), {
			method: 'MOVE',
			mode: 'cors',
			headers: {
				...this.headers,
				Destination: (this.buildUrl(toUrl))
			}
		});
		return resp.ok && resp.status === 201;
	}
}

export default WebDavAccessor;
