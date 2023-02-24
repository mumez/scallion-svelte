import ky from 'ky';

import WebApiAccessor from './WebApiAccessor'
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
    if (!elem) { return false; }
    return (elem.getElementsByTagNameNS(ns, 'collection')?.length ?? 0) > 0;
}

export class WebDav extends WebApiAccessor {

    constructor(headers: {jwt: string} = {jwt: ''}) {
        super(headers);
    }

    public async propfind(url: string, depth: number = 1, headers: object = {api: true}): Promise<WebDavEntry[]> {
        const resp = await this.ky(url, {
            method: 'PROPFIND',
            headers: {
                Depth: String(depth),
                ...headers,
            },
            mode: 'cors',
        });
        return entriesFromXml(await resp.text());
    }

    public async mkcol(url: string): Promise<boolean> {
        const resp = await this.ky(url, {
            method: 'MKCOL',
            mode: 'cors',
        });
        return (resp.ok && resp.status === 201);
    }

    public async move(fromUrl: string, toUrl: string): Promise<boolean> {
        const resp = await this.ky(fromUrl, {
            method: 'MOVE',
            headers: {
                Destination: toUrl,
            },
            mode: 'cors',
        });
        return (resp.ok && resp.status === 201);
    }

}

export default WebDav;
